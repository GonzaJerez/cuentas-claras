import DateTimePicker from 'react-datetime-picker';
import { UploadFile } from '../../ui/uploadFile/UploadFile';

export const TransferenciaForm = ({ handleClose, handleSubmit, handleDelete, activeMov, nombreCuentas, msgForm, handleChangeCalendar, formValues, handleChangeFrom, handleChangeTo, cuentas, nuevaCuentaTo, setNuevaCuentaTo , nuevaSubcuentaTo, setNuevaSubcuentaTo, handleChange, isLoading, setIsLoading }) => {

    formValues.tipo= 'transferencia'

    let subcuentasTo 
    formValues.to.cuenta === 'nuevaCuenta' ? subcuentasTo = '-' : subcuentasTo = cuentas.find( el => el.nombre === formValues.to.cuenta ).subcuentas
    
    let subcuentasFrom
    formValues.from.cuenta === 'nuevaCuenta' ? subcuentasFrom = '-' :  subcuentasFrom = cuentas.find( el => el.nombre === formValues.from.cuenta ).subcuentas

    return (
        <form onSubmit={ handleSubmit } className='form__transferencia'>
            <div className='form-container'>
                <h1>{ activeMov ? 'Editar movimiento' : `Nueva transferencia` }</h1>
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
                    <label htmlFor="cuenta">Desde cuenta: </label>
                    <select name="cuenta" value={ formValues.from.cuenta } onChange={ handleChangeFrom }>
                        {
                            nombreCuentas.map( el => <option key={ el } value={ el }>{ el }</option>)
                        }
                        {/* <option value="nuevaCuenta">nueva cuenta</option> */}
                    </select>
                </div>
                <div className='modal__section cuenta-secundaria'>
                    <label htmlFor="subcuenta">Subcuenta: </label>
                    <select name="subcuenta" value={ formValues.from.subcuenta } onChange={ handleChangeFrom }>
                        <option value="-">-</option>
                        {
                            formValues.from.cuenta !== 'nuevaCuenta' && subcuentasFrom.map( el => <option key={el } value={ el }>{ el }</option> )
                        }
                        {/* <option value="nuevaSubcuenta">nueva subcuenta</option> */}
                    </select>
                </div>
                <hr />
                <div className='modal__section cuenta-principal'>
                    <label htmlFor="cuenta">A cuenta: </label>
                    <select name="cuenta" value={ formValues.to.cuenta } onChange={ handleChangeTo }>
                        {
                            nombreCuentas.map( el => <option key={ el } value={ el }>{ el }</option>)
                        }
                        <option value="nuevaCuenta">...nueva cuenta</option>
                    </select>
                    {
                        formValues.to.cuenta === 'nuevaCuenta' && <input value={ nuevaCuentaTo } onChange={ (e)=> setNuevaCuentaTo( e.target.value )} autoFocus type="text" placeholder='Nueva cuenta' />
                    }
                </div>
                <div className='modal__section cuenta-secundaria'>
                    <label htmlFor="subcuenta">Subcuenta: </label>
                    <select name="subcuenta" value={ formValues.to.subcuenta } onChange={ handleChangeTo }>
                        <option value="-">-</option>
                        {
                            formValues.to.cuenta !== 'nuevaCuenta' && subcuentasTo.map( el => <option key={el } value={ el }>{ el }</option> )
                        }
                        <option value="nuevaSubcuenta">...nueva subcuenta</option>
                    </select>
                    {
                        formValues.to.subcuenta === 'nuevaSubcuenta' && <input value={ nuevaSubcuentaTo } onChange={ e => setNuevaSubcuentaTo( e.target.value )} autoFocus type="text" placeholder='Nueva subcuenta' />
                    }
                </div>
                <div className='modal__section cantidad'>
                    <label htmlFor="cantidad">Cantidad: </label>
                    <div className='cantidad'>
                        $
                        <input type="number" name="cantidad" value={ formValues.cantidad } onChange={ handleChange } placeholder='1000' min={0}/>
                    </div>
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
