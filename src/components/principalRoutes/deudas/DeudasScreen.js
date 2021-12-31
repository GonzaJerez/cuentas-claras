import { useSelector } from "react-redux";
import { Buttons } from "../../ui/buttons/Buttons";
import { Table } from "../../ui/tables/Table";

export const DeudasScreen = () => {

    const { movs } = useSelector(state => state.movs );

    const deudas = movs.filter( el => el.tipo === 'deuda' || el.tipo === 'prestamo' );

    return (
        <div className='container-view'>
            <h1>Deudas</h1>
            <Table movimientos={ deudas } cabecera={['Cantidad', 'Motivo','A quien', 'Cuenta', 'Fecha', 'Estado' ]}/>
            <Buttons />
        </div>
    )
}
