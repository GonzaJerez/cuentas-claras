import { addDoc, collection, updateDoc, doc, deleteDoc, getDocs } from 'firebase/firestore'
import { db } from '../firebase/firebase-config';
import { loadMovs } from '../helpers/loadMovs';
import { types } from "../types/types";

export const startNuevoMovimiento = ( mov, tipo ) => {
    return async( dispatch, getState ) => {
        const { uid } = getState().auth
        try {
            const doc = await addDoc( collection( db, `${ uid }/app/movimientos`), mov )

            tipo === 'nuevoIngreso' && dispatch( nuevoIngreso({ id: doc.id, ...mov, fecha: new Date( mov.fecha ) }))
            tipo === 'nuevoGasto' && dispatch( nuevoGasto({ id: doc.id, ...mov, fecha: new Date( mov.fecha ) }))
            tipo === 'nuevaTransferencia' && dispatch( nuevaTransferencia({ id: doc.id, ...mov, fecha: new Date( mov.fecha ) }))
            tipo === 'nuevoPrestamo' && dispatch( nuevoPrestamo({ id: doc.id, ...mov, fecha: new Date( mov.fecha ) }))
            tipo === 'nuevaDeuda' && dispatch( nuevaDeuda({ id: doc.id, ...mov, fecha: new Date( mov.fecha ) }))
            
        } catch (err) {
            console.log( err);
        }
    }
}

export const nuevoIngreso = (mov) => (
    {
        type: types.nuevoIngreso,
        payload: mov
    }
)

export const nuevoGasto = (mov) => (
    {
        type: types.nuevoGasto,
        payload: mov
    }
)

export const nuevaTransferencia = (mov) => (
    {
        type: types.nuevaTransferencia,
        payload: mov
    }
)

export const nuevaDeuda = mov => (
    {
        type: types.nuevaDeuda,
        payload: mov
    }
)

export const nuevoPrestamo = mov => (
    {
        type: types.nuevoPrestamo,
        payload: mov
    }
)

export const insertarMovimientoActivo = mov => (
    {
        type: types.insertarMovActivo,
        payload: mov
    }
)

export const eliminarMovimientoActivo = () => (
    {
        type: types.eliminarMovActivo,
    }
)

export const startCargarMovimientos = () => {
    return async( dispatch, getState ) => {
        const { uid } = getState().auth;
        dispatch( startLoadingMovs() )
        const movs = await loadMovs( uid );
        dispatch( finishLoadingMovs() )
        dispatch( cargarMovimientos( movs ))
    }
}

const cargarMovimientos = movs => (
    {
        type: types.cargarMovimientos,
        payload: movs
    }
)

export const startActualizarMovimiento = ( mov ) => {
    return async( dispatch, getState ) => {
        const { uid } = getState().auth

        const movToFirestore = { ...mov };
        delete movToFirestore.id;

        await updateDoc( doc( db, `${ uid }/app/movimientos/${ mov.id }` ), movToFirestore )

        dispatch( actualizarMovimiento( { ...mov, fecha: new Date( mov.fecha ) } ));
    }
}

export const actualizarMovimiento = mov => (
    {
        type: types.actualizarMovimiento,
        payload: mov
    }
)

export const startEliminarMovimiento = id => {
    return async( dispatch, getState ) => {
        const { uid } = getState().auth;

        await deleteDoc( doc( db, `${ uid }/app/movimientos/${ id }`))
        dispatch( eliminarMovimiento( id ))
    }
}

export const eliminarMovimiento = id => (
    {
        type: types.eliminarMovimiento,
        payload: id
    }
)

export const startEditarNombreCategoria = cat => {
    return async( dispatch, getState ) =>{
        const { uid } = getState().auth;

        const movs = await getDocs( collection( db, `${ uid }/app/movimientos` ) )

        movs.forEach( mov => {
            if ( mov.data().categoria === cat.categoriaActual ) {

                dispatch( startActualizarMovimiento( {...mov.data(), id: mov.id, categoria: cat.nuevaCategoria } ) )
            }
        })
    }
}

export const editarNombreCategoria = cat =>(
    {
        type: types.editarNombreCategoria,
        payload: cat
    }
)

export const startEditarNombreCuenta = cta => {
    return async( dispatch, getState ) => {
        const { uid } = getState().auth;

        const movs = await getDocs( collection( db, `${ uid }/app/movimientos` ) );

        movs.forEach( mov => {
            if ( mov.data().cuenta === cta.nombre ) {
                dispatch( startActualizarMovimiento( { ...mov.data(), id: mov.id, cuenta : cta.nuevaCuenta }))
            }
            if ( mov.data().from?.cuenta === cta.nombre ) {
                dispatch( startActualizarMovimiento( { ...mov.data(), id: mov.id, from: { ...mov.from, cuenta: cta.nuevaCuenta } }))
            }
            if ( mov.data().to?.cuenta === cta.nombre ) {
                dispatch( startActualizarMovimiento( { ...mov.data(), id: mov.id, to: { ...mov.to, cuenta: cta.nuevaCuenta } }))
            }
        })
    }
}

export const startEditarNombreSubcuenta = sub => {
    return async( dispatch, getState ) => {
        const { uid } = getState().auth;

        const movs = await getDocs( collection( db, `${ uid }/app/movimientos` ) );

        movs.forEach( mov => {
            if ( mov.data().categoria === sub.subcuentaActual ) {
                dispatch( startActualizarMovimiento( { ...mov.data(), id: mov.id, categoria: sub.nuevaSubcuenta }))
            }
            if ( mov.data().cuenta === sub.cuentaActual || mov.data().from?.cuenta === sub.cuentaActual || mov.data().to?.cuenta === sub.cuentaActual ) {
                
                if ( mov.data().subcuenta === sub.subcuentaActual ) {
                    dispatch( startActualizarMovimiento( { ...mov.data(), id: mov.id, subcuenta: sub.nuevaSubcuenta }))
                }
                if ( mov.data().from?.subcuenta === sub.subcuentaActual ) {
                    dispatch( startActualizarMovimiento( { ...mov.data(), id: mov.id, from: { ...mov.data().from, subcuenta: sub.nuevaSubcuenta } }))
                }
                if ( mov.data().to?.subcuenta === sub.subcuentaActual ) {
                    dispatch( startActualizarMovimiento( { ...mov.data(), id: mov.id, to: { ...mov.data().to, subcuenta: sub.nuevaSubcuenta } }))
                }
            }
        })


    }
}

export const startEditarMontosDeuda = deuda => {
    return async( dispatch, getState ) => {
        const { uid } = getState().auth;

        const movs = await getDocs( collection( db, `${ uid }/app/movimientos` ) );

        movs.forEach( mov => {
            if ( mov.id === deuda.idReferencia ) {
                dispatch( startActualizarMovimiento( {
                    ...mov.data(),
                    id: mov.id,
                    cantidadPagada: ( mov.data().cantidadPagada - deuda.cantidadAnterior + deuda.cantidadNueva ),
                    cuotasPagadas: ( mov.data().cuotasPagadas - deuda.cuotasAnterior + deuda.cuotasNuevas ),
                    estado: ( mov.data().cantidad - (mov.data().cantidadPagada - deuda.cantidadAnterior) - deuda.cantidadNueva) > 0 ? 'pendiente' : 'saldado'
                }))
            }
        })
    }
}

export const startEliminarCuotaDeuda = deuda => {
    return async( dispatch, getState ) => {
        const { uid } = getState().auth;

        const movs = await getDocs( collection( db, `${ uid }/app/movimientos` ) );

        movs.forEach( mov => {
            if ( mov.id === deuda.idReferencia ) {
                dispatch( startActualizarMovimiento( {
                    ...mov.data(),
                    id: mov.id,
                    cantidadPagada: ( mov.data().cantidadPagada - deuda.cantidadAnterior ),
                    cuotasPagadas: ( mov.data().cuotasPagadas - deuda.cuotasAnterior ),
                    estado: ( mov.data().cantidad - ( mov.data().cuotasPagadas - deuda.cuotasAnterior ) ) > 0 ? 'pendiente' : 'saldado'
                }))
            }
        })
    }
}
    
export const limpiarMovimientos = () => (
    {
        type: types.limpiarMovimientos
    }
)

const startLoadingMovs = () => (
    {
        type: types.startLoadingMovs
    }
) 

const finishLoadingMovs = () => (
    {
        type: types.finishLoadingMovs
    }
) 