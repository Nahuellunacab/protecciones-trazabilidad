import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import EmptyState from "./EmptyState";

describe("EmptyState", () => {

  it("muestra el título", () => {

    render(<EmptyState titulo="No hay relés cargados" />);

    expect(
      screen.getByText("No hay relés cargados")
    ).toBeInTheDocument();
  });

  it("muestra el subtítulo solo si se pasa como prop", () => {

    const { rerender } = render(
      <EmptyState titulo="Título" />
    );

    expect(screen.queryByText("Subtítulo")).not.toBeInTheDocument();

    rerender(
      <EmptyState
        titulo="Título"
        subtitulo="Subtítulo"
      />
    );

    expect(screen.getByText("Subtítulo")).toBeInTheDocument();
  });
});
