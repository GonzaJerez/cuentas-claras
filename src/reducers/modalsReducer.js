import { types } from "../types/types";

const initialState = {
    isOpen: false,
    typeModal: null,
    modo: '',
}

export const modalsReducer = ( state=initialState, action ) => {
    switch ( action.type ) {

        case types.openModal:
            return {
                ...state,
                isOpen: true,
                typeModal: action.payload.tipo,
                modo: action.payload.modo,
                title: action.payload.title
            };

        case types.closeModal:
            return {
                ...state,
                isOpen: false,
                typeModal: null,
                modo: '',
                title: null
            }
    
        default:
            return state;
    }
}