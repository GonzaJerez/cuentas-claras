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

export const SaldarDeuda = ({ handleClose }) => {

    const dispatch = useDispatch();
    const { cuentas } = useSelector(state => state.cuentas)
    const [nuevaSubcuenta, setNuevaSubuenta] = useState('')
    const [msgForm, setMsgForm] = useState(false)

    const { activeMov, nombreCuentas, nombreCategorias } = useManySelectors('gasto')

    const [ formValues, handleChange, handleChangeCalendar ] = useForm( { 
        ...activeMov,
        subcuenta: '-',
        cuotasAPagar: 1,
        cantidadAPagar: activeMov.cantidad - activeMov.cantidadPagada,
    })

    const handleSubmit = e =>{
        e.preventDefault();

/*         cuentas.find( cta => cta.nombre === 'Activos' ).subcuentas.forEach( sub => {
            if ( sub === formValues.categoria ) {
                
            }
        })

         */

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

        // Cuando la deuda es saldada parcial o totalmente
        activeMov.cuotasPagadas = formValues.cuotasPagadas + parseInt(formValues.cuotasAPagar);  
        activeMov.cantidadPagada = formValues.cantidadPagada + parseInt(formValues.cantidadAPagar);
        activeMov.estado = ( formValues.cuotas - formValues.cuotasPagadas - formValues.cuotasAPagar ) > 0 ? 'pendiente' : 'saldado'

        dispatch( startActualizarMovimiento( activeMov ))
            
        dispatch( startNuevoMovimiento( {
            id: Date.now(),
            idReferencia: formValues.id,
            fecha: formValues.fecha,
            cantidad: formValues.cantidadAPagar,
            cuenta: formValues.cuenta,
            subcuenta: formValues.subcuenta,
            categoria: formValues.categoria,
            aQuien: activeMov.prestador,
            tipo: 'gasto',
            cuotas: formValues.cuotasAPagar
        }, 'nuevoGasto' ));

        Swal.fire('Pago realizado', `${ formValues.cuotasAPagar } cuotas abonadas correctamente`, 'success')

        handleClose(e)
        return;
    }

    let subcuentas
    formValues.cuenta === 'nuevaCuenta' ? subcuentas = '-' : subcuentas = cuentas.find( el => el.nombre === formValues.cuenta ).subcuentas

    return (
        <form onSubmit={ handleSubmit } >
            <div className='form-container'>
                <h1>Saldar deuda</h1>
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
                            subcuentas.map( el => <option key={el } value={ el }>{ el }</option> )
                        }
                        <option value="nuevaSubcuenta">nueva subcuenta</option>
                    </select>
                    {
                        formValues.subcuenta === 'nuevaSubcuenta' && <input value={ nuevaSubcuenta } onChange={ e => setNuevaSubuenta( e.target.value )} autoFocus type="text" placeholder='Nueva subcuenta' />
                    }
                </div>
                <div className='modal__section'>
                    <label htmlFor="prestador">Prestador: </label>
                    <div className='prestador'>
                        <input disabled type="text" name="prestador" value={ formValues.prestador } onChange={ handleChange } placeholder='Nombre'/>
                    </div>   
                </div>
                <div className='modal__section motivo'>
                    <label htmlFor="motivo">Motivo: </label>
                    <select disabled name="categoria" value={ formValues.categoria } onChange={ handleChange } >
                        <optgroup label='Categorias'>
                            {
                                nombreCategorias.map( el => <option key={ el } value={ el } multiple={ false }>{ el }</option> )
                            }
                            <option value="nuevaCategoria">...nueva categoria</option>
                        </optgroup>
                        <optgroup label='Activos'>
                            {
                                cuentas.find( el => el.nombre === 'Activos').subcuentas.map( el => <option key={ el } value={ el }>{ el }</option>)
                            }
                            <option value="nuevoActivo">...nuevo bien personal</option>
                        </optgroup>
                    </select>
                </div>
                <div className='modal__section '>
                    <label htmlFor="cantidadAPagar">Cantidad: </label>
                    <div className='cantidad'>
                        $
                        <input disabled={ parseInt(formValues.cuotas) - parseInt(formValues.cuotasPagadas) === 1 ? true : false } type="number" name="cantidadAPagar" value={ formValues.cantidadAPagar } max={ parseInt(formValues.cantidad) - parseInt(formValues.cantidadPagada) } min={0} step={0.0000001} onChange={ handleChange } placeholder={1}/>
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
                    <button className=' btn boton-submit' type='submit'>Saldar deuda</button>
                    <button onClick={ handleClose } className='btn btn-secondary boton-cancel'>Cancelar</button>
                </div>
        </form>
    )
}
