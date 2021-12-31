import { useSelector } from "react-redux"
import { sumarCantidadTotalActivos, sumarCantidadTotalPorCuenta } from "../../../helpers/getCantidades"

export const CuentasHome = ( { cuentas } ) => {

    const { movs } = useSelector(state => state.movs)
    const { pares } = useSelector(state => state.pares)

    return (
        <div>
            {
                cuentas.map( cta =>
                    
                    (sumarCantidadTotalPorCuenta( movs, cuentas, cta.nombre ).valor > 0 )
                        &&  
                        <p className="total-por-cuentas" key={ cta.nombre }>{ cta.nombre } <b>{ new Intl.NumberFormat('en-US', {style: "currency", currency: "USD"/* , maximumFractionDigits: 0 */}).format( cta.nombre === 'Activos' ? sumarCantidadTotalActivos( movs, cuentas, 'USD', pares ).cantidadTotalConvertida : sumarCantidadTotalPorCuenta( movs, cuentas, cta.nombre ).valor ) } { cta.nombre === 'Activos' && 'usd'}</b></p>
                )
            }
        </div>
    )
}
