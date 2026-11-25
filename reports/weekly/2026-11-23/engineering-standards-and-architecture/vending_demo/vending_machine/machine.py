"""Application service that coordinates the vending-machine purchase flow."""

from .contracts import (
    InventoryRepository,
    PaymentProcessor,
    PricingPolicy,
    Product,
    PurchaseRequest,
    PurchaseResult,
)


def calculate_change(inserted_amount: int, price: int) -> int:
    if inserted_amount < 0 or price <= 0:
        raise ValueError("amounts must be valid integer cents")
    if inserted_amount < price:
        raise ValueError("insufficient money")
    return inserted_amount - price


class VendingMachine:
    def __init__(
        self,
        products: dict[str, Product],
        pricing: PricingPolicy,
        payment: PaymentProcessor,
        inventory: InventoryRepository,
    ) -> None:
        self._products = dict(products)
        self._pricing = pricing
        self._payment = payment
        self._inventory = inventory

    def purchase(self, request: PurchaseRequest) -> PurchaseResult:
        try:
            product = self._products[request.product_id]
        except KeyError as exc:
            raise LookupError(f"unknown product: {request.product_id}") from exc

        if not self._inventory.has_stock(product.product_id):
            raise LookupError(f"out of stock: {product.product_id}")

        price = self._pricing.price_for(product)
        change = calculate_change(request.inserted_amount, price)
        payment = self._payment.charge(price)
        if not payment.approved or payment.transaction_id is None:
            raise RuntimeError(payment.reason or "payment failed")

        self._inventory.dispense(product.product_id)
        return PurchaseResult(
            product_id=product.product_id,
            dispensed_quantity=1,
            change=change,
            transaction_id=payment.transaction_id,
        )
