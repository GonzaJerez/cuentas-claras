import { getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase/firebase-config'

export const loadMovs = async( uid ) => {
    const movsCollection = await getDocs( collection( db, `${ uid }/app/movimientos` ) )
    const movs = []

    movsCollection.forEach( mov => {
        movs.push({
            ...mov.data(),
            id: mov.id,
            fecha: new Date( mov.data().fecha ),
        })
    })

    movs.sort( ( a, b) => a.fecha > b.fecha ? -1 : 1 )
    
    return movs
}