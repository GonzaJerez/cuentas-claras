import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { cerrarModoEdicionCategorias } from "../../../actions/categoriasActions"
import { AcordeonTable } from "../../ui/acordeon/AcordeonTable"
import { Buttons } from "../../ui/buttons/Buttons"
import { Select } from "../../ui/selects/Select"

export const CategoriesScreen = () => {

    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre','diciembre' ]
    const [mesFiltro, setMesFiltro] = useState( meses[ new Date().getMonth() ] );

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch( cerrarModoEdicionCategorias())
        }
    }, [ dispatch ])

    const handleChangeMes = e => {
        setMesFiltro( e.target.value )
    }

    const { movs } = useSelector(state => state.movs )
    const { categorias } = useSelector(state => state.cats )

    const movimientos = movs.filter( el => meses[ new Date( el.fecha ).getMonth()] === mesFiltro ).filter( el => el.tipo !== 'deuda' && el.tipo !== 'prestamo' && el.tipo !== 'transferencia' && el.tipo !== 'deudaACobrar' && el.tipo !== 'compraActivos' && el.tipo !== 'ventaActivos');
    
    const categoriasTotales = categorias.sort( (a,b) => a.nombre > b.nombre ? 1 : -1 )

    return (
        <div className='container-view'>
            <Select options={ meses } actualizarState={ handleChangeMes } state={ mesFiltro }/>
            <h1>Categorias</h1>
            <AcordeonTable categorias={ categoriasTotales } tableElements={ movimientos }/>
            <Buttons botonEditarVisible={ true } ruta='categorias'/>
        </div>
    )
}