import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"
import { abrirModoEdicionCategorias, cerrarModoEdicionCategorias } from "../../../actions/categoriasActions";
import { abrirModoEdicionCuentas, cerrarModoEdicionCuentas } from "../../../actions/cuentasActions";
import { openModal } from "../../../actions/modalActions";

export const Buttons = ({ botonEditarVisible= false, ruta }) => {

    const dispatch = useDispatch();
    const [isButtonsOpen, setIsButtonsOpen] = useState(false)
    const { isEditing:isEditingCuentas } = useSelector(state => state.cuentas)
    const { isEditing:isEditingCategorias } = useSelector(state => state.cats)

    const openVistaButtons = e => {
        e.preventDefault();
        setIsButtonsOpen( !isButtonsOpen )
    }

    const openingModal = ( e, tipo ) =>{
        e.preventDefault();
        e.stopPropagation();
        dispatch( openModal( {
            tipo: tipo || e.target.value,
            modo: 'crear'
         } ) )
         setIsButtonsOpen( false )
    }

    const openVistaEditar = e => {
        e.preventDefault();
        ruta === 'cuentas' && dispatch( abrirModoEdicionCuentas() )
        ruta === 'categorias' && dispatch( abrirModoEdicionCategorias() )
        
    }

    const closeVistaEditar = e => {
        e.preventDefault();
        ruta === 'cuentas' && dispatch( cerrarModoEdicionCuentas() )
        ruta === 'categorias' && dispatch( cerrarModoEdicionCategorias() )
    }

    return (

        <>
        <div className='boton-editar'>
            { (botonEditarVisible && !isEditingCuentas) &&   <button className="btn btn-warning btn-editar">
                                                                    <i onClick={ openVistaEditar } className="bi bi-pencil"></i>
                                                                </button>
            }
            { (botonEditarVisible && isEditingCuentas) && <button className="btn btn-editar buttons__close">
                                                                <i onClick={ closeVistaEditar } className="bi bi-x"></i>
                                                            </button>
            }
            { (botonEditarVisible && isEditingCategorias) && <button className="btn btn-editar buttons__close">
                                                                <i onClick={ closeVistaEditar } className="bi bi-x"></i>
                                                            </button>
            }
        </div>
        <div className="boton-plus">
            {
                !isButtonsOpen ? <button className='buttons__plus' onClick={ openVistaButtons }>+</button>
                              : <button className='buttons__close' onClick={ openVistaButtons }><i className="bi bi-x"></i></button>
            }
            <div className={`vista-buttons ${ isButtonsOpen ? 'visible' : '' }`}>
                
                    <button onClick={ openingModal } value='ingreso' className='btn btn-menu'>Nuevo ingreso<i onClick={ e => {e.stopPropagation(); e.target.parentElement.click()} } className="bi bi-graph-up-arrow"></i></button>
                
                    <button onClick={ openingModal } value='transferencia' className='btn btn-menu'>Transferir entre cuentas<i onClick={ e => {e.stopPropagation(); e.target.parentElement.click()} } className="bi bi-arrow-left-right"></i></button>
                
                    <button onClick={ openingModal } value='gasto' className='btn btn-menu'>Nuevo gasto<i onClick={ e => {e.stopPropagation(); e.target.parentElement.click()} } className="bi bi-graph-down-arrow"></i></button>
                
                    <button onClick={ openingModal } value='deuda' className='btn btn-menu'>Nueva deuda<i onClick={ e => {e.stopPropagation(); e.target.parentElement.click()} } className="bi bi-bank"></i></button>
                
                    <button onClick={ openingModal } value='prestamo' className='btn btn-menu'>Nuevo prestamo<i onClick={ e => {e.stopPropagation(); e.target.parentElement.click()} } className="bi bi-bank"></i></button>
                
                    <button onClick={ openingModal } value='deudaACobrar' className='btn btn-menu'>Nueva deuda a cobrar<i onClick={ e => {e.stopPropagation(); e.target.parentElement.click()} } className="bi bi-percent"></i></button>
                
                    <button onClick={ openingModal } value='compraActivos' className='btn btn-menu'>Compra de activos<i onClick={ e => {e.stopPropagation(); e.target.parentElement.click()} } className="bi bi-cart"></i></button>
                
                    <button onClick={ openingModal } value='ventaActivos' className='btn btn-menu'>Venta de activos<i onClick={ e => {e.stopPropagation(); e.target.parentElement.click()} } className="bi bi-piggy-bank"></i></button>
            </div>
        </div>
    </>

    )
}
