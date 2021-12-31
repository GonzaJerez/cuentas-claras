import { useSelector } from "react-redux"

export const DetalleTransferencia = () => {

    const { cantidad, from, to, fecha, descripcion, url } = useSelector(state => state.movs.activeMov)

    return (
        <div className='detalle__form'>
            <h1>Detalle transferencia</h1>

            <section className='detalle__section'>
                <h4>Tipo: <span> Transferencia </span></h4>

                <h4>Fecha: <span>{ fecha.toLocaleDateString() }</span></h4>

                <h4>Cantidad: <span>$ { Math.abs( cantidad ) }</span></h4>
    
                <h4>Desde cuenta: <span>{ from.subcuenta } ({ from.cuenta })</span></h4>

                <h4>A cuenta: <span>{ to.subcuenta } ({ to.cuenta })</span></h4>

                { url && <h4>Comprobante: <a href={ url } target='_blank' rel="noreferrer">Ver comprobante</a></h4> }

                <h4>Descripcion: <span>{ descripcion }</span></h4>
            </section>
        </div>
    )
}
