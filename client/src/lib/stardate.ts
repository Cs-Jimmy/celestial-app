export function generateStardate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return `${year}.${dayOfYear.toString().padStart(3, '0')}`;
}

export function formatStardate(date: Date): string {
  const year = date.getFullYear();
  const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return `${year}.${dayOfYear.toString().padStart(3, '0')}`;
}
