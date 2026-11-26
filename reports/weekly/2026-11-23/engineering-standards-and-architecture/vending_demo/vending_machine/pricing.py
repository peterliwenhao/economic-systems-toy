"""Pricing implementations."""

from .contracts import Product


class FixedPricingPolicy:
    def __init__(self, prices: dict[str, int]) -> None:
        if any(price <= 0 for price in prices.values()):
            raise ValueError("all prices must be positive")
        self._prices = dict(prices)

    def price_for(self, product: Product) -> int:
        try:
            return self._prices[product.product_id]
        except KeyError as exc:
            raise LookupError(f"missing price for {product.product_id}") from exc
