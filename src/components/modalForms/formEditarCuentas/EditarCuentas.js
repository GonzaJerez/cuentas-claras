import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { startEditarCuenta, startEliminarCuenta } from "../../../actions/cuentasActions";
import { startEditarNombreCuenta } from "../../../actions/movsActions";
import { isFormValid } from "../../../helpers/isFormValid";

export const EditarCuentas = ({ handleClose, cantidad }) => {

    const dispatch = useDispatch();
    const [msgForm, setMsgForm] = useState(false)
    const {activeCuenta } = useSelector( state => state.cuentas )
    const [ stateCuentas, setStateCuentas] = useState({
        ...activeCuenta,
        nuevaCuenta: ''
    })

    const handleChange = e => {

        setStateCuentas({
            ...stateCuentas,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmitEditar = e => {
        e.preventDefault();

        // Validacion formulario
        const respForm = isFormValid( {
            nuevaCuenta: stateCuentas.nuevaCuenta,
        } );

        if ( !respForm.ok ) {
            setMsgForm( respForm.msg )
            return;
        }

        dispatch( startEditarCuenta( stateCuentas ))
        dispatch( startEditarNombreCuenta( stateCuentas ))
        Swal.fire('Nombre actualizado a '+ stateCuentas.nuevaCuenta, 'Cuenta actualizada correctamente', 'success')

        handleClose(e)
    }

    const handleDelete = e => {
        e.preventDefault();

        if ( cantidad === 0 ) {
            let confirmacion = window.confirm(`¿Estas seguro que deseas eliminar la cuenta ${ activeCuenta.nombre } ?`)
            confirmacion && dispatch( startEliminarCuenta( activeCuenta.id ))
        }

        handleClose(e);
        Swal.fire('Cuenta eliminada', `La cuenta ${ activeCuenta.nombre } ha sido borrada exitosamente`, 'success')
    }


    return (
        <>
            <form className="editar-cuenta" onSubmit={ handleSubmitEditar }>
                <div className='form-container'>
                    <h1>Editar Cuenta</h1>
                    { msgForm && <div className='msg-error'>{ msgForm }</div> }

                    <section className="modal__section">
                        <label htmlFor="cuentaActual">Nombre actual cuenta: </label>
                        <h4>{ activeCuenta.nombre }</h4>
                    </section>
                    <section className="modal__section">
                        <label htmlFor="nuevaCuenta">Nueva cuenta: </label>
                        <input value={ stateCuentas.nuevaCuenta } onChange={ handleChange } type="text" name="nuevaCuenta" placeholder="Nuevo nombre" />
                    </section>
                </div>

                <div className='botones'>
                    <button className=' btn boton-submit' type='submit'>Editar</button>
                    <button onClick={ handleClose } className='btn btn-secondary boton-cancel'>Cancelar</button>
                    {cantidad === 0 && <button onClick={ handleDelete } className='btn btn-danger boton-eliminar'>Eliminar</button> }
                </div>

            </form>
        </>
    )
}
