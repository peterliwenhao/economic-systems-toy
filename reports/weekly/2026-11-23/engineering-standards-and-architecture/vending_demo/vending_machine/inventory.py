"""Inventory implementations."""


class InMemoryInventory:
    def __init__(self, stock: dict[str, int]) -> None:
        if any(quantity < 0 for quantity in stock.values()):
            raise ValueError("stock cannot be negative")
        self._stock = dict(stock)

    def has_stock(self, product_id: str, quantity: int = 1) -> bool:
        return quantity > 0 and self.quantity_of(product_id) >= quantity

    def dispense(self, product_id: str, quantity: int = 1) -> None:
        if not self.has_stock(product_id, quantity):
            raise LookupError(f"insufficient stock for {product_id}")
        self._stock[product_id] -= quantity

    def quantity_of(self, product_id: str) -> int:
        return self._stock.get(product_id, 0)
