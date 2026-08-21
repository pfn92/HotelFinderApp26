export function formatAED(amount) {
  return `AED ${Math.round(amount).toLocaleString('en-AE')}`;
}
