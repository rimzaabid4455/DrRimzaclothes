export const formatAED = (n) =>
  new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-AE', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
