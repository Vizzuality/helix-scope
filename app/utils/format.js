const PREFIXES = {
  12: 'T',
  9: 'G',
  6: 'M',
  3: 'k',
  0: ''
};

export function formatSI(num) {
  let number = num;
  let exponent = 0;

  while (Math.abs(number) >= 1000) {
    number /= 1000;
    exponent += 3;
  }

  const rounded = parseFloat(Number(number).toFixed(1));

  return rounded + PREFIXES[exponent];
}
