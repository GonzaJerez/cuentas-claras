import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { openModal } from "../../../actions/modalActions";

export const DetalleDeuda = () => {

    const dispatch = useDispatch();

    const { activeMov} = useSelector(state => state.movs)

    const { cantidad, cantidadPagada, categoria, prestador, cuenta, fecha, descripcion, estado, cuotas, cuotasPagadas, url } = activeMov;

    const handleSaldarDeuda = e => {
        e.preventDefault();
        dispatch( openModal( {
            tipo: 'saldar deuda',
         } ) )
    }

    return (
        <div className='detalle__form'>
            <h1>Detalle deuda</h1>

            <section className='detalle__section'>
                <h4>Tipo: <span>Deuda</span></h4>

                <h4>Fecha: <span>{ fecha.toLocaleDateString() }</span></h4>

                <h4>Cantidad total: <span>$ { cantidad }</span></h4>

                <h4>Cantidad abonada: <span>$ { cantidadPagada }</span></h4>

                <h4>Cantidad restante: <span>$ { cantidad - cantidadPagada }</span></h4>

                <h4>Prestador: <span>{ prestador }</span></h4>

                <h4>Cuenta: <span>{ cuenta }</span></h4>

                <h4>Motivo: <span>{ categoria }</span></h4>

                <h4>Cuotas abonadas: <span> { cuotasPagadas }/{ cuotas }</span></h4>

                { url && <h4>Comprobante: <a href={ url } target='_blank' rel="noreferrer">Ver comprobante</a></h4> }

                <h4>Descripcion: <span>{ descripcion }</span></h4>

                <h4>Estado: <span>{ estado }</span></h4>

                
            </section>
                {
                    estado === 'pendiente' && <button onClick={ handleSaldarDeuda } className="btn boton-saldar">Saldar cuota</button>
                }
        </div>
    )
}
