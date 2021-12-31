import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { cerrarModoEdicionCuentas } from "../../../actions/cuentasActions";
import { AcordeonList } from "../../ui/acordeon/AcordeonList";
import { Buttons } from "../../ui/buttons/Buttons";

export const CuentasScreen = () => {

    const { movs } = useSelector(state => state.movs );
    const { cuentas } = useSelector(state => state.cuentas );
    const dispatch = useDispatch();

    useEffect(() => { 
        return () => {
            dispatch( cerrarModoEdicionCuentas() ) 
        }
    },[ dispatch ])

    const totalMovimientos = movs.filter( el => el.tipo !== 'deuda' );

    const nombreCuentas = cuentas.map( el => el.nombre )

    return (
        <div className='container-view'>
            <h1>Cuentas</h1>
            <AcordeonList nombreCuentas={ nombreCuentas } tableElements={ totalMovimientos }/>
            <Buttons botonEditarVisible={ true } ruta='cuentas'/>
        </div>
    )
}