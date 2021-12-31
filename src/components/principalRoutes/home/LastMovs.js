import { Table } from "../../ui/tables/Table"

export const LastMovs = ({ movimientos }) => {


    return (
        <section className='tabla-general'>

        <h3>Ultimos movimientos</h3>

        <Table movimientos={ movimientos } cantMostrada={ 5 } />

        </section>
    )
}
