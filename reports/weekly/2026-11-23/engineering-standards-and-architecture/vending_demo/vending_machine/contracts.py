"""Shared data contracts and interfaces for the vending-machine example."""

from dataclasses import dataclass
from typing import Protocol, runtime_checkable


@dataclass(frozen=True)
class Product:
    product_id: str
    name: str


@dataclass(frozen=True)
class PurchaseRequest:
    product_id: str
    inserted_amount: int


@dataclass(frozen=True)
class PaymentResult:
    approved: bool
    transaction_id: str | None = None
    reason: str | None = None


@dataclass(frozen=True)
class PurchaseResult:
    product_id: str
    dispensed_quantity: int
    change: int
    transaction_id: str


@runtime_checkable
class PricingPolicy(Protocol):
    def price_for(self, product: Product) -> int:
        """Return the product price in integer cents."""
        ...


@runtime_checkable
class PaymentProcessor(Protocol):
    def charge(self, amount: int) -> PaymentResult:
        """Attempt to charge an integer amount of cents."""
        ...


@runtime_checkable
class InventoryRepository(Protocol):
    def has_stock(self, product_id: str, quantity: int = 1) -> bool:
        ...

    def dispense(self, product_id: str, quantity: int = 1) -> None:
        ...

    def quantity_of(self, product_id: str) -> int:
        ...
