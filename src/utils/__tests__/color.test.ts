import { describe, expect, test } from '@jest/globals';
import { getColorFamily, hexToHsl, hueDistance, isNeutral } from '@/utils/color';

describe('utilidades de color', () => {
  test('negro, blanco, gris y beige son neutros', () => {
    for (const hex of ['#1F1B18', '#FFFFFF', '#4A4A4A', '#D8D4CB', '#D4B996']) {
      expect(isNeutral(hex)).toBe(true);
      expect(getColorFamily(hex)).toBe('neutro');
    }
  });

  test('un jean combina con todo pero se filtra como azul', () => {
    expect(isNeutral('#3B4E6B')).toBe(true);
    expect(getColorFamily('#3B4E6B')).toBe('azul');
  });

  test('reconoce las familias principales', () => {
    expect(getColorFamily('#2E5BCC')).toBe('azul');
    expect(getColorFamily('#C0392B')).toBe('rojo');
    expect(getColorFamily('#6B2F3A')).toBe('rojo');     // vino tinto
    expect(getColorFamily('#C9A0A0')).toBe('rosa');     // rosado suave
    expect(getColorFamily('#E67E22')).toBe('naranja');
    expect(getColorFamily('#8B7355')).toBe('cafe');
    expect(getColorFamily('#F1C40F')).toBe('amarillo');
    expect(getColorFamily('#27AE60')).toBe('verde');
    expect(getColorFamily('#8E44AD')).toBe('morado');
  });

  test('un color saturado no es neutro', () => {
    expect(isNeutral('#2E5BCC')).toBe(false);
    expect(isNeutral('#E67E22')).toBe(false);
  });

  test('hueDistance da la distancia corta en el círculo', () => {
    expect(hueDistance(350, 10)).toBe(20);
    expect(hueDistance(0, 180)).toBe(180);
    expect(hueDistance(30, 30)).toBe(0);
  });

  test('hexToHsl acepta #RGB y rechaza valores inválidos', () => {
    expect(hexToHsl('#fff').l).toBe(1);
    expect(() => hexToHsl('azul')).toThrow();
    expect(getColorFamily('azul')).toBe('neutro');
  });
});