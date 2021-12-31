import { DetalleIngreso } from "./DetalleIngreso"
import { NuevoIngresoGasto } from "../NuevoIngresoGasto"


export const FormulariosIngreso = ({ modo, handleClose }) => {
    return (
        <>
            {
                modo === 'solo ver' ? <DetalleIngreso />
                                    : <NuevoIngresoGasto handleClose={ handleClose }/>
            }
        </>
    )
}
