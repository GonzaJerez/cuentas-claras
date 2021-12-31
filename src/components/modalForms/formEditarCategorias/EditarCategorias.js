import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { startEditarCategoria, startEliminarCategoria } from "../../../actions/categoriasActions";
import { startEditarNombreCategoria } from "../../../actions/movsActions";
import { isFormValid } from "../../../helpers/isFormValid";

export const EditarCategorias = ({ handleClose, activeCat }) => {

    const { categorias } = useSelector(state => state.cats)
    
    const dispatch = useDispatch();
    const [msgForm, setMsgForm] = useState(false)
    const [ stateCategorias, setStateCategorias] = useState({
        id: activeCat.id,
        tipo: activeCat.tipo,
        nombre: '',
        sector: categorias.find( cat => cat.nombre === activeCat.catNombre ).sector
    })

    const handleChange = e => {
        setStateCategorias({
            ...stateCategorias,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmitEditar = e => {
        e.preventDefault()

        // Validacion formulario
        const respForm = isFormValid( {
            nuevaCategoria: stateCategorias.nombre,
        } );

        if ( !respForm.ok ) {
            setMsgForm( respForm.msg )
            return;
        }

        dispatch( startEditarCategoria( stateCategorias ))
        dispatch( startEditarNombreCategoria( stateCategorias ))
        handleClose(e)
        Swal.fire('Nombre actualizado a '+ stateCategorias.nombre, 'Categoria actualizada correctamente', 'success')
    }

    const handleDelete = e => {
        e.preventDefault();

        if ( activeCat.catCantidad === 0 ) {
            let confirmacion = window.confirm(`¿Estas seguro que deseas eliminar la categoria ${ activeCat.catNombre } ?`)
            if (confirmacion){
                dispatch( startEliminarCategoria( stateCategorias ) )
                Swal.fire('Categoria eliminada', `La categoria ${ activeCat.catNombre } ha sido borrada exitosamente`, 'success')
            }
        }

        handleClose(e);
    }

    return (
        <>
            <form className="editar-categoria" onSubmit={ handleSubmitEditar }>
                <div className='form-container'>
                    <h1>Editar Categoria</h1>
                    { msgForm && <div className='msg-error'>{ msgForm }</div> }
                    <section className="modal__section">
                        <label htmlFor="categoriaActual">Nombre actual: </label>
                        <h4>{ activeCat.catNombre }</h4>
                    </section>
                    <section className="modal__section">
                        <label htmlFor="nombre">Nuevo nombre: </label>
                        <input value={ stateCategorias.nombre } name='nombre' onChange={ handleChange } type="text" placeholder="Nombre de la categoria" />
                    </section>
                    <section className="modal__section">
                        <label htmlFor="sector">Sector: </label>
                        <input name='sector' value={ stateCategorias.sector } onChange={ handleChange } type="text" placeholder="Nuevo sector" />
                    </section>
                </div>
                <div className='botones'>
                    <button className=' btn boton-submit' type='submit'>Guardar</button>
                    <button onClick={ handleClose } className='btn btn-secondary boton-cancel'>Cancelar</button>
                    { activeCat.catCantidad === 0 && <button onClick={ handleDelete } className='btn btn-danger boton-eliminar'>Eliminar</button> }
                </div>
            </form>
        </>
    )
}
