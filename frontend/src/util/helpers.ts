export function formatCurrency(currency: number) {
  return new Intl.NumberFormat("us-US", {
    style: "currency",
    currency: "USD",
  }).format(currency);
}
