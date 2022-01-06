import { useDispatch, useSelector } from "react-redux"
import { insertarCategoriaActiva } from "../../../actions/categoriasActions";
import { openModal } from "../../../actions/modalActions";
import { Table } from "../tables/Table"

export const AcordeonTable = ({ categorias, tableElements }) => {

    const dispatch = useDispatch();
    const { isEditing } = useSelector(state => state.cats);
    

    const handleToggleAccordion = (e, cat ) => {

        if ( e.classList.contains('accordion-button') ) {
            
            let cantElemInternos = tableElements.filter(el => el.categoria === cat ).length

            e.classList.toggle('collapsed');
            e.parentElement.nextSibling.classList.toggle('show');

            if (e.parentElement.nextSibling.classList.contains('show')) {
                
                e.parentElement.nextSibling.style.height = 4 * ( cantElemInternos + 1 ) + 'rem' ;
                
            } else{
                e.parentElement.nextSibling.style.height = '0rem'
            }

        }

    }

    const sumarCantidadTotalPorCategoria = ( cat ) =>{
        let cantidadTotal = 0
        tableElements.filter(el => el.categoria === cat ).map( el => cantidadTotal += parseInt( el.cantidad ) );
        return cantidadTotal;
    }

    const openingModal = ( e, catNombre, catCantidad, id, tipo ) =>{
        e.preventDefault();

        dispatch( openModal({
            tipo: 'editar categorias',
        }))
        dispatch( insertarCategoriaActiva( { catNombre, catCantidad, id, tipo } ))

    }

    return (
        <div className="accordion" id="accordionPanelsStayOpenExample">
            {
                categorias.map( cat =>
                    <div className="accordion-item" key={ cat.nombre }>
                        <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                            <button onClick={ (e) => handleToggleAccordion( e.target, cat.nombre ) } className={`accordion-button d-flex justify-content-between align-items-center collapsed ${ sumarCantidadTotalPorCategoria( cat.nombre ) === 0 ? 'no-use' : '' }` } type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                { cat.nombre }
                                {/* <span onClick={ e => e.target.parentElement.click() } className={`badge bg-secondary bg-${ (cat.tipo === 'gasto' && sumarCantidadTotalPorCategoria( cat.nombre ) !== 0 ) ? 'danger' : '' }${ ( cat.tipo === 'ingreso' && sumarCantidadTotalPorCategoria( cat.nombre ) !== 0 ) ? 'success' : '' }`}>{ new Intl.NumberFormat('en-US', {style: "currency", currency: "USD" }).format( sumarCantidadTotalPorCategoria( cat.nombre ) ) }</span> */}
                                { isEditing && <i onClick={ e => openingModal( e, cat.nombre, sumarCantidadTotalPorCategoria( cat.nombre ), cat.id, cat.tipo )} className="bi bi-pencil"></i> }
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                            <div className="accordion-body">
                                <Table movimientos={tableElements.filter(el => el.categoria === cat.nombre )} />
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
