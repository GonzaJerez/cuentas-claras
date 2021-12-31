import { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2'
import { startAgregarSubcuenta } from '../../../actions/cuentasActions';
import { startActualizarMovimiento, startNuevoMovimiento } from '../../../actions/movsActions';
import { isFormValid } from '../../../helpers/isFormValid';
import { useForm } from '../../../hooks/useForm';
import { useManySelectors } from '../../../hooks/useManySelectors';

export const SaldarPrestamo = ({ handleClose }) => {

    const dispatch = useDispatch();
    const { cuentas } = useSelector(state => state.cuentas)
    const { title } = useSelector(state => state.modals)
    const [nuevaSubcuenta, setNuevaSubuenta] = useState('')
    const [msgForm, setMsgForm] = useState(false)

    const { activeMov, nombreCuentas } = useManySelectors()

    const [ formValues, handleChange, handleChangeCalendar ] = useForm( {
        ...activeMov,
        cantidadAPagar: activeMov.cantidad - activeMov.cantidadPagada,
        cuotasAPagar: 1,
    } )

    const handleSubmit = e =>{
        e.preventDefault();

        // Cuando se quiere abonar el total pero no el total de las cuotas
        if ( parseInt(formValues.cantidad) - parseInt(formValues.cantidadPagada) - parseInt( formValues.cantidadAPagar ) === 0 && parseInt(formValues.cuotas) - parseInt(formValues.cuotasPagadas ) - parseInt( formValues.cuotasAPagar ) > 0 ) {
            
            Swal.fire('Cuidado','Estas tratando de abonar el total sin terminar de abonar todas las cuotas, por favor completa con las cuotas restantes o revisa el monto', 'error');
            return;          
        }
        // Cuando se quiere abonar el total de las cuotas pero no el monto total
        if ( parseInt(formValues.cantidad) - parseInt(formValues.cantidadPagada) - parseInt( formValues.cantidadAPagar ) > 0 && parseInt(formValues.cuotas) - parseInt(formValues.cuotasPagadas ) - parseInt( formValues.cuotasAPagar ) === 0 ) {
            
            Swal.fire('Cuidado','Estas tratando de abonar el total de las cuotas sin terminar de abonar la cantidad total, por favor completa con el monto restante o revisa las cuotas', 'error');
            return;          
        }

        // Validacion formulario
        const respForm = isFormValid( formValues );
        if ( !respForm.ok ) {
            setMsgForm( respForm.msg )
            return;
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

        // Cuando el prestamo es saldado parcial o totalmente
        activeMov.cuotasPagadas = formValues.cuotasPagadas + parseInt(formValues.cuotasAPagar);  
        activeMov.cantidadPagada = formValues.cantidadPagada + parseInt(formValues.cantidadAPagar);
        activeMov.estado = ( formValues.cuotas - formValues.cuotasPagadas - formValues.cuotasAPagar ) > 0 ? 'pendiente' : 'saldado'

        dispatch( startActualizarMovimiento( activeMov ))

        if ( activeMov.tipo === 'prestamo' ) {
                
            dispatch( startNuevoMovimiento( {
                id: Date.now(),
                idReferencia: formValues.id,
                fecha: formValues.fecha,
                cantidad: formValues.cantidadAPagar,
                cuenta: formValues.cuenta,
                subcuenta: formValues.subcuenta,
                categoria: 'pago '+ formValues.tipo,
                aQuien: activeMov.prestador,
                cuotas: formValues.cuotasAPagar,
                tipo: 'gasto'  
            }, 'nuevoGasto' ));
            Swal.fire('Pago realizado', `${ formValues.cuotasAPagar } cuotas abonadas correctamente`, 'success')

        } else if ( activeMov.tipo === 'deudaACobrar' ) {
            
            dispatch( startNuevoMovimiento( {
                id: Date.now(),
                idReferencia: formValues.id,
                fecha: formValues.fecha,
                cantidad: formValues.cantidadAPagar,
                cuenta: formValues.cuenta,
                subcuenta: formValues.subcuenta,
                categoria: 'cobro prestamo',
                deQuien: activeMov.tomador,
                tipo: 'ingreso',
                cuotas: formValues.cuotasAPagar
            }, 'nuevoIngreso' ));

            Swal.fire('Cobro realizado', `${ formValues.cuotasAPagar } cuotas cobradas correctamente`, 'success')
        }

        handleClose(e)
        return;
    }

    let subcuentas
    formValues.cuenta === 'nuevaCuenta' ? subcuentas = '-' : subcuentas = cuentas.find( el => el.nombre === formValues.cuenta ).subcuentas
    

    return (
        <form onSubmit={ handleSubmit } >
            <div className='form-container'>
                <h1>{ title === 'prestamo' ? 'Saldar Prestamo' : 'Saldar deuda a cobrar' }</h1>
                { msgForm && <div className='msg-error'>{ msgForm }</div> }
                <DateTimePicker
                    onChange={ handleChangeCalendar }
                    value={ formValues.fecha }
                    name='fecha'
                    format='dd-MM-y'
                    className='calendar'
                />
                <div className='modal__section cuenta-principal'>
                    <label htmlFor="cuenta">Cuenta: </label>
                    <select disabled name="cuenta" value={ formValues.cuenta } onChange={ handleChange }>
                        {
                            nombreCuentas.map( el => <option key={ el } value={ el }>{ el }</option>)
                        }
                        <option value="nuevaCuenta">nueva cuenta</option>
                    </select>
                </div>
                <div className='modal__section cuenta-secundaria'>
                    <label htmlFor="subcuenta">Subcuenta: </label>
                    <select name="subcuenta" value={ formValues.subcuenta } onChange={ handleChange }>
                        <option value="-">-</option>
                        {
                            formValues.cuenta !== 'nuevaCuenta' && subcuentas.map( el => <option key={el } value={ el }>{ el }</option> )
                        }
                        <option value="nuevaSubcuenta">nueva subcuenta</option>
                    </select>
                    {
                        formValues.subcuenta === 'nuevaSubcuenta' && <input value={ nuevaSubcuenta } onChange={ e => setNuevaSubuenta( e.target.value )} autoFocus type="text" placeholder='Nueva subcuenta' />
                    }
                </div>
                <div className='modal__section'>
                {
                        formValues.prestador 
                        ?   <>
                                <label htmlFor="prestador">Prestador: </label>
                                <div className='prestador'>
                                    <input disabled type="text" name="prestador" value={ formValues.prestador } onChange={ handleChange } placeholder='Nombre'/>
                                </div>
                            </>
                        
                        :   <>
                                <label htmlFor="tomador">Tomador: </label>
                                <div className='tomador'>
                                    <input disabled type="text" name="tomador" value={ formValues.tomador } onChange={ handleChange } placeholder='Nombre'/>
                                </div>
                            </>
                    }
                </div>
                <div className='modal__section '>
                    <label htmlFor="cantidadAPagar">Cantidad: </label>
                    <div className='cantidad'>
                        $
                        <input disabled={ parseInt(formValues.cuotas) - parseInt(formValues.cuotasPagadas) === 1 ? true : false } type="number" name="cantidadAPagar" value={ formValues.cantidadAPagar } max={ parseInt(formValues.cantidad) - parseInt(formValues.cantidadPagada) } min={1} onChange={ handleChange } placeholder={1}/>
                    </div>
                    <p>Quedarian abonar: $ { activeMov.cantidad - activeMov.cantidadPagada }</p>
                </div>
                <div className='modal__section '>
                    <label htmlFor="cuotasaPagar">Cuotas: </label>
                    <input disabled={ parseInt(formValues.cuotas) - parseInt(formValues.cuotasPagadas) === 1 ? true : false } type="number" name="cuotasAPagar" value={ formValues.cuotasAPagar } max={ parseInt(formValues.cuotas) - parseInt(formValues.cuotasPagadas) } min={1} onChange={ handleChange } placeholder='1'/>
                    <p>Quedarian: { activeMov.cuotas - activeMov.cuotasPagadas } cuotas por pagar</p>
                </div>
                <textarea className='textarea' name="descripcion" value={ formValues.descripcion } onChange={ handleChange } placeholder='Descripción(opcional)'></textarea>
            </div>
            <div className='botones'>
                <button className=' btn boton-submit' type='submit'>Saldar cuota</button>
                <button onClick={ handleClose } className='btn btn-secondary boton-cancel'>Cancelar</button>
            </div>   
        </form>
    )
}
