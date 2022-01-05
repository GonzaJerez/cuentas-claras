import { convertidor } from "./convertidor";


export const sumarCantidadTotalPorCuenta = ( movs, cuentas, cta ) =>{

    let cantidadTotalPorCuenta = 0

    movs.filter(el => el.cuenta === cta ).filter( el => el.tipo === 'ingreso').map( el => cantidadTotalPorCuenta += parseFloat( el.cantidad ) );
    movs.filter(el => el.cuenta === cta ).filter( el => el.tipo === 'gasto').map( el => cantidadTotalPorCuenta -= parseFloat( el.cantidad ) );
    movs.filter(el => el.cuenta === cta ).filter( el => el.tipo === 'prestamo').map( el => cantidadTotalPorCuenta += parseFloat( el.cantidad ) );
    movs.filter(el => el.cuenta === cta ).filter( el => el.tipo === 'deudaACobrar').map( el => cantidadTotalPorCuenta -= parseFloat( el.cantidad ) );
    movs.filter( el => el.tipo === 'transferencia').filter( el => el.from.cuenta === cta ).map( el => cantidadTotalPorCuenta -= parseFloat( el.cantidad ) );
    movs.filter( el => el.tipo === 'transferencia').filter( el => el.to.cuenta === cta ).map( el => cantidadTotalPorCuenta += parseFloat( el.cantidad ) );
    movs.filter( el => el.tipo === 'compraActivos').filter( el => el.from.cuenta === cta ).map( el => cantidadTotalPorCuenta -= parseFloat( el.cantidad ) );
    movs.filter( el => el.tipo === 'compraActivos').filter( el => el.to.cuenta === cta ).map( el => cantidadTotalPorCuenta += parseFloat( el.cantidad ) );
    movs.filter( el => el.tipo === 'ventaActivos').filter( el => el.from.cuenta === cta ).map( el => cantidadTotalPorCuenta -= parseFloat( el.cantidad ) );
    movs.filter( el => el.tipo === 'ventaActivos').filter( el => el.to.cuenta === cta ).map( el => cantidadTotalPorCuenta += parseFloat( el.cantidad ) );

    
    movs.filter(el => cuentas.find(el => el.nombre === cta ).subcuentas.includes( el.categoria ) ).filter( el => el.tipo === 'gasto').map( el => cantidadTotalPorCuenta += parseInt( el.cantidad ) );

    return {
        nombre: cta,
        valor : cantidadTotalPorCuenta,
    }
}

export const sumarCantidadEnCuentasActivos = ( movs, cta, subcuentaActivo ) => {

    let cantidadTotalPorCuenta = {
        nombre: cta,
        valor: 0
    };

    movs.filter( mov => mov.tipo === 'compraActivos' && mov.from.cuenta === cta && mov.to.subcuenta === subcuentaActivo ).map( el => cantidadTotalPorCuenta.valor += parseInt( el.cantidad ))
    movs.filter( mov => mov.tipo === 'ventaActivos' && mov.to.cuenta === cta && mov.from.subcuenta === subcuentaActivo ).map( el => cantidadTotalPorCuenta.valor -= parseInt( el.cantidad ))
    movs.filter( mov => mov.tipo === 'ingreso' && mov.cuenta === 'Activos' && mov.monedaValuacion === cta && mov.subcuenta === subcuentaActivo ).map( el => cantidadTotalPorCuenta.valor += parseInt( el.cantidad ))
    movs.filter( mov => mov.tipo === 'ingreso' && mov.cuenta === 'Otras criptomonedas' && mov.monedaValuacion === cta && mov.subcuenta === subcuentaActivo ).map( el => cantidadTotalPorCuenta.valor += parseInt( el.cantidad ))

    return cantidadTotalPorCuenta;
    
}

export const sumarCantidadPorSubcuenta = ( movs, cuentas, cta, pares ) => {

    let elementos = [];
    
    const subcuentas = cuentas.find(el => el.nombre === cta ).subcuentas;
    
    subcuentas.forEach( e =>{
        
        let activos= []
        let monedaValuacion='';
        let cantidadTotal = 0;
        
        movs.filter(el => el.cuenta === cta && el.subcuenta === e ).filter( mov => mov.tipo === 'ingreso' ).map( el => cantidadTotal += parseFloat( el.cantidad ) );
        movs.filter(el => el.cuenta === cta && el.subcuenta === e ).filter( mov => mov.tipo === 'gasto' ).map( el => cantidadTotal -= parseFloat( el.cantidad ) );
        movs.filter(el => el.cuenta === cta && el.subcuenta === e ).filter( mov => mov.tipo === 'prestamo' ).map( el => cantidadTotal += parseFloat( el.cantidad ) );
        movs.filter(el => el.cuenta === cta && el.subcuenta === e ).filter( mov => mov.tipo === 'deudaACobrar' ).map( el => cantidadTotal -= parseFloat( el.cantidad ) );
        movs.filter(el => el.categoria === e ).filter( mov => mov.tipo === 'gasto' ).map( el => cantidadTotal += parseFloat( el.cantidad ) );
        movs.filter( el => el.tipo === 'transferencia' ).filter( el => el.from.cuenta === cta && el.from.subcuenta === e ).map( el => cantidadTotal -= parseFloat( el.cantidad ) );
        movs.filter( el => el.tipo === 'transferencia' ).filter( el => el.to.cuenta === cta && el.to.subcuenta === e ).map( el => cantidadTotal += parseFloat( el.cantidad ) );
        movs.filter( el => el.tipo === 'compraActivos' ).filter( el => el.from.cuenta === cta && el.from.subcuenta === e ).map( el => cantidadTotal -= parseFloat( el.cantidad ) );
        movs.filter( el => el.tipo === 'compraActivos' ).filter( el => el.to.cuenta === cta && el.to.subcuenta === e ).map( el => cantidadTotal += parseFloat( el.cantidad ) );
        movs.filter( el => el.tipo === 'ventaActivos' ).filter( el => el.from.cuenta === cta && el.from.subcuenta === e ).map( el => cantidadTotal -= parseFloat( el.cantidad ) );
        movs.filter( el => el.tipo === 'ventaActivos' ).filter( el => el.to.cuenta === cta && el.to.subcuenta === e ).map( el => cantidadTotal += parseFloat( el.cantidad ) );
        
        movs.filter( mov => mov.tipo === 'compraActivos' && mov.to.subcuenta === e ).map( mov => monedaValuacion = mov.monedaValuacion );
        movs.filter( mov => mov.tipo === 'compraActivos' && mov.to.subcuenta === e ).forEach( mov => {
            activos.push({
                nombre: mov.from.cuenta,
                valor: cantidadTotal
            })
            cantidadTotal = convertidor( activos, 'USD', pares)
        })
        movs.filter( mov => mov.tipo === 'ingreso' && mov.cuenta === 'Activos' && mov.subcuenta === e ).map( mov => monedaValuacion = mov.monedaValuacion );

        // monedaValuacion = monedaValuacion !== '' ? monedaValuacion : cta;
        if ( monedaValuacion === '' ) {
            monedaValuacion = cta
        }
        if ( cta === 'Activos' || cta === 'Otras criptomonedas' ) {
            monedaValuacion = 'USD'
        }

        

        elementos.push({
            subcuenta: e,
            cantidad: cantidadTotal,
            monedaValuacion
        })
    })

    return elementos;
}

export const sumarCantidadTotal = ( movs, cuentas, state, pares ) =>{
    let cantidadTotal = []
    let cantidadTotalActivos = { nombre: 'Activos', valor: [] }

    
    cuentas.forEach( cta => {

        if ( cta.nombre !== 'Activos' && cta.nombre !== 'Otras criptomonedas' ) {
            
            cantidadTotal.push( sumarCantidadTotalPorCuenta( movs, cuentas, cta.nombre ) )
            
        } else{

                
                    
                if ( cta.nombre !== 'Activos' && cta.nombre !== 'Otras criptomonedas' ) {
                    // Devuelve objeto q rastrea los movimientos de "Activos" y va sumando en la cuenta q corresponda
                    cantidadTotalActivos.valor.push( sumarCantidadEnCuentasActivos( movs, cta ))
                }
            
        }
  
    })

    // Convierte todos los montos en los 2 arrays a la moneda q tenga en el state
    const totalCuentas = convertidor( cantidadTotal, state, pares )
    const totalActivos = convertidor( cantidadTotalActivos.valor, state, pares )
    
    
    return {totalCuentas, totalActivos}
}

export const sumarCantidadTotalActivos = ( movs, cuentas, state, pares ) =>{

    let cantidadTotalActivos = { nombre: 'Activos', subcuentas: [] }

    cuentas.find( cta => cta.nombre === 'Activos' )?.subcuentas.map( sub => {

        const subcuenta = {
            nombre: sub,
            valor: []
        }

        cuentas.filter( cuenta => cuenta.nombre !== 'Activos' ).forEach( el => {

            subcuenta.valor.push( sumarCantidadEnCuentasActivos( movs, el.nombre, sub ) )
        })

        return cantidadTotalActivos.subcuentas.push(subcuenta)
        
    })


    let cantidadTotalConvertida = 0;

    cantidadTotalActivos.subcuentas.forEach( sub => {
        cantidadTotalConvertida += convertidor( sub.valor, state, pares )
    })

    return { cantidadTotalActivos, cantidadTotalConvertida }
}

export const sumarCantidadTotalOtrasCriptomonedas = ( movs, cuentas, state, pares ) =>{

    let cantidadTotalOtrasCriptomonedas = { nombre: 'Otras criptomonedas', subcuentas: [] }

    cuentas.find( cta => cta.nombre === 'Otras criptomonedas' )?.subcuentas.map( sub => {

        const subcuenta = {
            nombre: sub,
            valor: []
        }

        cuentas.filter( cuenta => cuenta.nombre !== 'Otras criptomonedas' ).forEach( el => {

            subcuenta.valor.push( sumarCantidadEnCuentasActivos( movs, el.nombre, sub ) )
        })

        return cantidadTotalOtrasCriptomonedas.subcuentas.push(subcuenta)
        
    })


    let cantidadTotalConvertida = 0;

    cantidadTotalOtrasCriptomonedas.subcuentas.forEach( sub => {
        cantidadTotalConvertida += convertidor( sub.valor, state, pares )
    })

    return { cantidadTotalOtrasCriptomonedas, cantidadTotalConvertida }
}