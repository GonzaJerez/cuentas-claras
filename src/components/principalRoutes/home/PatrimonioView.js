import { useState } from "react"
import { useSelector } from "react-redux"
import { sumarCantidadTotal, sumarCantidadTotalActivos } from "../../../helpers/getCantidades"
import { Select } from "../../ui/selects/Select"
import { CuentasHome } from "./CuentasHome"


export const PatrimonioView = () => {

    const [state, setState] = useState('ARS')
    const { pares } = useSelector(state => state.pares)
    
    

    const handleChange = ( e )=>{
        setState( e.target.value )
    }

    const { movs } = useSelector(state => state.movs);
    const { cuentas } = useSelector(state => state.cuentas )

   
    return (
        <div className='patrimonio__view'>
            <Select options={ ['ARS', 'USD', 'BTC', 'ETH'] } clase='upperCase' actualizarState={ handleChange} />
            <div className='patrimonio__cantidad'>
                <div className='patrimonio__principal'>
                    <small>{ state } </small>
                    <h1> { new Intl.NumberFormat('en-US', {style: "currency", currency: "USD", /* maximumFractionDigits: 0 */}).format( sumarCantidadTotal( movs, cuentas, state, pares ).totalCuentas + sumarCantidadTotalActivos( movs, cuentas, state, pares ).cantidadTotalConvertida ) }</h1>
                </div>
                <CuentasHome cuentas={ cuentas } />
            </div>
        </div>
    )
}
