const PREFIXES = {
  12: 'T',
  9: 'G',
  6: 'M',
  3: 'k',
  0: ''
};

export function formatSI(num) {
  if (num === 0) {
    return '0';
  }
  let sig = Math.abs(num); // significand
  let exponent = 0;
  while (sig >= 1000) {
    sig /= 1000;
    exponent += 3;
  }

  const signPrefix = num < 0 ? '-' : '';
  return signPrefix + parseFloat(sig.toFixed(1)) + PREFIXES[exponent];
}
