import { useSelector } from "react-redux";

export const useManySelectors = ( tipo ) => {

    const { movs, activeMov } = useSelector(state => state.movs );
    const { typeModal } = useSelector(state => state.modals );
    const { categorias } = useSelector(state => state.cats );
    const { cuentas } = useSelector(state => state.cuentas );

    const totalMovimientos = movs.filter( el => el.tipo !== 'prestamo' && el.tipo !== 'transferencia' && el.tipo !== 'deuda' );

    const nombreCuentas = cuentas.map( el => el.nombre )

    let nombreCategorias = []
    tipo ? nombreCategorias = categorias.filter( el => el.tipo === tipo ).map( el => el.nombre ).sort()
         : nombreCategorias = categorias.filter( el => el.tipo === typeModal ).map( el => el.nombre ).sort()
    

    return {
        movs,
        activeMov,
        typeModal,
        totalMovimientos,
        cuentas,
        nombreCuentas,
        nombreCategorias
    } ;
}
