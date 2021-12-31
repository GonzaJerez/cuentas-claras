import { types } from "../types/types";

const initialState = {
    pares:[
        {
            nombre: 'USD/ARS',
            valor: 1
        },
        {
            nombre: 'BTC/ARS',
            valor: 1

        },
        {
            nombre: 'BTC/USD',
            valor: 1

        }
    ]
}

export const valoresReducer = ( state= initialState, action ) =>{

    switch ( action.type ) {
        case types.actualizarValores:
            return{
                ...state,
                // paso array completo con objetos dentro
                pares: action.payload
            }
    
        default:
            return state;
    }
}