import { addDoc, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase-config';
import { loadCategorias } from '../helpers/loadCategorias';
import { types } from "../types/types";

const categorias = [
        {
            nombre: 'Materiales de cocina',
            tipo: 'gasto',
            sector: 'hogar'
        },
        {
            nombre: 'Comida',
            tipo: 'gasto',
            sector: 'gastos varios'
        },
        {
            nombre: 'Sueldo',
            tipo: 'ingreso',
            sector: 'ingresos varios'
        },
        {
            nombre: 'Ventas',
            tipo: 'ingreso',
            sector: 'ingresos varios'
        },
        {
            nombre: 'Luz',
            tipo: 'gasto',
            sector: 'servicios'
        },
        {
            nombre: 'Gas',
            tipo: 'gasto',
            sector: 'servicios'
        },
        {
            nombre: 'Netflix',
            tipo: 'gasto',
            sector: 'streaming'
        },
        {
            nombre: 'Aporte inicial',
            tipo: 'ingreso',
            sector: 'Aporte inicial'
        },
        {
            nombre: 'Intereses',
            tipo: 'ingreso',
            sector: 'Intereses'
        },
        {
            nombre: 'Perdida',
            tipo: 'gasto',
            sector: 'Perdida'
        },
        
    ]

export const startAgregarCategoriasPorDefecto = () => {
    return async( dispatch, getState ) => {

        try {
            const { uid } = getState().auth;

            categorias.forEach( async cat => {

                await addDoc( collection( db, `${ uid }/app/categorias` ), cat )
            })

        } catch (err) {
            console.log( err );
        }
    }
}

export const startCargarCategorias = () => {
    return async( dispatch, getState ) => {
        try {
            const { uid } = getState().auth;
            const cats = await loadCategorias( uid );

            if ( cats.length === 0) {
                dispatch( startAgregarCategoriasPorDefecto() )
                dispatch( cargarCategorias( categorias ))
            }else{

                dispatch( cargarCategorias( cats ))
            }


        } catch (err) {
            console.log( err );
        }

    }
}

export const cargarCategorias = cats => (
    {
        type: types.cargarCategorias,
        payload: cats
    }
)

export const startAgregarCategoria = cat => {
    return async( dispatch, getState ) => {
        try {
            const { uid } = getState().auth;

            const nuevaCat = await addDoc( collection( db, `${ uid }/app/categorias`), cat );
            dispatch( agregarCategoria( { id: nuevaCat.id, ...cat }))

        } catch (err) {
            console.log( err );
        }   

    }
}

export const agregarCategoria = cat => (
    {
        type: types.agregarCategoria,
        payload: cat
    }
)

export const startEditarCategoria = cat => {
    return async( dispatch, getState ) => {
        try {
            const { uid } = getState().auth;

            const catToFirestore = { ...cat };
            delete catToFirestore.id;

            await updateDoc( doc( db, `${ uid }/app/categorias/${ cat.id }` ), catToFirestore );

            dispatch( editarCategoria( cat ))

        } catch ( err ) {
            console.log( err );
        }
    }
}

export const editarCategoria = cat => (
    {
        type: types.editarCategoria,
        payload: cat
    }
)

export const abrirModoEdicionCategorias = () => (
    {
        type: types.abrirModoEdicionCategorias
    }
)

export const cerrarModoEdicionCategorias = () => (
    {
        type: types.cerrarModoEdicionCategorias
    }
)

export const startEliminarCategoria = cat => {
    console.log( cat );
    return async( dispatch, getState ) => {
        try {
            const { uid } = getState().auth;
            await deleteDoc( doc( db, `${ uid }/app/categorias/${ cat.id }` ));
            dispatch( eliminarCategoria( cat ) )
        } catch ( err ) {
            console.log( err );
        }
    }
}

export const eliminarCategoria = cat => (
    {
        type: types.eliminarCategoria,
        payload: cat
    }
)

export const insertarCategoriaActiva = cat =>(
    {
        type: types.insertarCategoriaActiva,
        payload: cat
    }
)

export const eliminarCategoriaActiva = () => (
    {
        type: types.eliminarCategoriaActiva
    }
)

export const limpiarCategorias = () => (
    {
        type: types.limpiarCategorias
    }
)