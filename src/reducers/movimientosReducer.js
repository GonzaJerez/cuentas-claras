import { types } from "../types/types";

const initialState = {
    activeMov: null,
    movs: []
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

        /* case types.editarNombreCuenta:
            return{
                ...state,
                movs: state.movs.map( el =>{
                    if (el.cuenta === action.payload.cuentaActual) {
                        return { ...el, cuenta: action.payload.nuevaCuenta };
                    }
                    if ( el.from?.cuenta === action.payload.cuentaActual ) {
                        return { ...el, from: { ...el.from, cuenta: action.payload.nuevaCuenta } } 
                    }
                    if ( el.to?.cuenta === action.payload.cuentaActual ) {
                        return { ...el, to: { ...el.to, cuenta: action.payload.nuevaCuenta} } 
                    }
                    return el;
                })
            } */

        /* case types.editarNombreSubcuenta:
            return{
                ...state,
                movs: state.movs.map( el =>{
                    if (el.categoria === action.payload.subcuentaActual) {
                        return { ...el, categoria: action.payload.nuevaSubcuenta };
                    }
                    if (el.cuenta === action.payload.cuentaActual || el.from?.cuenta === action.payload.cuentaActual || el.to?.cuenta === action.payload.cuentaActual) {
                        
                        if (el.subcuenta === action.payload.subcuentaActual) {
                            return { ...el, subcuenta: action.payload.nuevaSubcuenta };
                        }
                        if ( el.from?.subcuenta === action.payload.subcuentaActual ) {
                            return { ...el, from: { ...el.from, subcuenta: action.payload.nuevaSubcuenta } } 
                        }
                        if ( el.to?.subcuenta === action.payload.subcuentaActual ) {
                            return { ...el, to: { ...el.to, subcuenta: action.payload.nuevaSubcuenta} } 
                        }
                    }
                    return el;
                })
            } */

        /* case types.editarMontosDeuda:
            return{
                ...state,
                movs: state.movs.map( el => el.id !== action.payload.idReferencia
                                            ? el 
                                            : { 
                                                ...el, 
                                                subcuenta: action.payload.subcuenta, 
                                                cantidadPagada: ( el.cantidadPagada - action.payload.cantidadAnterior + action.payload.cantidadNueva),
                                                cuotasPagadas: ( el.cuotasPagadas - action.payload.cuotasAnterior + action.payload.cuotasNuevas ),
                                                estado: ( el.cantidad - (el.cantidadPagada - action.payload.cantidadAnterior) - action.payload.cantidadNueva) > 0 ? 'pendiente' : 'saldado'
                                            } )
            } */

        /* case types.eliminarCuotaDeuda:
            return{
                ...state,
                movs: state.movs.map( el => el.id !== action.payload.idReferencia 
                                            ? el
                                            : {
                                                ...el,
                                                cantidadPagada: ( el.cantidadPagada - action.payload.cantidadAnterior ),
                                                cuotasPagadas: ( el.cuotasPagadas - action.payload.cuotasAnterior ),
                                                estado: ( el.cantidad - ( el.cuotasPagadas - action.payload.cuotasAnterior ) ) > 0 ? 'pendiente' : 'saldado'
                                            })
            } */

        case types.limpiarMovimientos:
            return{
                ...state,
                movs: [],
                activeMov: null
            }


        default:
            return state;
    }
}