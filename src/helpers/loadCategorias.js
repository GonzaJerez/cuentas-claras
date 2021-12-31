import { getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase/firebase-config'

export const loadCategorias = async( uid ) => {
    const catsCollection = await getDocs( collection( db, `${ uid }/app/categorias` ) )
    const cats = []

    catsCollection.forEach( cat => {
        cats.push({
            ...cat.data(),
            id: cat.id
        })
    })

    cats.sort( ( a, b) => a.nombre > b.nombre ? 1 : -1 )
    
    return cats
}