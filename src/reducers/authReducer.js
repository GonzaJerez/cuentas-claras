import { types } from "../types/types";

const initialState = {
    uid: null,
    name: null
}

export const authReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        
        case types.login:
            return{
                ...state,
                uid: action.payload.uid,
                name: action.payload.userName
            }

        case types.logout:
            return{
                ...state,
                uid: null,
                name: null
            }
    
        default:
            return state;
    }
}