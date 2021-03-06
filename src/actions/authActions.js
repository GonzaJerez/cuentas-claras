import { getAuth, signInWithPopup, signOut, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth'
import Swal from 'sweetalert2'
import { googleAuthProvider } from '../firebase/firebase-config'
import { types } from '../types/types'
import { limpiarCategorias } from './categoriasActions'
import { limpiarCuentas } from './cuentasActions'
import { limpiarMovimientos } from './movsActions'

export const startingLoginWithGoogle = () => {
    return async( dispatch, getState ) =>{
        const auth = getAuth()
        const { user } = await signInWithPopup( auth, googleAuthProvider )
        dispatch( login( user.uid, user.displayName ))
    }
}

export const login = ( uid, userName ) =>(
    {
        type: types.login,
        payload:{
            uid, userName
        }
    }
)

export const startingLogout = () => {
    return( async dispatch => {
        const auth = getAuth();
        await signOut( auth )
        dispatch( logout() )
        dispatch( limpiarMovimientos() )
        dispatch( limpiarCuentas() )
        dispatch( limpiarCategorias() )
    })
}

const logout = () => (
    {
        type: types.logout
    }
)

export const startingRegisterWithEmail = ( nombre, email, password ) => {
    return async( dispatch ) =>{
        try {
            const auth = getAuth();
            const { user } = await createUserWithEmailAndPassword( auth, email, password )
            await updateProfile( user, { displayName: nombre })
            dispatch( login( user.uid, nombre ))

        } catch (err) {
            if ( err.code === 'auth/email-already-in-use' ) {
                
                Swal.fire('Ups', 'Ya existe una cuenta con ese mail', 'error')
            }
        }
        
    }
}

export const startingLoginWithEmail = ( email, password ) => {
    return async dispatch => {
        try {
            const auth = getAuth();
            const { user } = await signInWithEmailAndPassword( auth, email, password )
            dispatch( login( user.uid, user.displayName ))
        } catch (err) {
            if ( err.code === 'auth/wrong-password') {
                Swal.fire('Contrase??a incorrecta', 'Usuario y contrase??a no coinciden', 'error')
            }
            if ( err.code === 'auth/user-not-found') {
                Swal.fire( 'Email incorrecto', 'Usuario no encontrado', 'error')
            }
        }
        
    }
}