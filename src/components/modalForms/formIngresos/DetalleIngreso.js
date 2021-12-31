import { useSelector } from "react-redux"

export const DetalleIngreso = () => {

    const { cantidad, categoria, cuenta, subcuenta, fecha, descripcion, deQuien, url } = useSelector(state => state.movs.activeMov)

    return (
        <div className='detalle__form'>
            <h1>Detalle ingreso</h1>

            <section className='detalle__section'>
                <h4>Tipo: <span> Ingreso </span></h4>

                <h4>Fecha: <span>{ new Date( fecha ).toLocaleDateString() }</span></h4>

                <h4>Cantidad: <span>$ { Math.abs( cantidad ) }</span></h4>
    
                <h4>Cuenta acreditada: <span>{ cuenta }</span></h4>

                <h4>Subcuenta: <span>{ subcuenta }</span></h4>

                <h4>Motivo: <span>{ categoria }</span></h4>

                { deQuien && <h4>Cobro a: <span>{ deQuien }</span></h4> }

                { url && <h4>Comprobante: <a href={ url } target='_blank' rel="noreferrer">Ver comprobante</a></h4> }
                
                <h4>Descripcion: <span>{ descripcion }</span></h4>
            </section>
        </div>
    )
}
