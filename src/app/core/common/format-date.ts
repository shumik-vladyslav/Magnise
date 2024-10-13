export function formatDate(dateParams: string): string {
  const date = new Date(dateParams);
  return date.toISOString().slice(0, 19).replace('T', ' ');
}
