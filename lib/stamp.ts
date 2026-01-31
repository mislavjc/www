// Random rotation for that stamped look
export function getRandomRotation() {
  return Math.random() * 16 - 8; // -8 to 8 degrees
}

// Format current date as passport stamp date
export function getStampDate() {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(new Date())
    .toUpperCase();
}
