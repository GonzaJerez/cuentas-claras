import { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2'
import { startAgregarCuenta, startAgregarSubcuenta } from '../../../actions/cuentasActions';
import { startActualizarMovimiento, startEliminarMovimiento, startNuevoMovimiento } from '../../../actions/movsActions';
import { isFormValid } from '../../../helpers/isFormValid';
import { useForm } from '../../../hooks/useForm';
import { useManySelectors } from '../../../hooks/useManySelectors';
import { UploadFile } from '../../ui/uploadFile/UploadFile';

export const DeudasACobrar = ({ handleClose }) => {

    const dispatch = useDispatch();
    const { cuentas } = useSelector(state => state.cuentas)
    const [nuevaCuenta, setNuevaCuenta] = useState('')
    const [nuevaSubcuenta, setNuevaSubuenta] = useState('')
    const [msgForm, setMsgForm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { activeMov, nombreCuentas } = useManySelectors()

    const [ formValues, handleChange, handleChangeCalendar ] = useForm( activeMov ? activeMov : {
        fecha: new Date(),
        cuenta: nombreCuentas[0],
        subcuenta: cuentas.find( el => el.nombre === nombreCuentas[0]).subcuentas[0],
        cantidad: 0,
        cantidadPagada: 0,
        tipo: 'deudaACobrar',
        tomador: '',
        cuotas: 1,
        cuotasPagadas: 0,
        descripcion: '',
        estado: 'pendiente'
    })

    const handleSubmit = e =>{
        e.preventDefault();

        formValues.fecha = Date.parse(formValues.fecha)

        // Validacion formulario
        const respForm = isFormValid( formValues );
        if ( !respForm.ok ) {
            setMsgForm( respForm.msg )
            return;
        }

        // Agrega nueva Cuenta y Subcuenta
        if (formValues.cuenta === 'nuevaCuenta') {
            const respForm = isFormValid( { nuevaCuenta: nuevaCuenta, nuevaSubcuenta: nuevaSubcuenta } );
            if ( !respForm.ok ) {
                setMsgForm( respForm.msg )
                return;
            }
            formValues.cuenta = nuevaCuenta;
            formValues.subcuenta = nuevaSubcuenta;
            dispatch( startAgregarCuenta( {
                nombre: nuevaCuenta,
                subcuentas: [ nuevaSubcuenta ]
            }))
        }

        // Agrega nueva Subcuenta a Cuenta ya existente
        if (formValues.cuenta !== 'nuevaCuenta' && formValues.subcuenta === 'nuevaSubcuenta' ) {
            const respForm = isFormValid( nuevaSubcuenta );
            if ( !respForm.ok ) {
                setMsgForm( respForm.msg )
                return;
            }
            formValues.subcuenta = nuevaSubcuenta;

            dispatch( startAgregarSubcuenta( {
                id: cuentas.find( cta => cta.nombre === formValues.cuenta ).id,
                nombre: formValues.cuenta,
                subcuentas: [ ...cuentas.find( el => el.nombre === formValues.cuenta ).subcuentas, nuevaSubcuenta ]
            }))
        }

        if ( activeMov ) {
            dispatch( startActualizarMovimiento( formValues ));
            Swal.fire('Nueva edición', 'Movimiento editado correctamente', 'success')
        } else {
            dispatch( startNuevoMovimiento( {
                ...formValues,
            }, 'nuevoPrestamo' ));
            Swal.fire('Nueva deuda a cobrar', 'Movimiento creado correctamente', 'success')
        }
        handleClose(e);
    }

    const handleDelete = e => {
        e.preventDefault();
        const confirm = window.confirm('¿Seguro que desea eliminar el evento? No podra recupararlo despues');

        if ( confirm ) {
            dispatch( startEliminarMovimiento( activeMov.id ) );
            handleClose(e);
            Swal.fire('Eliminado', 'Movimiento eliminado correctamente', 'success')
        }  
    }

    let subcuentas
    formValues.cuenta === 'nuevaCuenta' ? subcuentas = '-' : subcuentas = cuentas.find( el => el.nombre === formValues.cuenta ).subcuentas
    

    return (
        <form onSubmit={ handleSubmit } >
            <div className='form-container'>
                <h1>{ activeMov ? 'Editar movimiento' : 'Nueva deuda a cobrar' }</h1>
                { msgForm && <div className='msg-error'>{ msgForm }</div> }
                <DateTimePicker
                    onChange={ handleChangeCalendar }
                    value={ formValues.fecha }
                    name='fecha'
                    format='dd-MM-y'
                    className='calendar'
                />
                <div className='modal__section'>
                    <label htmlFor="tomador">Tomador: </label>
                    <div className='tomador'>
                        <input type="text" name="tomador" value={ formValues.tomador } onChange={ handleChange } placeholder='Nombre del tomador'/>
                    </div>
                </div>
                <div className='modal__section cuenta-principal'>
                    <label htmlFor="cuenta">Cuenta: </label>
                    <select name="cuenta" value={ formValues.cuenta } onChange={ handleChange }>
                        {
                            nombreCuentas.map( el => <option key={ el } value={ el }>{ el }</option>)
                        }
                        <option value="nuevaCuenta">...nueva cuenta</option>
                    </select>
                    {
                        formValues.cuenta === 'nuevaCuenta' && <input value={ nuevaCuenta } onChange={ (e)=> setNuevaCuenta( e.target.value )} autoFocus type="text" placeholder='Nueva cuenta' />
                    }
                </div>
                <div className='modal__section cuenta-secundaria'>
                    <label htmlFor="subcuenta">Subcuenta: </label>
                    <select name="subcuenta" value={ formValues.subcuenta } onChange={ handleChange }>
                        <option value="-">-</option>
                        {
                            formValues.cuenta !== 'nuevaCuenta' && subcuentas.map( el => <option key={el } value={ el }>{ el }</option> )
                        }
                        <option value="nuevaSubcuenta">...nueva subcuenta</option>
                    </select>
                    {
                        formValues.subcuenta === 'nuevaSubcuenta' && <input value={ nuevaSubcuenta } onChange={ e => setNuevaSubuenta( e.target.value )} autoFocus type="text" placeholder='Nueva subcuenta' />
                    }
                </div>
                
                <div className='modal__section '>
                    <label htmlFor="cantidad">Cantidad: </label>
                    <div className='cantidad'>
                        $
                        <input type="number" name="cantidad" value={ formValues.cantidad } onChange={ handleChange } placeholder='5000' min={0} step={0.0000001} />
                    </div>
                </div>
                <div className='modal__section '>
                    <label htmlFor="cuotas">Cuotas: </label>
                    <input type="number" name="cuotas" value={ formValues.cuotas } onChange={ handleChange } placeholder='1' min={1}/>
                </div>
                <UploadFile formValues={ formValues } isLoading={ isLoading } setIsLoading={ setIsLoading }/>
                <textarea className='textarea' name="descripcion" value={ formValues.descripcion } onChange={ handleChange } placeholder='Descripción(opcional)'></textarea>
            </div>
            <div className='botones'>
                <button className=' btn boton-submit' disabled={ isLoading ? true : false } type='submit'>Guardar</button>
                <button onClick={ handleClose } className='btn btn-secondary boton-cancel'>Cancelar</button>
                {
                    activeMov && <button onClick={ handleDelete } className=' btn btn-danger boton-eliminar'>Eliminar</button>
                }
            </div>
 
        </form>
    )
}
