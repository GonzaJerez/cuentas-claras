import { DeudasACobrar } from "../formDeudasACobrar/DeudasACobrar"
import { DetallePrestamo } from "./DetallePrestamo"
import { Prestamo } from "./Prestamo"


export const FormulariosPrestamo = ({ modo, handleClose, typeModal }) => {

    return (
        <>
            {
                typeModal === 'prestamo' && 
                        (modo === 'solo ver' ? <DetallePrestamo />
                                             : <Prestamo handleClose={handleClose} typeModal={ typeModal } />)
            }
            {
                typeModal === 'deudaACobrar' && 
                        (modo === 'solo ver' ? <DetallePrestamo />
                                             : <DeudasACobrar handleClose={ handleClose } />)
            }
        </>
    )
}
