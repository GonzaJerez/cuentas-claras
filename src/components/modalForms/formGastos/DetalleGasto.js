import { useSelector } from "react-redux"

export const DetalleGasto = () => {

    const { cantidad, categoria, cuenta, subcuenta, fecha, descripcion, cuotas, aQuien, url } = useSelector(state => state.movs.activeMov)

    return (
        <div className='detalle__form'>
            <h1>Detalle gasto</h1>

            <section className='detalle__section'>
                <h4>Tipo: <span> Gasto </span></h4>

                <h4>Fecha: <span>{ fecha.toLocaleDateString() }</span></h4>

                <h4>Cantidad: <span>$ { Math.abs( cantidad ) }</span></h4>
    
                <h4>Cuenta debitada: <span>{ cuenta }</span></h4>

                <h4>Subcuenta: <span>{ subcuenta }</span></h4>

                { cuotas && <h4>Cuotas: <span>{ cuotas }</span></h4> }

                <h4>Motivo: <span>{ categoria }</span></h4>

                { aQuien && <h4>Pago a: <span>{ aQuien }</span></h4> }

                { url && <h4>Comprobante: <a href={ url } target='_blank' rel="noreferrer">Ver comprobante</a></h4> }

                <h4>Descripcion: <span>{ descripcion }</span></h4>
            </section>
        </div>
    )
}
