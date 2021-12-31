import { useSelector } from "react-redux";
import { Buttons } from "../../ui/buttons/Buttons";
import { Table } from "../../ui/tables/Table";

export const DeudasACobrarScreen = () => {

    const { movs } = useSelector(state => state.movs );

    const deudasACobrar = movs.filter( el => el.tipo === 'deudaACobrar' || el.tipo === 'prestamoACobrar' );

    return (
        <div className='container-view'>
            <h1>Deudas a cobrar</h1>
            <Table movimientos={ deudasACobrar } cabecera={['Cantidad', 'Motivo','De quien', 'Cuenta', 'Fecha', 'Estado' ]}/>
            <Buttons />
        </div>
    )
}
