const verificarCaracteres = input =>{

    if ( input ) {
        const caracteresNoValidos= ['<', '>', '"', "'", 'script']
        input = input.toString()

        if ( input.includes('script') ) {
            return true;
        }

        for( let caracter of caracteresNoValidos ){
            if ( input.includes( caracter ) ) {
                return true;
                // break;
            }
        }
        return false;
    }
}


export const isFormValid = form =>{

    if ( typeof form === 'string') {
        if ( form.length < 1 || form === '' || form === '-' || verificarCaracteres( form )) {
            return{
                ok: false,
                msg: 'input no valido'
            }
        }
    }

    if ( form.fecha > Date.now() ) {
        return {
            ok: false,
            msg: 'La fecha debe ser igual o menor al dia de hoy'
        }
    }
    if ( form.cuenta?.length < 1 || form.cuenta === '' || form.cuenta === '-' || verificarCaracteres( form.cuenta ) ) {
        return {
            ok: false,
            msg: 'Ingrese una cuenta válida'
        }
    }
    if (form.nuevaCuenta === '' || !isNaN( form.nuevaCuenta ) || form.nuevaCuenta?.length < 2 || verificarCaracteres( form.nuevaCuenta )) {
        return{
            ok: false,
            msg: 'Ingrese una nueva cuenta válida'
        }
    }
    if ( form.from?.cuenta.length < 1 || form.from?.cuenta === '' || form.from?.cuenta === '-' || verificarCaracteres( form.from?.cuenta ) ) {
        return {
            ok: false,
            msg: 'Ingrese una cuenta a debitar válida'
        }
    }
    if ( form.to?.cuenta.length < 1 || form.to?.cuenta === '' || form.to?.cuenta === '-' || verificarCaracteres( form.to?.cuenta ) ) {
        return {
            ok: false,
            msg: 'Ingrese una cuenta a acreditar válida'
        }
    }
    if ( form.subcuenta?.length < 1 || form.subcuenta === '' || form.subcuenta === '-' || verificarCaracteres( form.subcuenta )) {
        return {
            ok: false,
            msg: 'Ingrese una subcuenta válida'
        }
    }
    if (form.nuevaSubcuenta === '' || !isNaN( form.nuevaSubcuenta ) || form.nuevaSubcuenta?.length < 2 || verificarCaracteres( form.nuevaSubcuenta )) {
        return{
            ok: false,
            msg: 'Ingrese una nueva subcuenta válida'
        }
    }
    if ( form.from?.subcuenta.length < 1 || form.from?.subcuenta === '' || form.from?.subcuenta === '-' || verificarCaracteres( form.from?.cuenta ) ) {
        return {
            ok: false,
            msg: 'Ingrese una subcuenta a debitar válida'
        }
    }
    if ( form.to?.subcuenta.length < 1 || form.to?.subcuenta === '' || form.to?.subcuenta === '-' || verificarCaracteres( form.to?.cuenta ) ) {
        return {
            ok: false,
            msg: 'Ingrese una subcuenta a acreditar válida'
        }
    }
    if ( form.prestador === '' || !isNaN( form.prestador ) || form.prestador?.length < 2 || verificarCaracteres( form.prestador ) ) {
        return {
            ok: false,
            msg: 'Ingrese un prestador válido'
        }
    }
    if ( form.tomador === '' || !isNaN( form.tomador ) || form.tomador?.length < 2 || verificarCaracteres( form.tomador ) ) {
        return {
            ok: false,
            msg: 'Ingrese un tomador válido'
        }
    }
    if ( form.categoria?.length < 1 || form.categoria === '' || form.categoria === '-' || verificarCaracteres( form.categoria ) ) {
        return {
            ok: false,
            msg: 'Ingrese una categoria válida'
        }
    }
    if ( form.nombre?.length < 1 || form.nombre === '' || form.nombre === '-' || verificarCaracteres( form.nombre ) ) {
        return {
            ok: false,
            msg: 'Ingrese un nuevo nombre de categoria válido'
        }
    }
    if ( form.sector?.length < 1 || form.sector === '' || form.sector === '-' || verificarCaracteres( form.sector ) ) {
        return {
            ok: false,
            msg: 'Ingrese un nuevo nombre de sector válido'
        }
    }
    if ( (form.cantidad !== undefined) && (form.cantidad <= 0 || form.cantidad === '' || form.cantidad === '-' || isNaN( form.cantidad ) || verificarCaracteres( form.cantidad )) ) {
        return {
            ok: false,
            msg: 'Ingrese una cantidad válida (mayor a cero)'
        }
    }
    if ( verificarCaracteres( form.descripcion ) ) {
        return {
            ok: false,
            msg: 'Descripcion no valida (evite los signos como: "<, >, "", `` )'
        }
    }
    if ( form.nuevaCategoria === '' || !isNaN( form.nuevaCategoria ) || form.nuevaCategoria?.length < 2 || verificarCaracteres( form.nuevaCategoria )) {
        return{
            ok: false,
            msg: 'Ingrese un nuevo nombre de categoria válido'
        }
    }
    if ( (form.cuotasAPagar !== undefined) && (form.cuotasAPagar <= 0 || form.cuotasAPagar === '' || form.cuotasAPagar === '-' || isNaN( form.cuotasAPagar ) || verificarCaracteres( form.cuotasAPagar )) ){
        return {
            ok: false,
            msg: 'Ingrese una cantidad de cuotas válida (mayor a cero)'
        }  
    }
    if ( (form.cantidadAPagar !== undefined) && (form.cantidadAPagar <= 0 || form.cantidadAPagar === '' || form.cantidadAPagar === '-' || isNaN( form.cantidadAPagar ) || verificarCaracteres( form.cantidadAPagar )) ){
        return {
            ok: false,
            msg: 'Ingrese una cantidad válida (mayor a cero)'
        }  
    }
    if ( (form.cuotas !== undefined) && (form.cuotas <= 0 || form.cuotas === '' || form.cuotas === '-' || isNaN( form.cuotas ) || verificarCaracteres( form.cuotas )) ){
        return {
            ok: false,
            msg: 'Ingrese una cantidad de cuotas válida (mayor a cero)'
        }  
    }
    if ( form.monedaValuacion?.length < 1 || form.monedaValuacion === '' || form.monedaValuacion === '-' || verificarCaracteres( form.monedaValuacion ) ) {
        return {
            ok: false,
            msg: 'Ingrese una moneda para valuación válida'
        }
    }
    
    return {
        ok: true
    }

}