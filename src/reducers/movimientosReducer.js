import { types } from "../types/types";

const initialState = {
    activeMov: null,
    movs: [],
    loadingMovs: false
}

export const movimientosReducer = ( state = initialState, action) => {

    switch ( action.type ) {

        case types.cargarMovimientos:
            return{
                ...state,
                movs: action.payload
            }
        
        case types.nuevoIngreso:
            return{
                ...state,
                movs : [ action.payload, ...state.movs ]
            }
        
        case types.nuevoGasto:
            return{
                ...state,
                movs : [ action.payload, ...state.movs ]
            }
        case types.nuevaTransferencia:
            return{
                ...state,
                movs: [ action.payload, ...state.movs ]
            }
        case types.insertarMovActivo:
            return{
                ...state,
                activeMov: {
                    ...action.payload
                }
            }
        case types.eliminarMovActivo:
            return{
                ...state,
                activeMov: null
            }
        case types.actualizarMovimiento:
            return{
                ...state,
                movs: state.movs.map( el => el.id !== action.payload.id ? el : action.payload )
            }
        case types.eliminarMovimiento:
            return{
                ...state,
                movs: state.movs.filter( el => el.id !== action.payload && el )
            }
        case types.nuevaDeuda:
            return{
                ...state,
                movs: [ action.payload, ...state.movs ]
            }
        case types.nuevoPrestamo:
            return{
                ...state,
                movs: [ action.payload, ...state.movs ]
            }
        
        case types.editarNombreCategoria:
            return{
                ...state,
                movs: state.movs.map( el => el.categoria === action.payload.categoriaActual ? { ...el, categoria: action.payload.nuevaCategoria, sector: action.payload.sector } : el )
            }

        case types.limpiarMovimientos:
            return{
                ...state,
                movs: [],
                activeMov: null
            }

        case types.startLoadingMovs:
            return{
                ...state,
                loadingMovs: true,
            }

        case types.finishLoadingMovs:
            return{
                ...state,
                loadingMovs: false,
            }


        default:
            return state;
    }
}