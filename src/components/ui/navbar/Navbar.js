import { useRef } from "react"
import { NavLink, Routes, Route, Navigate } from 'react-router-dom'
import { MovimientosScreen } from "../../principalRoutes/movimientos/MovimientosScreen";
import { CategoriesScreen } from "../../principalRoutes/categories/CategoriesScreen";
import { CuentasScreen } from "../../principalRoutes/cuentas/CuentasScreen";
import { EstadisticasScreen } from "../../EstadisticasScreen";
import { GastosScreen } from "../../principalRoutes/gastos/GastosScreen";
import { HomeScreen } from "../../principalRoutes/home/HomeScreen";
import { IngresosScreen } from "../../principalRoutes/ingresos/IngresosScreen";
import { TransferenciasScreen } from "../../principalRoutes/transferencias/TransferenciasScreen";
import { DeudasScreen } from "../../principalRoutes/deudas/DeudasScreen";
import { DeudasACobrarScreen } from "../../principalRoutes/deudasACobrar/DeudasACobrarScreen";
import { useDispatch } from "react-redux";
import { actualizarValores } from "../../../actions/paresActions";
import { useEffect } from "react";
import { fetchPares } from "../../../helpers/fetchPares";
import { startingLogout } from "../../../actions/authActions";
import { useSelector } from "react-redux";


export const Navbar = () => {

    const dispatch = useDispatch();
    const { name } = useSelector(state => state.auth )

    useEffect(() => {
        
        const actualizarValoresMonedas = async() =>{

            const usd_ars = await fetchPares( 'dai/ars' )
            const btc_usd = await fetchPares( 'btc/usd' )
            const btc_ars = await fetchPares( 'btc/ars' )
            const eth_ars = await fetchPares( 'eth/ars' )
            const eth_usd = await fetchPares( 'eth/usd' )

            return [
                {
                    nombre: 'USD/ARS',
                    valor: usd_ars
                },{
                    nombre: 'BTC/USD',
                    valor: btc_usd
                },{
                    nombre: 'BTC/ARS',
                    valor: btc_ars
                },{
                    nombre: 'ETH/ARS',
                    valor: eth_ars
                },{
                    nombre: 'ETH/USD',
                    valor: eth_usd
                },
            ]
        }

        actualizarValoresMonedas().then( e => dispatch( actualizarValores( e )))
       
    }, [ dispatch ])


    const menu = useRef();
    const modal = useRef();

    const handleOpen = () => {
        menu.current.style.transform= 'translateX(0px)';
        modal.current.style.zIndex = '2';
        modal.current.style.opacity = '1';
    }

    const handleClose = () =>{
        menu.current.style.transform= 'translateX(-250px)';
        modal.current.style.zIndex = '-1';
        modal.current.style.opacity = '0';
    }

    const handleLogout = e => {
        e.preventDefault();
        dispatch( startingLogout() )
    }

    return (
        <div className='navbar__view'>

            <header className='navbar__header'>
                <button onClick={ handleOpen }><i className="bi bi-list"></i></button>
                <h3>Cuentas claras</h3>
            </header>

            <nav ref={ menu } className={`navbar__menu`}>
                <ul>
                    <li className="displayName">
                        <h5 className="displayName">{ name }</h5>
                    </li>
                    <li>
                        <NavLink to='/' onClick={ handleClose } className={ ({ isActive }) => isActive ? 'active' : '' }>
                            <i className="bi bi-house"></i>Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/categories' onClick={ handleClose } className={ ({ isActive }) => isActive ? 'active' : '' }>
                            <i className="bi bi-list-task"></i>Categorias
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/ingresos' onClick={ handleClose } className={ ({ isActive }) => isActive ? 'active' : '' }>
                            <i className="bi bi-graph-up-arrow"></i>Ingresos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/gastos' onClick={ handleClose } className={ ({ isActive }) => isActive ? 'active' : '' }>
                            <i className="bi bi-graph-down-arrow"></i>Gastos
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/deudas' onClick={ handleClose } className={ ({ isActive }) => isActive ? 'active' : '' }>
                        <i className="bi bi-bank"></i>Deudas
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/deudas-a-cobrar' onClick={ handleClose } className={ ({ isActive }) => isActive ? 'active' : '' }>
                        <i className="bi bi-percent"></i>Deudas a cobrar
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/transferencias' onClick={ handleClose } className={ ({ isActive }) => isActive ? 'active' : '' }>
                            <i className="bi bi-arrow-left-right"></i>Transferencias
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/cuentas' onClick={ handleClose } className={ ({ isActive }) => isActive ? 'active' : '' }>
                            <i className="bi bi-wallet"></i>Cuentas
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/estadisticas' onClick={ handleClose } className={ ({ isActive }) => isActive ? 'active' : '' }>
                            <i className="bi bi-bar-chart"></i>Estadisticas
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/compras' onClick={ handleClose } className={ ({ isActive }) => isActive ? 'active' : '' }>
                        <i className="bi bi-cart"></i>Compras
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/ventas' onClick={ handleClose } className={ ({ isActive }) => isActive ? 'active' : '' }>
                        <i className="bi bi-piggy-bank"></i>Ventas
                        </NavLink>
                    </li>
                </ul>
                <ul>
                    <li>
                        <NavLink to='/login' onClick={ handleLogout } className="logout">
                            <i className="bi bi-box-arrow-in-left"></i>Logout
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <section onClick={ handleClose } className='navbar__principal'>
                <div className="navbar__modal" ref={ modal }>
                </div>
                <div className='navbar__vista'>
                    <Routes>
                        <Route path='/' element={ <HomeScreen />} />
                        <Route path='/categories' element={ <CategoriesScreen />} />
                        <Route path='/ingresos' element={ <IngresosScreen />} />
                        <Route path='/gastos' element={ <GastosScreen />} />
                        <Route path='/transferencias' element={ <TransferenciasScreen tipo={ 'transferencia'} />} />
                        <Route path='/estadisticas' element={ <EstadisticasScreen />} />
                        <Route path='/cuentas' element={ <CuentasScreen />} />
                        <Route path='/movimientos' element={ <MovimientosScreen />} />
                        <Route path='/deudas' element={ <DeudasScreen />} />
                        <Route path='/deudas-a-cobrar' element={ <DeudasACobrarScreen />} />
                        <Route path='/compras' element={ <TransferenciasScreen tipo={'compraActivos'} />} />
                        <Route path='/ventas' element={ <TransferenciasScreen tipo={'ventaActivos'} />} />
                        <Route path='*' element={ <Navigate to='/' /> } />
                    </Routes>
                </div>
            </section>
            
            
        </div>
    )
}
