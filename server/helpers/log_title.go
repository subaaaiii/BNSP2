package helpers

const (
	StatusPending = "PENDING"
	StatusPaid    = "PAID"
	StatusFailed  = "FAILED"
	StatusExpired = "EXPIRED"
)

func GenerateLogTitle(status string) string {
	switch status {
	case StatusPaid:
		return "Payment successful. Order is being processed."
	case StatusFailed:
		return "Payment failed."
	case StatusExpired:
		return "Payment expired."
	default:
		return "Order updated."
	}
}
