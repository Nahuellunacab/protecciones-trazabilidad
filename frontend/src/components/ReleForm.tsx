import { useState } from "react";

import type { ReleRequest } from "../types/ReleRequest";

interface Props {
    onCreate: (data: ReleRequest) => Promise<void>;
}

function ReleForm({ onCreate }: Props) {

    const [formData, setFormData] =
        useState<ReleRequest>({
            numeroSerie: "",
            garantiaMeses: 12,
            modeloId: 1,
            remitoId: 1
        });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]:
                name === "garantiaMeses"
                || name === "modeloId"
                || name === "remitoId"
                    ? Number(value)
                    : value
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        await onCreate(formData);

        setFormData({
            numeroSerie: "",
            garantiaMeses: 12,
            modeloId: 1,
            remitoId: 1
        });
    };

    return (

        <form onSubmit={handleSubmit}>

            <div>
                <input
                    type="text"
                    name="numeroSerie"
                    placeholder="Número Serie"
                    value={formData.numeroSerie}
                    onChange={handleChange}
                />
            </div>

            <br />

            <div>
                <input
                    type="number"
                    name="garantiaMeses"
                    value={formData.garantiaMeses}
                    onChange={handleChange}
                />
            </div>

            <br />

            <div>
                <input
                    type="number"
                    name="modeloId"
                    value={formData.modeloId}
                    onChange={handleChange}
                />
            </div>

            <br />

            <div>
                <input
                    type="number"
                    name="remitoId"
                    value={formData.remitoId}
                    onChange={handleChange}
                />
            </div>

            <br />

            <button type="submit">
                Crear Relé
            </button>

        </form>
    );
}

export default ReleForm;