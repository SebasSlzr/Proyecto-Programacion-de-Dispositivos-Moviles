import { describe, expect, test } from '@jest/globals';
import { getInitials } from '@/utils/initials';

describe('getInitials', () => {
  test('usa la primera letra del primer y del último nombre', () => {
    expect(getInitials('Ana María López')).toBe('AL');
    expect(getInitials('Daniel Cuartas')).toBe('DC');
  });

  test('con una sola palabra devuelve una letra', () => {
    expect(getInitials('Bruno')).toBe('B');
  });

  test('pasa a mayúsculas y respeta tildes y eñes', () => {
    expect(getInitials('ñata álvarez')).toBe('ÑÁ');
  });

  test('ignora espacios de más', () => {
    expect(getInitials('   luisa    arango  ')).toBe('LA');
  });

  test('sin nombre devuelve un signo de pregunta', () => {
    expect(getInitials('')).toBe('?');
    expect(getInitials('    ')).toBe('?');
  });
});
