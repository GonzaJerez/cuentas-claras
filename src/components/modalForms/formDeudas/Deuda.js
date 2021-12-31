import { useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2'
import { startAgregarCategoria } from '../../../actions/categoriasActions';
import { startAgregarCuenta, startAgregarSubcuenta } from '../../../actions/cuentasActions';
import { startActualizarMovimiento, startEliminarMovimiento, startNuevoMovimiento } from '../../../actions/movsActions';
import { isFormValid } from '../../../helpers/isFormValid';
import { useForm } from '../../../hooks/useForm';
import { useManySelectors } from '../../../hooks/useManySelectors';
import { UploadFile } from '../../ui/uploadFile/UploadFile';

export const Deuda = ({ handleClose }) => {

    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const [msgForm, setMsgForm] = useState(false)
    const [nuevaCuenta, setNuevaCuenta] = useState('')
    const [nuevaCategoria, setNuevaCategoria] = useState({
        nombre: '',
        sector: ''
    })
    const [nuevoActivo, setNuevoActivo] = useState('')

    const { activeMov, nombreCuentas, nombreCategorias, cuentas } = useManySelectors( 'gasto' )

    const [ formValues, handleChange, handleChangeCalendar ] = useForm( activeMov ? activeMov : {
        fecha: Date.now(),
        cuenta: nombreCuentas[0],
        prestador: '',
        tipo: 'deuda',
        categoria: nombreCategorias[0],
        cantidad: 0,
        cantidadPagada: 0,
        cuotas: 1,
        cuotasPagadas: 0,
        descripcion: '',
        estado: 'pendiente'
    })

    const handleSubmit = e =>{
        e.preventDefault();

        // Validacion formulario
        const respForm = isFormValid( formValues );
        if ( !respForm.ok ) {
            setMsgForm( respForm.msg )
            return;
        }

        // Agrega nueva Cuenta
        if (formValues.cuenta === 'nuevaCuenta') {
            const respForm = isFormValid( nuevaCuenta );
            if ( !respForm.ok ) {
                setMsgForm( respForm.msg )
                return;
            }
            formValues.cuenta = nuevaCuenta;
            dispatch( startAgregarCuenta( {
                nombre: nuevaCuenta,
                subcuentas: []
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
                tipo: 'gasto',
                sector: nuevaCategoria.sector
            }))
        }

        // Agregar nueva cuenta ( Bien personal )
        if ( formValues.categoria === 'nuevoActivo' ) {
            const respForm = isFormValid( nuevoActivo );
            if ( !respForm.ok ) {
                setMsgForm( respForm.msg )
                return;
            }
            formValues.categoria = nuevoActivo;

            dispatch( startAgregarSubcuenta ({
                id: cuentas.find( cta => cta.nombre === 'Activos' ).id,
                nombre: 'Activos',
                subcuentas: [ ...cuentas.find( el => el.nombre === 'Activos' ).subcuentas, nuevoActivo ]
            }))
        }

        if ( activeMov ) {
            dispatch( startActualizarMovimiento( formValues ));
            Swal.fire('Nueva edición', 'Movimiento editado correctamente', 'success')
        } else {
            dispatch( startNuevoMovimiento( {
                ...formValues,
                id: Date.now()
             }, 'nuevaDeuda' ));
            Swal.fire('Nueva deuda', 'Movimiento creado correctamente', 'success')
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
    

    return (
        <form onSubmit={ handleSubmit } >
            <div className='form-container'>
                <h1>{ activeMov ? 'Editar movimiento' : `Nueva deuda` }</h1>
                {
                    msgForm && <div className='msg-error'>{ msgForm }</div>
                }
                <DateTimePicker
                    onChange={ handleChangeCalendar }
                    value={ formValues.fecha }
                    name='fecha'
                    format='dd-MM-y'
                    className='calendar'
                />
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
                <div className='modal__section'>
                    <label htmlFor="prestador">Prestador: </label>
                    <div className='prestador'>
                        <input type="text" name="prestador" value={ formValues.prestador } onChange={ handleChange } placeholder='Nombre del prestador'/>
                    </div>
                </div>
                <div className='modal__section motivo'>
                    <label htmlFor="motivo">Motivo: </label>
                    <select name="categoria" value={ formValues.categoria } onChange={ handleChange } className={ formValues.categoria === 'nuevaCategoria' ? 'un-focus' : '' } >
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
                    {
                        formValues.categoria === 'nuevaCategoria' && 
                                    <>
                                        <label htmlFor="nuevaCategoria">Nombre nueva categoria:</label>
                                        <input id='nuevaCategoria' name='nombre' value={ nuevaCategoria.nombre } onChange={ e => setNuevaCategoria({...nuevaCategoria, [e.target.name]: e.target.value } )} autoFocus type="text" placeholder='Ej. Comida, Boliche, Sueldo' />
                                        <label htmlFor="nuevoSector">Sector:</label>
                                        <input id='nuevoSector' name='sector' value={ nuevaCategoria.sector } onChange={ e => setNuevaCategoria( {...nuevaCategoria, [e.target.name]: e.target.value } )} type="text" placeholder='Ej. Hogar, Higiene, Salud' />

                                    </>
                    }
                    {
                        formValues.categoria === 'nuevoActivo' && 
                                    <>
                                        <label htmlFor="nuevoActivo">Nombre nuevo bien personal:</label>
                                        <input id='nuevoActivo' name='nombre' value={ nuevoActivo } onChange={ e => setNuevoActivo( e.target.value ) } autoFocus type="text" placeholder='Ej. Auto, moto, depto' />

                                    </>
                    }
                </div>
                <div className='modal__section '>
                    <label htmlFor="cantidad">Cantidad: </label>
                    <div className='cantidad'>
                        $
                        <input type="number" name="cantidad" value={ formValues.cantidad } onChange={ handleChange } placeholder='1000' min={1}/>
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
