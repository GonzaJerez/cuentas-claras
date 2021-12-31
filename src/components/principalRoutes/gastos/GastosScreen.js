import { useState } from "react";
import { useSelector } from "react-redux";
import { AcordeonTable } from "../../ui/acordeon/AcordeonTable";
import { Buttons } from "../../ui/buttons/Buttons";
import { Select } from "../../ui/selects/Select";

export const GastosScreen = () => {

    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre','noviembre','diciembre' ]
    const [mesFiltro, setMesFiltro] = useState( meses[ new Date().getMonth() ] );

    const handleChangeMes = e => {
        setMesFiltro( e.target.value )
    }

    const { movs } = useSelector(state => state.movs)
    const { categorias } = useSelector(state => state.cats )

    const tablaGastos = movs.filter( el => meses[el.fecha.getMonth()] === mesFiltro ).filter( el => el.tipo === 'gasto' );

    const categoriasGastos = categorias.filter( el => el.tipo === 'gasto' ).sort( ( a,b ) => a.nombre > b.nombre ? 1 : -1 )

    return (
        <div className='container-view'>
            <Select options={ meses } actualizarState={ handleChangeMes } state={ mesFiltro }/>
            <h1>Gastos</h1>
            <AcordeonTable categorias={ categoriasGastos } tableElements={ tablaGastos }/>
            <Buttons />
        </div>
    )
}
