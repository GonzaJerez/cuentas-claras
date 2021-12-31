import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../../actions/modalActions';
import { eliminarMovimientoActivo } from '../../../actions/movsActions';
import { FormulariosDeuda } from '../../modalForms/formDeudas/FormulariosDeuda';
import { SaldarDeuda } from '../../modalForms/formDeudas/SaldarDeuda';
import { SaldarPrestamo } from '../../modalForms/formPrestamos/SaldarPrestamo';
import { FormulariosGasto } from '../../modalForms/formGastos/FormulariosGasto';
import { FormulariosIngreso } from '../../modalForms/formIngresos/FormulariosIngreso';
import { FormulariosPrestamo } from '../../modalForms/formPrestamos/FormulariosPrestamo';
import { FormulariosTransferencia } from '../../modalForms/formTransferencias/FormulariosTransferencia';
import { EditarCategorias } from '../../modalForms/formEditarCategorias/EditarCategorias';
import { EditarCuentas } from '../../modalForms/formEditarCuentas/EditarCuentas';
import { EditarSubcuentas } from '../../modalForms/formEditarCuentas/EditarSubcuentas';
import { eliminarCategoriaActiva } from '../../../actions/categoriasActions';
import { eliminarCuentaActiva } from '../../../actions/cuentasActions';

export const Modal = () => {

    const dispatch = useDispatch();
    const { isOpen, typeModal, modo } = useSelector(state => state.modals)
    const { activeCat } = useSelector(state => state.cats)
    const { activeCuenta } = useSelector(state => state.cuentas)
    

    const handleClose = e => {
        e.preventDefault();
        dispatch( closeModal() )
        dispatch( eliminarMovimientoActivo() )
        dispatch( eliminarCategoriaActiva() )
        dispatch( eliminarCuentaActiva() )
    }

    return (
        <>
            <div className='modal__background animate__animated animate__fadeIn animate__faster' onClick={ handleClose }>
            </div>
            <div className='modal__modal'>
                <i onClick={ handleClose } className="bi bi-x-lg"></i>
                {
                    ( isOpen && typeModal === 'gasto' ) && <FormulariosGasto handleClose={ handleClose } modo={ modo } />
                }
                {
                    ( isOpen && typeModal === 'ingreso' ) && <FormulariosIngreso handleClose={ handleClose } modo={ modo }  />
                }
                {
                    ( isOpen && typeModal === 'transferencia' ) && <FormulariosTransferencia handleClose={ handleClose } modo={ modo } typeModal={ typeModal } />
                }
                {
                    ( isOpen && typeModal === 'deuda' ) && <FormulariosDeuda handleClose={ handleClose } modo={ modo } />
                }
                {
                    ( ( isOpen && typeModal === 'prestamo' ) || ( isOpen && typeModal === 'deudaACobrar' ) ) && <FormulariosPrestamo handleClose={ handleClose } modo={ modo } typeModal={ typeModal } />
                }
                {
                    ( isOpen && typeModal === 'saldar deuda' ) && <SaldarDeuda handleClose={ handleClose } />
                }
                {
                    ( isOpen && typeModal === 'saldar prestamo' ) && <SaldarPrestamo handleClose={ handleClose } />
                }
                {
                    ( isOpen && typeModal === 'editar categorias' ) && <EditarCategorias handleClose={ handleClose } activeCat={ activeCat }/>
                }
                {
                    ( isOpen && typeModal === 'editar cuentas' ) && <EditarCuentas handleClose={ handleClose } nombreCuenta={ activeCuenta.nomCuenta } cantidad={ activeCuenta.cantidad } />
                }
                {
                    ( isOpen && typeModal === 'editar subcuentas' ) && <EditarSubcuentas handleClose={ handleClose } nombreSubcuenta={ activeCuenta.nomSubcuenta } nombreCuenta={ activeCuenta.nomCuenta } cantidad={ activeCuenta.cantidad } />
                }
                {
                    ( isOpen && typeModal === 'compraActivos' ) && <FormulariosTransferencia handleClose={ handleClose } modo={ modo } typeModal={ typeModal }  />
                }
                {
                    ( isOpen && typeModal === 'ventaActivos' ) && <FormulariosTransferencia handleClose={ handleClose } modo={ modo } typeModal={ typeModal }  />
                }

            </div>
        </>
    )
}
