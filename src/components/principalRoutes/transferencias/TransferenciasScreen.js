import { useState } from "react";
import { useSelector } from "react-redux";
import { Buttons } from "../../ui/buttons/Buttons"
import { Select } from "../../ui/selects/Select"
import { TableTranferencias } from "../../ui/tables/TableTranferencias"

export const TransferenciasScreen = ({ tipo }) => {

    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre','diciembre' ]
    const [mesFiltro, setMesFiltro] = useState( meses[ new Date().getMonth() ] );

    const handleChangeMes = e => {
        setMesFiltro( e.target.value )
    }

    const { movs } = useSelector(state => state.movs );

    const transferencias = movs.filter( el => meses[el.fecha.getMonth()] === mesFiltro ).filter( el => el.tipo === tipo );


    return (
        <div className='container-view tabla-general'>
            <Select options={ meses } actualizarState={ handleChangeMes } state={ mesFiltro } />
            { tipo === 'transferencia' && <h1>Transferencias</h1> }
            { tipo === 'compraActivos' && <h1>Compras</h1> }
            { tipo === 'ventaActivos' && <h1>Ventas</h1> }
            <TableTranferencias elementos={ transferencias }/>
            <Buttons />
        </div>
    )
}
