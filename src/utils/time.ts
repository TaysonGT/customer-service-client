export const formatDate = (dateString: string, opts?:{withTime?: boolean}) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...opts?.withTime?({hour: '2-digit', minute: '2-digit'}) : {}
  });
};