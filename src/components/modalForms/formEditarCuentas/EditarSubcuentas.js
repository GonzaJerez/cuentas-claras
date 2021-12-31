import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { startEditarSubcuenta, startEliminarSubcuenta } from "../../../actions/cuentasActions";
import { startEditarNombreSubcuenta } from "../../../actions/movsActions";
import { isFormValid } from "../../../helpers/isFormValid";

export const EditarSubcuentas = ({ handleClose, nombreSubcuenta, nombreCuenta, cantidad }) => {

    const dispatch = useDispatch();
    const { cuentas } = useSelector(state => state.cuentas)
    const [msgForm, setMsgForm] = useState(false)
    const [ stateSubcuentas, setStateSubcuentas] = useState({
        id: cuentas.find( cta => cta.nombre === nombreCuenta )?.id,
        cuentaActual: nombreCuenta,
        subcuentaActual: nombreSubcuenta,
        nuevaSubcuenta: '',
    })

    const handleChange = e => {
        e.preventDefault()

        setStateSubcuentas({
            ...stateSubcuentas,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmitEditar = e => {
        e.preventDefault()

        // Validacion formulario
        const respForm = isFormValid( {
            nuevaCuenta: stateSubcuentas.nuevaSubcuenta,
        } );

        if ( !respForm.ok ) {
            setMsgForm( respForm.msg )
            return;
        }

        dispatch( startEditarSubcuenta( { 
            ...stateSubcuentas,
            subcuentas: [ ...cuentas.find( cta => cta.nombre === nombreCuenta ).subcuentas.filter( sub => sub !== nombreSubcuenta && sub ), ]
        } ))
        dispatch( startEditarNombreSubcuenta( stateSubcuentas ))
        Swal.fire('Nombre actualizado a '+ stateSubcuentas.nuevaSubcuenta, 'Cuenta actualizada correctamente', 'success')

        handleClose(e)
    }

    const handleDelete = e => {
        e.preventDefault();

        if ( cantidad === 0 ) {
            let confirmacion = window.confirm(`¿Estas seguro que deseas eliminar la subcuenta ${ stateSubcuentas.subcuentaActual } ?`)
            if (confirmacion){
                dispatch( startEliminarSubcuenta( {
                    ...stateSubcuentas,
                    subcuentas: [ ...cuentas.find( cta => cta.nombre === nombreCuenta ).subcuentas.filter( sub => sub !== nombreSubcuenta && sub ), ]
                } ))
                Swal.fire('Cuenta eliminada', `La subcuenta ${ stateSubcuentas.subcuentaActual } ha sido borrada exitosamente`, 'success')
            }
        }

        handleClose(e);
    }



    return (
        <>
            <form className="editar-cuenta" onSubmit={ handleSubmitEditar }>
                <div className='form-container'>
                    <h1>Editar Subcuenta</h1>
                    { msgForm && <div className='msg-error'>{ msgForm }</div> }

                    <section className="modal__section">
                        <label htmlFor="cuentaActual">Nombre actual cuenta: </label>
                        <h4>{ nombreCuenta }</h4>
                    </section>
                    <section className="modal__section">
                        <label htmlFor="subcuentaActual">Nombre actual subcuenta: </label>
                        <h4>{ nombreSubcuenta }</h4>
                    </section>
                    <section className="modal__section">
                        <label htmlFor="nuevaSubcuenta">Nueva nombre: </label>
                        <input value={ stateSubcuentas.nuevaSubcuenta } onChange={ handleChange } type="text" name="nuevaSubcuenta" placeholder="Nuevo nombre" />
                    </section>
                </div>

                <div className='botones'>
                    <button className=' btn boton-submit' type='submit'>Editar</button>
                    <button onClick={ handleClose } className='btn btn-secondary boton-cancel'>Cancelar</button>
                    { cantidad === 0 && <button onClick={ handleDelete } className='btn btn-danger boton-eliminar'>Eliminar</button> }
                </div>

            </form>
        </>
    )
}
