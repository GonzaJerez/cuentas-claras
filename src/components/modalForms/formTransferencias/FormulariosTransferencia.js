import { CompraActivos } from "../formCompraActivos/CompraActivos"
import { VentaActivos } from "../formVentaActivos/VentaActivos"
import { DetalleTransferencia } from "./DetalleTransferencia"
import { TransferenciaForm } from "./TransferenciaForm"
import Swal from 'sweetalert2'

import { useDispatch, useSelector } from 'react-redux';
import { startActualizarMovimiento, startEliminarMovimiento, startNuevoMovimiento } from '../../../actions/movsActions';
import { useForm } from '../../../hooks/useForm';
import { useManySelectors } from '../../../hooks/useManySelectors';
import { useState } from 'react';
import { startAgregarCuenta, startAgregarSubcuenta } from '../../../actions/cuentasActions';
import { isFormValid } from '../../../helpers/isFormValid';
import { sumarCantidadPorSubcuenta } from "../../../helpers/getCantidades"
import { startAgregarCategoria } from "../../../actions/categoriasActions"

export const FormulariosTransferencia = ({ handleClose, modo, typeModal }) => {
    
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const [nuevaCuentaFrom, setNuevaCuentaFrom] = useState('')
    const [nuevaCuentaTo, setNuevaCuentaTo] = useState('')
    const [nuevaSubcuentaFrom, setNuevaSubcuentaFrom] = useState('')
    const [nuevaSubcuentaTo, setNuevaSubcuentaTo] = useState('')
    const [msgForm, setMsgForm] = useState(false)
    const { cuentas } = useSelector(state => state.cuentas)
    const { categorias } = useSelector(state => state.cats)

    const { nombreCuentas, activeMov, movs } = useManySelectors();


    const [ formValues, handleChange, handleChangeCalendar, handleChangeFrom, handleChangeTo ] = useForm( activeMov ? activeMov : {
        fecha: new Date(),
        from: {
            cuenta: nombreCuentas[0],
            subcuenta: '-'
        },
        to: {
            cuenta: nombreCuentas[1],
            subcuenta: '-'
        },
        cantidad: 0,
        descripcion: '',
        tipo: '',
        url: ''
    })

    const handleSubmit = e => {
        e.preventDefault();

        formValues.fecha = Date.parse(formValues.fecha)

        // Validacion formulario
        const respForm = isFormValid( formValues );
        if ( !respForm.ok ) {
            setMsgForm( respForm.msg )
            return;
        }

        // Agrega nueva Cuenta y Subcuenta - TO
        if (formValues.to.cuenta === 'nuevaCuenta') {
            
            const respForm = isFormValid( { nuevaCuenta: nuevaCuentaTo, nuevaSubcuenta: nuevaSubcuentaTo } );
            if ( !respForm.ok ) {
                setMsgForm( 'Nuevos nombres de cuentas no válidos' )
                return;
            }

            formValues.to.cuenta = nuevaCuentaTo;
            formValues.to.subcuenta = nuevaSubcuentaTo;
            dispatch( startAgregarCuenta( {
                nombre: nuevaCuentaTo,
                subcuentas: [ nuevaSubcuentaTo ]
            }))
            
        }

        // Agrega nueva Cuenta y Subcuenta - FROM
        if (formValues.from.cuenta === 'nuevaCuenta') {
            
            const respForm = isFormValid( { nuevaCuenta: nuevaCuentaFrom, nuevaSubcuenta: nuevaSubcuentaFrom } );
            if ( !respForm.ok ) {
                setMsgForm( 'Nuevos nombres de cuentas no válidos' )
                return;
            }

            formValues.from.cuenta = nuevaCuentaFrom;
            formValues.from.subcuenta = nuevaSubcuentaFrom;
            dispatch( startAgregarCuenta( {
                nombre: nuevaCuentaFrom,
                subcuentas: [ nuevaSubcuentaFrom ]
            }))
        }

        /* // Agrega nueva Cuenta y Subcuenta - To
        if (formValues.to.cuenta === 'nuevaCuenta') {
            
            const respForm = isFormValid( { nuevaCuenta: nuevaCuentaTo, nuevaSubcuenta: nuevaSubcuentaTo } );
            if ( !respForm.ok ) {
                setMsgForm( 'Nuevos nombres de cuentas no válidos' )
                return;
            }

            formValues.to.cuenta = nuevaCuentaTo;
            formValues.to.subcuenta = nuevaSubcuentaTo;
            dispatch( agregarCuenta( {
                nombre: nuevaCuentaTo,
                subcuentas: [ nuevaSubcuentaTo ]
            }))
        } */

        // Agrega nueva Subcuenta a Cuenta ya existente - TO
        if (formValues.to.cuenta !== 'nuevaCuenta' && formValues.to.subcuenta === 'nuevaSubcuenta' ) {
            const respForm = isFormValid( nuevaSubcuentaTo );
            if ( !respForm.ok ) {
                setMsgForm( 'Nuevos nombres de cuentas no válidos' )
                return;
            }

            formValues.to.subcuenta = nuevaSubcuentaTo;

            dispatch( startAgregarSubcuenta( {
                id: cuentas.find( cta => cta.nombre === formValues.cuenta ).id,
                nombre: formValues.to.cuenta,
                subcuentas: [ ...cuentas.find( el => el.nombre === formValues.to.cuenta ).subcuentas, nuevaSubcuentaTo ]
            }))
        }

        // Agrega nueva Subcuenta a Cuenta ya existente - FROM
        if (formValues.from.cuenta !== 'nuevaCuenta' && formValues.from.subcuenta === 'nuevaSubcuenta' ) {

            const respForm = isFormValid( nuevaSubcuentaFrom );
            if ( !respForm.ok ) {
                setMsgForm( 'Nuevos nombres de cuentas no válidos' )
                return;
            }

            formValues.from.subcuenta = nuevaSubcuentaFrom;

            dispatch( startAgregarSubcuenta( {
                id: cuentas.find( cta => cta.nombre === formValues.cuenta ).id,
                nombre: formValues.from.cuenta,
                subcuentas: [ ...cuentas.find( el => el.nombre === formValues.from.cuenta ).subcuentas, nuevaSubcuentaFrom ]
            }))
        }

        // Verifica si es una edicion o un nuevo movimiento
        if ( activeMov ) {
            dispatch( startActualizarMovimiento( formValues ));
            Swal.fire('Nueva edición', 'Movimiento editado correctamente', 'success')
        } else {
            if ( formValues.tipo === 'ventaActivos') {
                
                // Nuevo movimiento de ingreso cuando la venta supera la cantidad del activo
                const cantidadRestanteEnCuenta = sumarCantidadPorSubcuenta( movs, cuentas, formValues.from.cuenta ).find( mov => mov.subcuenta === formValues.from.subcuenta ).cantidad
                const restaEntreCantidadEnCuentaYCantidadVendida = cantidadRestanteEnCuenta - parseInt(formValues.cantidad )

                if( restaEntreCantidadEnCuentaYCantidadVendida < 0 ){
                    if ( !categorias.find( cat => cat.nombre === 'Ganancia por ventas' )) {
                        dispatch( startAgregarCategoria({
                            nombre: 'Ganancia por ventas',
                            tipo: 'ingreso',
                            sector: 'ventas'
                        }))
                    }

                    formValues.cantidad = cantidadRestanteEnCuenta;
    
                    dispatch( startNuevoMovimiento({
                        cantidad: Math.abs( restaEntreCantidadEnCuentaYCantidadVendida ),
                        tipo: 'ingreso',
                        categoria: 'Ganancia por ventas',
                        cuenta: formValues.to.cuenta,
                        subcuenta: formValues.to.subcuenta,
                        fecha: Date.now(),
                        comprobante: formValues.url,
                        descripcion: `Venta de ${ formValues.from.subcuenta }`
                    }, 'nuevoIngreso'))
                }
            }

            dispatch( startNuevoMovimiento({
                ...formValues
            }, 'nuevaTransferencia') );

            Swal.fire('Nuevo movimiento', 'Movimiento creado correctamente', 'success')
        }
        
        handleClose(e);
    }

    const handleDelete = e => {
        e.preventDefault();
        const confirm = window.confirm('¿Seguro que desea eliminar el evento? No podra recupararlo despues');

        if ( confirm ) {
            dispatch( startEliminarMovimiento( activeMov.id ) );
            handleClose(e);
            Swal.fire('Eliminado', 'Movimiento eliminado correctamente', 'success')
        }  
    }

    return (
        <>
            {
                modo === 'solo ver' && <DetalleTransferencia />
            }
            {
                ( (typeModal === 'transferencia') && (modo === 'crear' || modo === 'editar')) && 
                        <TransferenciaForm 
                        handleClose={ handleClose } 
                        handleSubmit={ handleSubmit } 
                        handleDelete={ handleDelete }
                        activeMov={ activeMov } 
                        cuentas={ cuentas }
                        nombreCuentas={ nombreCuentas }
                        msgForm={ msgForm } 
                        handleChangeCalendar={ handleChangeCalendar }
                        formValues={ formValues }
                        handleChangeFrom={ handleChangeFrom }
                        handleChangeTo= { handleChangeTo } 
                        nuevaCuentaTo={ nuevaCuentaTo }
                        setNuevaCuentaTo={ setNuevaCuentaTo }
                        nuevaSubcuentaTo={ nuevaSubcuentaTo }
                        setNuevaSubcuentaTo={  setNuevaSubcuentaTo }
                        handleChange={ handleChange }
                        isLoading={ isLoading }
                        setIsLoading={ setIsLoading }/>
                        
            }
            {
                (typeModal === 'compraActivos') && (modo === 'crear' || modo === 'editar' ) &&
                         <CompraActivos 
                         handleClose={ handleClose } 
                        handleSubmit={ handleSubmit } 
                        handleDelete={ handleDelete }
                        activeMov={ activeMov } 
                        cuentas={ cuentas }
                        nombreCuentas={ nombreCuentas }
                        msgForm={ msgForm } 
                        handleChangeCalendar={ handleChangeCalendar }
                        formValues={ formValues }
                        handleChangeFrom={ handleChangeFrom }
                        handleChangeTo= { handleChangeTo }
                        nuevaCuentaFrom={ nuevaCuentaFrom }
                        setNuevaCuentaFrom={ setNuevaCuentaFrom }
                        nuevaSubcuentaFrom={ nuevaSubcuentaFrom }
                        setNuevaSubcuentaFrom={  setNuevaSubcuentaFrom }
                        nuevaSubcuentaTo={ nuevaSubcuentaTo }
                        setNuevaSubcuentaTo={  setNuevaSubcuentaTo }
                        handleChange={ handleChange }
                        isLoading={ isLoading }
                        setIsLoading={ setIsLoading } />
            }
            {
                (typeModal === 'ventaActivos') && (modo === 'crear' || modo === 'editar') && 
                        <VentaActivos 
                        handleClose={ handleClose } 
                        handleSubmit={ handleSubmit } 
                        handleDelete={ handleDelete }
                        activeMov={ activeMov } 
                        cuentas= { cuentas }
                        nombreCuentas={ nombreCuentas }
                        msgForm={ msgForm } 
                        handleChangeCalendar={ handleChangeCalendar }
                        formValues={ formValues }
                        handleChangeFrom={ handleChangeFrom }
                        handleChangeTo= { handleChangeTo }
                        nuevaCuentaTo={ nuevaCuentaTo }
                        setNuevaCuentaTo={ setNuevaCuentaTo }
                        nuevaSubcuentaTo={ nuevaSubcuentaTo }
                        setNuevaSubcuentaTo={  setNuevaSubcuentaTo }
                        handleChange={ handleChange }
                        isLoading={ isLoading }
                        setIsLoading={ setIsLoading } />
            }
        </>
    )
}
