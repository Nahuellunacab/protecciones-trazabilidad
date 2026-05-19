import { useEffect, useState } from "react";

import {
    obtenerReles,
    crearRele
} from "../services/releService";

import type { Rele } from "../types/Rele";
import type { ReleRequest } from "../types/ReleRequest";

function RelePage() {

    const [reles, setReles] = useState<Rele[]>([]);

    const [formData, setFormData] =
        useState<ReleRequest>({
            numeroSerie: "",
            garantiaMeses: 12,
            modeloId: 1,
            remitoId: 1
        });

    useEffect(() => {

        cargarReles();

    }, []);

    const cargarReles = async () => {

        const data = await obtenerReles();

        setReles(data);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: name === "garantiaMeses"
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

        await crearRele(formData);

        await cargarReles();

        setFormData({
            numeroSerie: "",
            garantiaMeses: 12,
            modeloId: 1,
            remitoId: 1
        });
    };

    return (

        <div style={{ padding: "20px" }}>

            <h1>Relés</h1>

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
                        placeholder="Garantía"
                        value={formData.garantiaMeses}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <input
                        type="number"
                        name="modeloId"
                        placeholder="Modelo ID"
                        value={formData.modeloId}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <div>
                    <input
                        type="number"
                        name="remitoId"
                        placeholder="Remito ID"
                        value={formData.remitoId}
                        onChange={handleChange}
                    />
                </div>

                <br />

                <button type="submit">
                    Crear Relé
                </button>

            </form>

            <hr />

            <table border={1} cellPadding={10}>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Número Serie</th>
                        <th>Modelo</th>
                        <th>Marca</th>
                    </tr>

                </thead>

                <tbody>

                    {reles.map((rele) => (

                        <tr key={rele.id}>

                            <td>{rele.id}</td>
                            <td>{rele.numeroSerie}</td>
                            <td>{rele.modelo}</td>
                            <td>{rele.marca}</td>

                        </tr>
                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default RelePage;