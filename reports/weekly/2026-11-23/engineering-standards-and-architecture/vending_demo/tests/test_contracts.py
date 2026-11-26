import unittest

from vending_machine.contracts import InventoryRepository, PaymentProcessor, PricingPolicy
from vending_machine.inventory import InMemoryInventory
from vending_machine.payment import AlwaysApprovePaymentProcessor
from vending_machine.pricing import FixedPricingPolicy


class ProtocolConformanceTests(unittest.TestCase):
    def test_implementations_match_runtime_checkable_protocols(self):
        self.assertIsInstance(FixedPricingPolicy({"water": 250}), PricingPolicy)
        self.assertIsInstance(AlwaysApprovePaymentProcessor(), PaymentProcessor)
        self.assertIsInstance(InMemoryInventory({"water": 1}), InventoryRepository)


if __name__ == "__main__":
    unittest.main()
