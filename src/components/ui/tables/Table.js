import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../actions/modalActions';
import { insertarMovimientoActivo } from '../../../actions/movsActions';


export const Table = ({ movimientos, cantMostrada, cabecera }) => {

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

    let ultimosMovimientos = movimientos;

    if ( cantMostrada !== undefined) {
        ultimosMovimientos = movimientos.slice(0,cantMostrada);
    }

    return (
        <>
            <table className="table table-borderless">
                <thead>
                    <tr>
                        <th scope="col">{ cabecera[0] }</th>
                        <th scope="col">{ cabecera[1] }</th>
                        <th scope="col">{ cabecera[2] }</th>
                        <th scope="col">{ cabecera[3] }</th>
                        {
                            cabecera[4] && <th scope="col">{ cabecera[4] }</th>
                        }
                        {
                            cabecera[5] && <th scope="col">{ cabecera[5] }</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        ultimosMovimientos.map( mov => 
                            <tr key={ mov.id } className={`table__movimiento ${ mov.estado === 'saldado' ? 'saldado' : 'pendiente'}` } onClick={ e => detalleModal( e, mov ) }>
                                {
                                    mov.estado !== 'saldado'
                                    ?   <th scope="row">{ mov.tipo === 'gasto' && '-' }{ new Intl.NumberFormat('en-US', {style: "currency", currency: "USD"}).format( mov.cantidadPagada ? mov.cantidad - mov.cantidadPagada : mov.cantidad ) }</th>
                                    :   <th scope="row">Saldado</th>
                                }
                                
                                <td>{ mov.categoria || (mov.tipo === 'deudaACobrar' ? 'Deuda a cobrar' : mov.tipo)  }</td>
                                {
                                    (mov.prestador) && <td>{ mov.prestador }</td>
                                }
                                {
                                    mov.tomador && <td>{ mov.tomador }</td>
                                }
                                {
                                    mov.subcuenta ? <td>{ mov.subcuenta } ({mov.cuenta})</td>
                                                    : <td>{ mov.cuenta }</td>
                                }
                                <td>{ new Date( mov.fecha ).toLocaleDateString() }</td>
                                {
                                    (mov.prestador || mov.tomador) && 
                                        <td>
                                            <button className='table__btn'>{
                                                mov.estado === 'saldado' ? <i className="bi bi-check2-circle"></i>
                                                                            : <i className="bi bi-clock-history"></i>
                                            } </button>
                                                
                                        </td> 
                                }
                                {
                                    (mov.estado !== 'saldado' && mov.categoria !== 'prestamo saldado') && <td>
                                                                        <button className='table__btn'><i className="bi bi-pencil" onClick={ e =>  editarModal( e, mov ) }></i></button>  
                                                                    </td>
                                }
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </>
    )
}

Table.propTypes = {
    movimientos : PropTypes.array.isRequired
}

Table.defaultProps = {
    cabecera : ['Cantidad', 'Categoria', 'Cuenta', 'Fecha' ]
}