import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { insertarCuentaActiva } from "../../../actions/cuentasActions";
import { openModal } from "../../../actions/modalActions";
import { convertidor } from "../../../helpers/convertidor";
import { sumarCantidadTotalActivos } from "../../../helpers/getCantidades";
import { Select } from "../selects/Select";

export const List = ({ elementos, isEditing, nomCuenta }) => {

    const dispatch = useDispatch();
    const [moneda, setMoneda] = useState('ARS')
    const { pares } = useSelector(state => state.pares )
    const { movs } = useSelector(state => state.movs )
    const { cuentas } = useSelector(state => state.cuentas )

    const openingModal = ( e, nomSubcuenta, cantidad ) =>{
        e.preventDefault();
        dispatch( openModal({
            tipo: 'editar subcuentas',
        }))
        dispatch( insertarCuentaActiva( { nomCuenta, nomSubcuenta, cantidad } ))

    }

    const handleChange = e => {
        e.preventDefault();
        setMoneda( e.target.value )
    }

    const sumarMontosEnDistintasMonedas = (sub) =>{

        let total = 0;

        if ( sub.monedaValuacion === 'Activos') {
            sumarCantidadTotalActivos( movs, cuentas, moneda, pares).cantidadTotalActivos.subcuentas.forEach( el => {
                if ( el.nombre === sub.subcuenta ) {
                    total = convertidor( el.valor, moneda, pares )
                }
            })
        }

        if ( sub.cantidad !== 0 ) {
            total = convertidor([{ nombre: sub.monedaValuacion, valor:  sub.cantidad }], moneda, pares );
        }

        return total;
    }


    return (
        <div className='list__view'>
            <Select options={['ARS', 'USD', 'BTC', 'ETH']} state={ moneda } actualizarState={ handleChange }/>
            <ul className="list-group">
                {
                    elementos.map( el =>
                        <li key={ el.subcuenta } className="list-group-item d-flex justify-content-between align-items-center">
                            { el.subcuenta }
                            <span className={`badge bg-secondary bg-${ el.cantidad < 0 ? 'danger': ''}${ el.cantidad > 0 ? 'success': ''}`}>{ new Intl.NumberFormat('en-US', {style: "currency", currency: "USD", minimumFractionDigits: 2 }).format( sumarMontosEnDistintasMonedas( el ) ) }</span>
                            { isEditing && <i className="bi bi-pencil" onClick={ e => openingModal( e, el.subcuenta, el.cantidad )}></i> }
                        </li>
                    )
                }
            </ul>
        </div>
    )
}
