import { useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Buttons } from "../../ui/buttons/Buttons"
import { Select } from "../../ui/selects/Select"
import { Table } from "../../ui/tables/Table"

export const MovimientosScreen = () => {

    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre','diciembre' ]
    const [mesFiltro, setMesFiltro] = useState( meses[ new Date().getMonth() ] );

    const handleChangeMes = e => {
        setMesFiltro( e.target.value )
    }

    const { movs } = useSelector(state => state.movs)

    const movimientos = movs.filter( el => meses[el.fecha.getMonth()] === mesFiltro ).filter( el => el.tipo !== 'deuda' && el.tipo !== 'prestamo' && el.tipo !== 'transferencia' && el.tipo !== 'deudaACobrar' && el.tipo !== 'compraActivos' && el.tipo !== 'ventaActivos')

    return (
        <>
            <Link to='/' className='go-back'>
                <i className="bi bi-arrow-left-short"></i>
            </Link>
            <div className='container-view'>
                <Select actualizarState={ handleChangeMes } options={ meses } state={ mesFiltro }/>
                <h1 className='movimientos__titulo'>Todos los movimientos</h1>
                <Table movimientos={ movimientos } />
                <Buttons />
            </div>
        </>
    )
}