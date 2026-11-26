from vending_machine import (
    AlwaysApprovePaymentProcessor,
    FixedPricingPolicy,
    InMemoryInventory,
    Product,
    PurchaseRequest,
    VendingMachine,
)


products = {"water": Product(product_id="water", name="矿泉水")}
inventory = InMemoryInventory({"water": 3})
machine = VendingMachine(
    products=products,
    pricing=FixedPricingPolicy({"water": 250}),
    payment=AlwaysApprovePaymentProcessor(),
    inventory=inventory,
)

result = machine.purchase(PurchaseRequest(product_id="water", inserted_amount=300))
print(result)
print(f"remaining_stock={inventory.quantity_of('water')}")
