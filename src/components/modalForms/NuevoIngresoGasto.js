import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2'
import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { startActualizarMovimiento, startEditarMontosDeuda, startEliminarCuotaDeuda, startEliminarMovimiento, startNuevoMovimiento } from '../../actions/movsActions';
import { useForm } from '../../hooks/useForm';
import { useManySelectors } from '../../hooks/useManySelectors';
import { startAgregarCuenta, startAgregarSubcuenta } from '../../actions/cuentasActions';
import { startAgregarCategoria } from '../../actions/categoriasActions';
import { isFormValid } from '../../helpers/isFormValid';
import { UploadFile } from '../ui/uploadFile/UploadFile';
import { convertidor } from '../../helpers/convertidor';

export const NuevoIngresoGasto = ({ handleClose }) => {
   
    const dispatch = useDispatch();
    const { cuentas } = useSelector(state => state.cuentas)
    const { pares } = useSelector(state => state.pares)
    
    const [isLoading, setIsLoading] = useState(false)
    const [msgForm, setMsgForm] = useState(false)
    const [nuevaCuenta, setNuevaCuenta] = useState('')
    const [nuevaSubcuenta, setNuevaSubcuenta] = useState('')
    const [nuevaCategoria, setNuevaCategoria] = useState({
        nombre: '',
        sector: ''
    })
    const [monedaValuacion, setmonedaValuacion] = useState('')

    const { typeModal, activeMov, nombreCuentas, nombreCategorias, movs } = useManySelectors()

    const [ formValues, handleChange, handleChangeCalendar ] = useForm( activeMov ? activeMov : {
        fecha: new Date(),
        cuenta: nombreCuentas[0],
        subcuenta: cuentas.find( el => el.nombre === nombreCuentas[0])?.subcuentas[0],
        categoria: nombreCategorias[0],
        cantidad: '',
        descripcion: '',
        url: '',
    })
    formValues.fecha = new Date( formValues.fecha )

    // Referencia tanto a deudas como a prestamos
    const deudaOriginal = activeMov?.idReferencia && movs.find( el => el.id === activeMov.idReferencia );

    const handleSubmit = e => {
        e.preventDefault();

        formValues.fecha = Date.parse(formValues.fecha)

        // DEUDAS Y PRESTAMOS
        // Cuando se quiere abonar el monto total pero no el total de las cuotas
        if ( parseInt(deudaOriginal?.cantidad) - ( parseInt(deudaOriginal?.cantidadPagada) - activeMov?.cantidad ) - parseInt( formValues.cantidad ) === 0 && parseInt(deudaOriginal?.cuotas) - ( parseInt(deudaOriginal?.cuotasPagadas ) - activeMov?.cuotas ) - parseInt( formValues.cuotas ) > 0 ) {
            
            Swal.fire('Cuidado','Estas tratando de abonar el total sin terminar de abonar todas las cuotas, por favor completa con las cuotas restantes o revisa el monto', 'error');
            return;          
        }
        // Cuando se quiere abonar el total de las cuotas pero no el monto total
        if ( parseInt(deudaOriginal?.cantidad) - ( parseInt(deudaOriginal?.cantidadPagada) - activeMov?.cantidad ) - parseInt( formValues.cantidad ) > 0 && parseInt(deudaOriginal?.cuotas) - ( parseInt(deudaOriginal?.cuotasPagadas ) - activeMov?.cuotas ) - parseInt( formValues.cuotas ) === 0 ) {
            
            Swal.fire('Cuidado','Estas tratando de abonar el total de las cuotas sin terminar de abonar la cantidad total, por favor completa con el monto restante o revisa las cuotas', 'error');
            return;          
        }

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
                setMsgForm( 'Nuevos nombres de cuentas no válidos' )
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

        // Agregar nueva categoria
        if (formValues.categoria === 'nuevaCategoria') {

            const respForm = isFormValid( nuevaCategoria );
            if ( !respForm.ok ) {
                setMsgForm( respForm.msg )
                return;
            }

            formValues.categoria = nuevaCategoria.nombre;

            dispatch( startAgregarCategoria({
                nombre: nuevaCategoria.nombre,
                tipo: typeModal,
                sector: nuevaCategoria.sector
            }))
        }

        if ( activeMov ) {
            // Editar pago de deuda
            if ( activeMov.idReferencia) {
                dispatch( startEditarMontosDeuda({
                    idReferencia: activeMov.idReferencia,
                    subcuenta: formValues.subcuenta,
                    cantidadAnterior: parseInt( activeMov.cantidad ),
                    cantidadNueva: parseInt( formValues.cantidad ),
                    cuotasAnterior: activeMov.cuotas,
                    cuotasNuevas: parseInt( formValues.cuotas )
                    })
                )
            }

            dispatch( startActualizarMovimiento( formValues ));
            Swal.fire('Nueva edición', 'Movimiento editado correctamente', 'success')

        } else if ( typeModal === 'ingreso' ) {

            if ( formValues.cuenta === 'Activos' || formValues.cuenta === 'Otras criptomonedas') {
                formValues.cantidad = convertidor([{nombre: monedaValuacion, valor: parseInt(formValues.cantidad) }], 'USD', pares )
                formValues.monedaValuacion = 'USD';
            }
            
            dispatch( startNuevoMovimiento( {
                // id: Date.now(),
                tipo: typeModal,
                ...formValues
            }, 'nuevoIngreso' ))
            Swal.fire('Nuevo movimiento', 'Movimiento creado correctamente', 'success')

        }else if ( typeModal === 'gasto' ) {
            
            dispatch( startNuevoMovimiento( {
                tipo: typeModal,
                ...formValues
            }, 'nuevoGasto' ));
            Swal.fire('Nuevo movimiento', 'Movimiento creado correctamente', 'success')
        } 
        handleClose(e);
    }

    const handleDelete = e => {
        e.preventDefault();


        const confirm = window.confirm('¿Seguro que desea eliminar el evento? No podra recupararlo despues');

        if ( confirm ) {
            dispatch( startEliminarCuotaDeuda({
                idReferencia: activeMov.idReferencia,
                cantidadAnterior: parseInt( activeMov.cantidad ),
                cuotasAnterior: activeMov.cuotas
            }))

            dispatch( startEliminarMovimiento( activeMov.id ) );
            handleClose(e);
            Swal.fire('Eliminado', 'Movimiento eliminado correctamente', 'success')
        }

    }
    let subcuentas
    formValues.cuenta === 'nuevaCuenta' ? subcuentas = '-' : subcuentas = cuentas.find( el => el.nombre === formValues.cuenta )?.subcuentas


    return (
        <>
        <form onSubmit={ handleSubmit }>
            <div className='form-container'>
                <h1>{ activeMov ? 'Editar movimiento' : `Nuevo ${ typeModal }` } </h1>
                { msgForm && <div className='msg-error'>{ msgForm }</div> }
                <DateTimePicker
                    onChange={ handleChangeCalendar }
                    value={ formValues.fecha }
                    name='fecha'
                    format='dd-MM-y'
                    className='calendar'
                    maxDate={ new Date() }
                />
                <div className='modal__section cuenta-principal'>
                    <label htmlFor="cuenta">{ typeModal === 'ingreso' ? 'Cuenta a acreditar:' : 'Cuenta a debitar:' }</label>
                    <select disabled={ activeMov?.idReferencia ? true : false } name="cuenta" value={ formValues.cuenta } onChange={ handleChange }>
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
                        formValues.subcuenta === 'nuevaSubcuenta' && <input value={ nuevaSubcuenta } onChange={ e => setNuevaSubcuenta( e.target.value )} autoFocus type="text" placeholder='Nueva subcuenta' />
                    }
                </div>

                {
                    (formValues.cuenta === 'Activos' || formValues.cuenta === 'Otras criptomonedas') && 
                    <div className='modal__section'>
                        <label htmlFor="monedaValuacion">En que moneda se valua:</label>
                        <select name="monedaValuacion" id="monedaValuacion" value={ monedaValuacion } onChange={ e => setmonedaValuacion( e.target.value ) }>
                            <option value="-">-</option>
                            { nombreCuentas.filter( cta => cta !== 'Activos' ).map( el => <option key={ el } value={ el }>{ el }</option>) }
                        </select>
                    </div>
                }
                
                <div className='modal__section motivo'>
                    <label htmlFor="motivo">Motivo: </label>
                    <select disabled={ activeMov?.idReferencia ? true : false } name="categoria" value={ formValues.categoria } onChange={ handleChange } >{
                        nombreCategorias.map( el => <option key={ el } value={ el }>{ el }</option> )
                    }
                    <option value="nuevaCategoria">...nueva categoria</option>
                    </select>
                    {
                        formValues.categoria === 'nuevaCategoria' && 
                                <>
                                    <label htmlFor="nuevaCategoria">Nombre nueva categoria:</label>
                                    <input id='nuevaCategoria' name='nombre' value={ nuevaCategoria.nombre } onChange={ e => setNuevaCategoria({...nuevaCategoria, [e.target.name]: e.target.value } )} autoFocus type="text" placeholder='Ej. Comida, Boliche, Sueldo' />
                                    <label htmlFor="nuevoSector">Sector:</label>
                                    <input id='nuevoSector' name='sector' value={ nuevaCategoria.sector } onChange={ e => setNuevaCategoria( {...nuevaCategoria, [e.target.name]: e.target.value } )} type="text" placeholder='Ej. Hogar, Higiene, Salud' />

                                </>
                    }
                </div>
                <div className='modal__section '>
                    <label htmlFor="cantidad">Cantidad: </label>
                    <div className='cantidad'>
                        $
                        <input type="number" name="cantidad" value={ formValues.cantidad } onChange={ handleChange } max={ deudaOriginal && deudaOriginal?.cantidad - ( deudaOriginal?.cantidadPagada - activeMov?.cantidad ) }  min={0} step={0.0000001} placeholder='1000'/>
                    </div>
                    { activeMov?.idReferencia && <p>La cantidad restante es: { deudaOriginal?.cantidad - ( deudaOriginal?.cantidadPagada - activeMov?.cantidad ) }</p> }
                </div>
                {
                    activeMov?.idReferencia && 
                    <div className='modal__section '>
                        <label htmlFor="cuotasaPagar">Cuotas: </label>
                        <input type="number" name="cuotas" value={ formValues.cuotas } max={ deudaOriginal?.cuotas -( deudaOriginal?.cuotasPagadas - activeMov?.cuotas ) }  min={1} onChange={ handleChange } placeholder='1'/>
                        <p>Cuotas restantes: { deudaOriginal?.cuotas -( deudaOriginal?.cuotasPagadas - activeMov?.cuotas ) }</p>
                    </div>
                }
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
        </>
    )
}
