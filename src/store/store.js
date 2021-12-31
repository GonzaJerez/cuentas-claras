import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';
import { categoriasReducer } from "../reducers/categoriasReducer";
import { cuentasReducer } from "../reducers/cuentasReducer";
import { modalsReducer } from "../reducers/modalsReducer";
import { movimientosReducer } from "../reducers/movimientosReducer";
import { authReducer } from "../reducers/authReducer";
import { valoresReducer } from "../reducers/valoresReducer";

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;


const reducers = combineReducers({
    movs: movimientosReducer,
    modals: modalsReducer,
    cats: categoriasReducer,
    cuentas: cuentasReducer,
    pares: valoresReducer,
    auth: authReducer
})

export const store = createStore( 
    reducers,
    composeEnhancers(
        applyMiddleware( thunk )
    ) );