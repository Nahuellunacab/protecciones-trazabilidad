import {
  describe,
  it,
  expect,
  vi,
  afterEach
} from "vitest";

import { tiempoRelativo } from "./tiempoRelativo";

const AHORA = new Date("2026-07-21T12:00:00.000Z").getTime();

function hace(msAtras: number): string {

  return new Date(AHORA - msAtras).toISOString();
}

describe("tiempoRelativo", () => {

  afterEach(() => {

    vi.useRealTimers();
  });

  it("devuelve 'recién' para fechas de menos de 1 minuto", () => {

    vi.useFakeTimers();
    vi.setSystemTime(AHORA);

    expect(tiempoRelativo(hace(30 * 1000))).toBe("recién");
  });

  it("devuelve minutos para fechas de entre 1 y 59 minutos", () => {

    vi.useFakeTimers();
    vi.setSystemTime(AHORA);

    expect(tiempoRelativo(hace(5 * 60 * 1000))).toBe("hace 5 min");
  });

  it("devuelve horas en singular cuando es exactamente 1 hora", () => {

    vi.useFakeTimers();
    vi.setSystemTime(AHORA);

    expect(tiempoRelativo(hace(60 * 60 * 1000))).toBe("hace 1 hora");
  });

  it("devuelve horas en plural para más de 1 hora", () => {

    vi.useFakeTimers();
    vi.setSystemTime(AHORA);

    expect(tiempoRelativo(hace(3 * 60 * 60 * 1000))).toBe("hace 3 horas");
  });

  it("devuelve días en singular cuando es exactamente 1 día", () => {

    vi.useFakeTimers();
    vi.setSystemTime(AHORA);

    expect(tiempoRelativo(hace(24 * 60 * 60 * 1000))).toBe("hace 1 día");
  });

  it("devuelve días en plural para más de 1 día", () => {

    vi.useFakeTimers();
    vi.setSystemTime(AHORA);

    expect(tiempoRelativo(hace(3 * 24 * 60 * 60 * 1000))).toBe("hace 3 días");
  });
});
