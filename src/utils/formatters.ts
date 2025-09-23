export const formatCurrency = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  });
  return formatter.format(amount);
};
