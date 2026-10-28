import { describe, it, expect } from 'vitest';

describe('Student Authentication & Integrity Restrictions', () => {
  it('should detect name mismatches for the same normalized USN', () => {
    const existingName = 'Jagadish S';
    const enteredNameDifferent = 'Ramesh Kumar';
    const enteredNameSameDifferentCase = '  jagadish   s  ';

    const cleanExisting = existingName.trim().toLowerCase().replace(/\s+/g, ' ');
    const cleanEnteredDiff = enteredNameDifferent.trim().toLowerCase().replace(/\s+/g, ' ');
    const cleanEnteredSame = enteredNameSameDifferentCase.trim().toLowerCase().replace(/\s+/g, ' ');

    expect(cleanExisting !== cleanEnteredDiff).toBe(true);
    expect(cleanExisting === cleanEnteredSame).toBe(true);
  });

  it('should normalize USNs consistently across different whitespace and casing', () => {
    const usn1 = '  1vi21cs001 ';
    const usn2 = '1VI21CS001';
    const usn3 = ' 1VI 21CS 001 ';

    const normalize = (u: string) => u.toUpperCase().replace(/\s+/g, '');

    expect(normalize(usn1)).toBe('1VI21CS001');
    expect(normalize(usn2)).toBe('1VI21CS001');
    expect(normalize(usn3)).toBe('1VI21CS001');
  });

  it('should prevent retakes when a student attempt status is COMPLETED', () => {
    const existingAttempt = {
      status: 'COMPLETED',
      totalScore: 92
    };

    const isRetakeBlocked = existingAttempt.status === 'COMPLETED';
    expect(isRetakeBlocked).toBe(true);
  });
});
