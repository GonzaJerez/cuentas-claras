import { useDispatch } from "react-redux";
import { openModal } from "../../../actions/modalActions";
import { insertarMovimientoActivo } from "../../../actions/movsActions";

export const TableTranferencias = ({ elementos }) => {

    const dispatch = useDispatch();

    const editarModal = ( e, mov ) =>{
        e.stopPropagation();
        e.preventDefault();
        dispatch( insertarMovimientoActivo( mov ) );
        dispatch( openModal( {
            tipo: mov.tipo,
            modo: 'editar'
        } ) )
    }

    const detalleModal = ( e, mov ) =>{
        e.stopPropagation();
        e.preventDefault();
        dispatch( insertarMovimientoActivo( mov ) );
        dispatch( openModal( {
            tipo: mov.tipo,
            modo: 'solo ver'
        } ) )
    }

    return (
        <div className='list__view'>
            <table className="table table-borderless">
                <thead>
                    <tr>
                        <th scope="col">Cantidad</th>
                        <th scope="col">De</th>
                        <th scope="col"></th>
                        <th scope="col">A</th>
                        <th scope="col">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        elementos.map( mov => 
                            <tr key={ mov.id } className='table__movimiento' onClick={ e => detalleModal( e, mov ) }>
                                <th scope="row">{ new Intl.NumberFormat('en-US', {style: "currency", currency: "USD"/* , maximumFractionDigits: 0 */}).format( parseInt( mov.cantidad ) ) }</th>
                                <td> { mov.from.subcuenta } ({ mov.from.cuenta })</td>
                                <td><i className="bi bi-arrow-right"></i></td>
                                <td> { mov.to.subcuenta } ({ mov.to.cuenta })</td>
                                <td>{ mov.fecha.toLocaleDateString() }</td>
                                <td><button className='table__btn'><i className="bi bi-pencil" onClick={ e =>  editarModal( e, mov ) }></i></button></td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}
