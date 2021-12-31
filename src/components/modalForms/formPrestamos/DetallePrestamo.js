import { useDispatch, useSelector } from "react-redux"
import { openModal } from "../../../actions/modalActions";

export const DetallePrestamo = () => {

    const dispatch = useDispatch();

    const { activeMov } = useSelector(state => state.movs)

    const { cantidad, cuenta, subcuenta, prestador, tomador, fecha, descripcion, estado, cantidadPagada, cuotas, cuotasPagadas, tipo, url } = activeMov;


    const handleSaldarPrestamo = e => {
        e.preventDefault();
        dispatch( openModal( {
            tipo: 'saldar prestamo',
            title: tipo
         } ) )
    }

    return (
        <div className='detalle__form'>
            { tipo === 'prestamo' ?  <h1>Detalle prestamo</h1> : <h1>Detalle deuda a cobrar</h1> }
            

            <section className='detalle__section'>
                <h4>Tipo: <span>{tipo === 'prestamo' ?  'Prestamo' : 'Deuda a cobrar' }</span></h4>

                <h4>Fecha: <span>{ fecha.toLocaleDateString() }</span></h4>

                <h4>Cantidad total: <span>$ { Math.abs( cantidad ) }</span></h4>

                <h4>Cantidad abonada: <span>$ { cantidadPagada }</span></h4>

                <h4>Cantidad restante: <span>$ { Math.abs( cantidad ) - cantidadPagada }</span></h4>
      
                {
                    prestador ? <h4>Prestador: <span>{ prestador }</span></h4>
                              : <h4>Tomador: <span>{ tomador }</span></h4>
                }
 
                <h4>Cuenta: <span>{ cuenta }</span></h4>

                <h4>Subcuenta: <span>{ subcuenta }</span></h4>

                <h4>Cuotas abonadas: <span>{ cuotasPagadas }/{ cuotas }</span></h4>

                { url && <h4>Comprobante: <a href={ url } target='_blank' rel="noreferrer">Ver comprobante</a></h4> }

                <h4>Descripcion: <span>{ descripcion }</span></h4>

                <h4>Estado: <span>{ estado }</span></h4>

            </section>
                {
                    estado === 'pendiente' && <button onClick={ handleSaldarPrestamo } className="btn boton-saldar">Saldar cuota</button>
                }
        </div>
    )
}
