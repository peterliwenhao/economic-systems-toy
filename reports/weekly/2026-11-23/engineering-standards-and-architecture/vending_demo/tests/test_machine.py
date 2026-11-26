import unittest

from vending_machine import (
    AlwaysApprovePaymentProcessor,
    FixedPricingPolicy,
    InMemoryInventory,
    Product,
    PurchaseRequest,
    VendingMachine,
)
from vending_machine.machine import calculate_change
from vending_machine.payment import RejectingPaymentProcessor


def make_machine(stock: int = 2, payment=None):
    products = {"water": Product("water", "矿泉水")}
    inventory = InMemoryInventory({"water": stock})
    machine = VendingMachine(
        products,
        FixedPricingPolicy({"water": 250}),
        payment or AlwaysApprovePaymentProcessor(),
        inventory,
    )
    return machine, inventory


class ChangeTests(unittest.TestCase):
    def test_change_is_difference(self):
        self.assertEqual(calculate_change(300, 250), 50)

    def test_insufficient_money_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "insufficient money"):
            calculate_change(200, 250)


class PurchaseTests(unittest.TestCase):
    def test_purchase_dispenses_one_and_reduces_stock(self):
        machine, inventory = make_machine()
        result = machine.purchase(PurchaseRequest("water", 300))
        self.assertEqual(result.dispensed_quantity, 1)
        self.assertEqual(result.change, 50)
        self.assertEqual(inventory.quantity_of("water"), 1)

    def test_exact_amount_has_zero_change(self):
        machine, _ = make_machine()
        self.assertEqual(machine.purchase(PurchaseRequest("water", 250)).change, 0)

    def test_last_item_can_be_purchased(self):
        machine, inventory = make_machine(stock=1)
        machine.purchase(PurchaseRequest("water", 250))
        self.assertEqual(inventory.quantity_of("water"), 0)

    def test_out_of_stock_is_rejected(self):
        machine, _ = make_machine(stock=0)
        with self.assertRaisesRegex(LookupError, "out of stock"):
            machine.purchase(PurchaseRequest("water", 250))

    def test_unknown_product_is_rejected(self):
        machine, _ = make_machine()
        with self.assertRaisesRegex(LookupError, "unknown product"):
            machine.purchase(PurchaseRequest("coffee", 300))

    def test_payment_failure_keeps_stock(self):
        machine, inventory = make_machine(payment=RejectingPaymentProcessor())
        with self.assertRaisesRegex(RuntimeError, "payment rejected"):
            machine.purchase(PurchaseRequest("water", 300))
        self.assertEqual(inventory.quantity_of("water"), 2)


if __name__ == "__main__":
    unittest.main()
