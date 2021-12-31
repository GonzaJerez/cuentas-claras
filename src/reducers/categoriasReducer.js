import { types } from "../types/types";


const initialState = {
    categorias: [],
    isEditing: false,
    activeCat: null
}

export const categoriasReducer = ( state= initialState, action ) => {

    switch ( action.type ) {

        case types.cargarCategorias:
            return{
                ...state,
                categorias: action.payload
            }

        case types.agregarCategoria:
            return{
                ...state,
                categorias: [ ...state.categorias, action.payload ]

            }
        
        case types.editarCategoria:
            return{
                ...state,
                categorias: state.categorias.map( cat => cat.id === action.payload.id ? action.payload : cat )
            }

        case types.abrirModoEdicionCategorias:
            return{
                ...state,
                isEditing: true
            }

        case types.cerrarModoEdicionCategorias:
            return{
                ...state,
                isEditing: false
            }

        case types.eliminarCategoria:
            return{
                ...state,
                categorias: state.categorias.filter( cat => cat.id !== action.payload.id && cat )
            }

        case types.insertarCategoriaActiva:
            return{
                ...state,
                activeCat: action.payload
            }

        case types.eliminarCategoriaActiva:
            return{
                ...state,
                activeCat: null
            }

        case types.limpiarCategorias:
            return{
                ...state,
                categorias: [],
                isEditing: false,
                activeCat: null
            }
        
    
        default:
            return state;
    }
}