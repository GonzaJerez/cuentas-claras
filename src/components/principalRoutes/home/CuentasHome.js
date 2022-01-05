import { useSelector } from "react-redux"
import { sumarCantidadTotalActivos, sumarCantidadTotalOtrasCriptomonedas, sumarCantidadTotalPorCuenta } from "../../../helpers/getCantidades"

export const CuentasHome = ( { cuentas } ) => {

    const { movs } = useSelector(state => state.movs)
    const { pares } = useSelector(state => state.pares)

    return (
        <div>
            {
                cuentas.map( cta =>
                    
                    (sumarCantidadTotalPorCuenta( movs, cuentas, cta.nombre ).valor > 0 )
                        &&  
                        <p className="total-por-cuentas" key={ cta.nombre }>{ cta.nombre } <b>{ new Intl.NumberFormat('en-US', {style: "currency", currency: "USD", minimumFractionDigits: (cta.nombre === 'BTC' || cta.nombre === 'ETH' ) ? 6 : 2 }).format( 
                            (cta.nombre === 'Activos') 
                                ? sumarCantidadTotalActivos( movs, cuentas, 'USD', pares ).cantidadTotalConvertida
                                : (cta.nombre === 'Otras criptomonedas')
                                    ? sumarCantidadTotalOtrasCriptomonedas( movs, cuentas, 'USD', pares ).cantidadTotalConvertida
                                    : sumarCantidadTotalPorCuenta( movs, cuentas, cta.nombre ).valor 
                            ) } 
                            { (cta.nombre === 'Activos' || cta.nombre === 'Otras criptomonedas') && ' usd'}
                        </b></p>
                )
            }
        </div>
    )
}
