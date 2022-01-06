import { addDoc, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase-config';
import { loadCuentas } from '../helpers/loadCuentas';
import { types } from "../types/types";

const cuentas = [
    {
        nombre: 'ARS',
        subcuentas: ['Efectivo', 'Banco HSBC', 'Mercado Pago']
    },{
        nombre: 'USD',
        subcuentas: ['Efectivo','Banco HSBC', 'Plazo Fijo']
    },
    {
        nombre: 'BTC',
        subcuentas: ['Binance', 'Decrypto']
    },
    {
        nombre: 'ETH',
        subcuentas: ['Binance', 'Decrypto']
    },
    {
        nombre: 'Activos',
        subcuentas: ['Auto', 'Moto', 'Casa', 'Terreno', 'Bici', 'NFTs' ]
    },
    {
        nombre: 'Otras criptomonedas',
        subcuentas: ['Ethereum', 'Cardano']
    },
]

export const startAgregarCuentasPorDefecto = () => {
    return async( dispatch, getState ) => {
        try {
            const { uid } = getState().auth;

            cuentas.forEach( async cta => {
                await addDoc( collection( db, `${ uid }/app/cuentas`), cta )

            })
        } catch ( err ) {
            console.log( err );
        }
    }
}

export const startCargarCuentas = () => {
    return async ( dispatch, getState ) => {
        try {
            const { uid } = getState().auth;
            const cuentasFirebase = await loadCuentas( uid )

            if ( cuentasFirebase.length === 0 ) {
                dispatch( startAgregarCuentasPorDefecto() )
                dispatch( cargarCuentas( cuentas ))
            } else {

                dispatch( cargarCuentas( cuentasFirebase ) )
            }


        } catch ( err) {
            console.log( err );
        }
    }
}

const cargarCuentas = cuentas => (
    {
        type: types.cargarCuentas,
        payload: cuentas
    }
)

export const startAgregarCuenta = cta => {
    return async( dispatch, getState ) =>{
        try {
            const { uid } = getState().auth;
            const nuevaCuenta = await addDoc( collection( db, `${ uid }/app/cuentas` ), cta )
            dispatch( agregarCuenta({
                id: nuevaCuenta.id,
                ...cta
            }))
        } catch ( err ) {
            console.log( err );
        }
    }
}

export const agregarCuenta = cuenta => (
    {
        type: types.agregarCuenta,
        payload: cuenta
    }
)

export const startAgregarSubcuenta = cuenta => {
    return async ( dispatch, getState ) => {
        try {
            const { uid } = getState().auth;
            await updateDoc( doc( db, `${ uid }/app/cuentas/${ cuenta.id }`), cuenta )
            dispatch( agregarSubcuenta( cuenta ))

        } catch ( err ) {
            console.log( err );
        }
    }
}

export const agregarSubcuenta = cuenta => (
    {
        type: types.agregarSubcuenta,
        payload: cuenta
    }
)

export const startEditarCuenta = cuenta => {
    return async( dispatch, getState ) => {

        try {
            const { uid } = getState().auth;

            const cuentaToFirestore = { ...cuenta, nombre: cuenta.nuevaCuenta }

            delete cuentaToFirestore.id
            delete cuentaToFirestore.cantidad
            delete cuentaToFirestore.nuevaCuenta
    
            await updateDoc( doc( db, `${ uid }/app/cuentas/${ cuenta.id }` ), cuentaToFirestore )
            
            dispatch( editarCuenta( { ...cuentaToFirestore, id: cuenta.id } ));

        } catch ( err ) {
            console.log( err );
        }

    }
}

export const editarCuenta = cuenta => (
    {
        type: types.editarCuenta,
        payload: cuenta
    }
)

export const startEditarSubcuenta = sub => {
    return async( dispatch, getState ) => {
        try {
            const { uid } = getState().auth;
            sub.subcuentas.push( sub.nuevaSubcuenta )
            await updateDoc( doc( db, `${ uid }/app/cuentas/${ sub.id }` ), {
                nombre: sub.cuentaActual,
                subcuentas: sub.subcuentas
            })
            dispatch( editarSubcuenta( sub ))
        } catch ( err ) {
            console.log( err );
        }
    }
}

export const editarSubcuenta = subcuenta => (
    {
        type: types.editarSubcuenta,
        payload: subcuenta
    }
)

export const abrirModoEdicionCuentas = () => (
    {
        type: types.abrirModoEdicionCuentas
    }
)

export const cerrarModoEdicionCuentas = () => (
    {
        type: types.cerrarModoEdicionCuentas
    }
)

export const startEliminarCuenta = id => {
    return async( dispatch, getState ) => {
        try {
            const { uid } = getState().auth;
            await deleteDoc( doc( db, `${ uid }/app/cuentas/${ id }`))
            dispatch( eliminarCuenta( id ))
            
        } catch ( err ) {
            console.log( err );
        }
    }
}

export const eliminarCuenta = id => (
    {
        type: types.eliminarCuenta,
        payload: id
    }
)

export const startEliminarSubcuenta = sub => {
    return async( dispatch, getState ) => {
        try {
            const { uid } = getState().auth;
            await updateDoc( doc( db, `${ uid }/app/cuentas/${ sub.id }`), {
                nombre: sub.cuentaActual,
                subcuentas: sub.subcuentas
            })
            dispatch( eliminarSubcuenta( sub ))
        } catch ( err ) {
            console.log( err );
        }
    }
}

export const eliminarSubcuenta = subcuenta => (
    {
        type: types.eliminarSubcuenta,
        payload: subcuenta
    }
)

export const insertarCuentaActiva = cta =>(
    {
        type: types.insertarCuentaActiva,
        payload: cta
    }
)

export const eliminarCuentaActiva = () => (
    {
        type: types.eliminarCuentaActiva
    }
)

export const limpiarCuentas = () => (
    {
        type: types.limpiarCuentas
    }
)