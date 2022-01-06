

export const convertidor = ( array, state, pares ) =>{

    const coin = [ 'BTC', 'ETH', 'USD', 'XRP', 'ADA']
    const fiat = ['ARS', 'USD', 'MXN']
        
    return array.reduce( (acumulador, actual ) => {

        if ( actual.valor !== 0) {
            
            if ( actual.nombre === state ) {
                
                actual = actual.valor
                return acumulador + actual;
            }
    
            if ( coin.includes( state ) && fiat.includes( actual.nombre ) ) {
                
                actual = actual.valor / pares.find( par => par.nombre === `${ state }/${ actual.nombre }`).valor;
                return acumulador + actual;
            }
    
            if ( coin.includes( actual.nombre ) && fiat.includes( state ) ) {

                actual = actual.valor * pares.find( par => par.nombre === actual.nombre + '/' + state )?.valor;        
                return acumulador + actual;
            }
        }

        return acumulador + actual.valor

    }, 0 )

}
