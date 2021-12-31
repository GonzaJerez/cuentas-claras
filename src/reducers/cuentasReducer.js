import { types } from "../types/types";


const initialState = {
    cuentas: [],
    isEditing: false,
    activeCuenta: null
}

export const cuentasReducer = ( state= initialState, action ) => {

    switch ( action.type ) {

        case types.cargarCuentas:
            return{
                ...state,
                cuentas: action.payload
            }

        case types.agregarCuenta:
            return{
                ...state,
                cuentas: [ ...state.cuentas, action.payload ]

            }
        
        case types.agregarSubcuenta:
            return{
                ...state,
                cuentas: state.cuentas.map( el => el.nombre === action.payload.nombre ? action.payload : el )
            }

        case types.editarCuenta:
            console.log( action.payload);
            return{
                ...state,
                cuentas: state.cuentas.map( cta => cta.id === action.payload.id ? action.payload : cta )
            }

        case types.editarSubcuenta:
            return{
                ...state,
                cuentas: state.cuentas.map( cta => cta.nombre !== action.payload.cuentaActual 
                            ? cta 
                            : { ...cta, subcuentas: cta.subcuentas.map( sub => sub === action.payload.subcuentaActual 
                                        ? action.payload.nuevaSubcuenta
                                        : sub ) } )
            }

        case types.abrirModoEdicionCuentas:
            return{
                ...state,
                isEditing: true
            }
        
        case types.cerrarModoEdicionCuentas:
            return{
                ...state,
                isEditing: false
            }

        case types.eliminarCuenta:
            return{
                ...state,
                cuentas: state.cuentas.filter( cta => cta.id !== action.payload && cta )
            }

        case types.eliminarSubcuenta:
            return{
                ...state,
                cuentas: state.cuentas.map( cta => cta.nombre !== action.payload.cuentaActual 
                            ? cta 
                            : { ...cta, subcuentas: action.payload.subcuentas }
                )
            }

        case types.insertarCuentaActiva:
            return{
                ...state,
                activeCuenta: action.payload
            }

        case types.eliminarCuentaActiva:
            return{
                ...state,
                activeCuenta: null
            }

        case types.limpiarCuentas:
            return{
                ...state,
                cuentas: [],
                isEditing: false,
                activeCuenta: null
            }
    
        default:
            return state;
    }
}