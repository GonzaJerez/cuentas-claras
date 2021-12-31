import { getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase/firebase-config'

export const loadCuentas = async( uid ) => {
    const cuentasCollection = await getDocs( collection( db, `${ uid }/app/cuentas` ) )
    const cuentas = []

    cuentasCollection.forEach( cta => {
        cuentas.push({
            ...cta.data(),
            id: cta.id
        })
    })

    cuentas.sort( ( a, b) => a.nombre > b.nombre ? 1 : -1 )
    
    return cuentas
}