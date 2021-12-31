import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { Routes, Route, HashRouter } from "react-router-dom";
import { LoginScreen } from "./components/auth/LoginScreen";
import { Navbar } from "./components/ui/navbar/Navbar";
import { PrivateRoute } from "./routers/PrivateRoute";
import { PublicRoute } from "./routers/PublicRoute";
import { useDispatch } from "react-redux";
import { login } from "./actions/authActions";
import { useState } from "react";
import { LoadingScreen } from "./components/loadings/LoadingScreen";
import { startCargarMovimientos } from "./actions/movsActions";
import { startCargarCategorias } from "./actions/categoriasActions";
import { startCargarCuentas } from "./actions/cuentasActions";

export const AppRouter = () => {

    const dispatch = useDispatch();
    const [checking, setChecking] = useState( true )

    useEffect( ()=> {
        const auth = getAuth();
        onAuthStateChanged( auth, user => {
            if ( user?.uid ) {
                dispatch( login( user.uid, user.displayName ))
                dispatch( startCargarMovimientos() )
                dispatch( startCargarCategorias() )
                dispatch( startCargarCuentas() )
            }
            setChecking( false )
        })
    })

    if ( checking ) {
        return <LoadingScreen />
    }
    

    return (
        <HashRouter>
            <Routes>
                
                <Route  path='/*' 
                        element={ 
                            <PrivateRoute>
                                <Navbar />
                            </PrivateRoute>
                        } />

                <Route  path='/login/*' 
                        element={ 
                            <PublicRoute>
                                <LoginScreen />
                            </PublicRoute> 
                        } />
            </Routes>
        </HashRouter>
    )
}
