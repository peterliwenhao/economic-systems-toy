"""Payment implementations used in tests and demonstrations."""

from .contracts import PaymentResult


class AlwaysApprovePaymentProcessor:
    def __init__(self) -> None:
        self._next_id = 1

    def charge(self, amount: int) -> PaymentResult:
        if amount <= 0:
            return PaymentResult(approved=False, reason="amount must be positive")
        transaction_id = f"TX-{self._next_id:04d}"
        self._next_id += 1
        return PaymentResult(approved=True, transaction_id=transaction_id)


class RejectingPaymentProcessor:
    def charge(self, amount: int) -> PaymentResult:
        return PaymentResult(approved=False, reason="payment rejected")
