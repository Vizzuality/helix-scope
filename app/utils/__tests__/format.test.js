import { formatSI } from 'utils/format';

describe('utils', () => {
  describe('formatSI', () => {
    it('should return k for thousands', () => {
      expect(formatSI(1000)).toBe('1k');
      expect(formatSI(45000)).toBe('45k');
      expect(formatSI(-45000)).toBe('-45k');
    });

    it('should return M for milions', () => {
      expect(formatSI(1000000)).toBe('1M');
      expect(formatSI(30000000)).toBe('30M');
      expect(formatSI(-30000000)).toBe('-30M');
    });

    it('should return G for bilions', () => {
      expect(formatSI(1000000000)).toBe('1G');
      expect(formatSI(30000000000)).toBe('30G');
      expect(formatSI(-30000000000)).toBe('-30G');
    });

    it('should return T for trylions', () => {
      expect(formatSI(1000000000000)).toBe('1T');
      expect(formatSI(30000000000000)).toBe('30T');
      expect(formatSI(-30000000000000)).toBe('-30T');
    });

    it('should not include prefix for numbers less than 1000', () => {
      expect(formatSI(0)).toBe('0');
      expect(formatSI(999)).toBe('999');
      expect(formatSI(43.2344)).toBe('43.2');
    });

    it('should have precision set up to 1 decimal place', () => {
      expect(formatSI(1200)).toBe('1.2k');
      expect(formatSI(34400)).toBe('34.4k');
      expect(formatSI(-34400)).toBe('-34.4k');

      expect(formatSI(0.2344)).toBe('0.2');
      expect(formatSI(0.02344)).toBe('0');
      expect(formatSI(-0.02344)).toBe('0');
    });

    it('should round the value up to 1 decimal place precision', () => {
      expect(formatSI(34460)).toBe('34.5k');
      expect(formatSI(3451)).toBe('3.5k');
      expect(formatSI(-3451)).toBe('-3.5k');
    });
  });
});
