import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Buttons } from "../../ui/buttons/Buttons"
import { LastMovs } from "./LastMovs"
import { PatrimonioView } from "./PatrimonioView"

export const HomeScreen = () => {

    const { movs } = useSelector(state => state.movs )
    const movimientos = movs.filter( el => el.tipo !== 'deuda' && el.tipo !== 'prestamo' && el.tipo !== 'transferencia' && el.tipo !== 'deudaACobrar' && el.tipo !== 'compraActivos' && el.tipo !== 'ventaActivos')

    return (
        <div className='container-view'>
            <PatrimonioView />
            <LastMovs movimientos={ movimientos } />
            {
                movimientos.length > 5
                    &&
                    <Link to='/movimientos' element='' className='ver-mas'>
                        Ver mas movimientos
                    </Link>
            }
            
            <Buttons />
        </div>
    )
}
