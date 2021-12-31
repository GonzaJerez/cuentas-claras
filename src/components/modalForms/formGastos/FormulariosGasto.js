import { DetalleGasto } from "./DetalleGasto"
import { NuevoIngresoGasto } from "../NuevoIngresoGasto"

export const FormulariosGasto = ({ modo, handleClose }) => {
    return (
        <>
            {
                modo === 'solo ver' ? <DetalleGasto />
                                    : <NuevoIngresoGasto handleClose={ handleClose } />
            }
        </>
    )
}
