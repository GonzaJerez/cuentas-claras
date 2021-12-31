import { DetalleDeuda } from "./DetalleDeuda"
import { Deuda } from "./Deuda"

export const FormulariosDeuda = ({ modo, handleClose }) => {

    return (
        <>
            {
                modo === 'solo ver' ? <DetalleDeuda handleClose={ handleClose } />
                                    : <Deuda handleClose={handleClose} />
            }
        </>
    )
}
