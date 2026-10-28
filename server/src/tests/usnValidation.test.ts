import { describe, it, expect } from 'vitest';

describe('USN Normalization & Validation Verification', () => {
  const vtuRegex = /^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$/i;

  function normalizeUsn(raw: string): string {
    return raw.trim().toUpperCase().replace(/\s+/g, '');
  }

  it('should normalize lowercase and spaced USN correctly', () => {
    const raw = '  1ms 21 cs 045   ';
    const normalized = normalizeUsn(raw);
    expect(normalized).toBe('1MS21CS045');
  });

  it('should validate conforming VTU USN patterns', () => {
    const validUsns = ['1MS21CS045', '1rv22ec010', '2ba20me089', '4ni23is101'];
    validUsns.forEach((usn) => {
      const normalized = normalizeUsn(usn);
      expect(vtuRegex.test(normalized)).toBe(true);
    });
  });

  it('should reject invalid USN structures', () => {
    const invalidUsns = ['CS123', '1234567890', 'INVALID', '1MS21CS', '1MS21CS0455'];
    invalidUsns.forEach((usn) => {
      const normalized = normalizeUsn(usn);
      expect(vtuRegex.test(normalized)).toBe(false);
    });
  });
});

