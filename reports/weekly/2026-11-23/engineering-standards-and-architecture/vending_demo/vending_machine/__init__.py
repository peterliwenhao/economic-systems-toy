"""A small, testable vending-machine package used by the slide deck."""

from .contracts import Product, PurchaseRequest, PurchaseResult
from .inventory import InMemoryInventory
from .machine import VendingMachine
from .payment import AlwaysApprovePaymentProcessor
from .pricing import FixedPricingPolicy

__all__ = [
    "AlwaysApprovePaymentProcessor",
    "FixedPricingPolicy",
    "InMemoryInventory",
    "Product",
    "PurchaseRequest",
    "PurchaseResult",
    "VendingMachine",
]
