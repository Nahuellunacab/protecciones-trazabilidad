import type { Rele } from "../types/Rele";

interface Props {
    reles: Rele[];
}

function ReleTable({ reles }: Props) {

    return (

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
    );
}

export default ReleTable;