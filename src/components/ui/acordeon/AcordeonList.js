import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { insertarCuentaActiva } from "../../../actions/cuentasActions";
import { openModal } from "../../../actions/modalActions";
import { List } from "../lists/List";
import { sumarCantidadTotalPorCuenta, sumarCantidadPorSubcuenta, sumarCantidadTotalActivos, sumarCantidadTotalOtrasCriptomonedas } from '../../../helpers/getCantidades'

export const AcordeonList = () => {

    const { movs } = useSelector(state => state.movs)
    const { pares } = useSelector(state => state.pares)
    const { cuentas, isEditing } = useSelector(state => state.cuentas );
    
    const dispatch = useDispatch();

    const handleToggleAccordion = (e, cta ) => {

        if ( e.classList.contains('accordion-button') ) {
            
            let cantElemInternos = cuentas.find(el => el.nombre === cta ).subcuentas.length
    
            e.classList.toggle('collapsed');
            e.parentElement.nextSibling.classList.toggle('show');
            if (e.parentElement.nextSibling.classList.contains('show')) {
                
                e.parentElement.nextSibling.style.height = 'calc(' + 55 * ( cantElemInternos ) + 'px + 3rem)' ;
            } else{
                e.parentElement.nextSibling.style.height = '0px'
            }
        }

    }

    const openingModal = ( e, cta, cantidad ) =>{
        e.preventDefault();
        dispatch( openModal({
            tipo: 'editar cuentas',
        }))
        dispatch( insertarCuentaActiva( {
            ...cta,
            cantidad
        }))

    }

    return (
        <div className="accordion accordion-list" id="accordionPanelsStayOpenExample">
            {
                cuentas.map( cta => 
                    <div className="accordion-item" key={ cta.nombre }>
                        <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                            <button onClick={ (e) => handleToggleAccordion( e.target, cta.nombre ) } className="accordion-button d-flex justify-content-between align-items-center collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                { cta.nombre }
                                <span onClick={ e => e.target.parentElement.click() } className={`badge bg-secondary bg-${ sumarCantidadTotalPorCuenta( movs, cuentas, cta.nombre ).valor < 0 ? 'danger': ''}${ sumarCantidadTotalPorCuenta( movs, cuentas, cta.nombre ).valor > 0 ? 'success': ''}`}>{ new Intl.NumberFormat('en-US', {style: "currency", currency: "USD", minimumFractionDigits: (cta.nombre === 'BTC' || cta.nombre === 'ETH' ) ? 6 : 2}).format( 
                                    cta.nombre === 'Activos'  
                                        ? sumarCantidadTotalActivos( movs, cuentas, 'USD', pares ).cantidadTotalConvertida 
                                        : (cta.nombre === 'Otras criptomonedas')
                                            ? sumarCantidadTotalOtrasCriptomonedas( movs, cuentas, 'USD', pares ).cantidadTotalConvertida 
                                            : sumarCantidadTotalPorCuenta( movs, cuentas, cta.nombre ).valor )
                                }</span>
                                { isEditing && <i onClick={ e => openingModal( e, cta, sumarCantidadTotalPorCuenta( movs, cuentas, cta.nombre ).valor ) } className="bi bi-pencil"></i> }
                                
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingOne">
                            <div className="accordion-body">
                                
                                <List elementos={ sumarCantidadPorSubcuenta( movs, cuentas, cta.nombre, pares ) } isEditing={ isEditing } nomCuenta={ cta.nombre } />
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
