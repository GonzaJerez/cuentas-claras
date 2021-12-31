import { useEffect, useRef, useState } from "react"
import { fileUpload } from "../../../helpers/fileUpload";

export const UploadFile = ({ formValues, isLoading, setIsLoading }) => {

    const isMounted = useRef( true )

    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, [])

    const [isComprobanteAdd, setIsComprobanteAdd] = useState( formValues.url )
    const comprobante = useRef();

    const agregarComprobante = e => {
        e.preventDefault();
        comprobante.current.click();
    }

    const handleChangeComprobante =  async(e) => {
        e.preventDefault();

        if ( e.target.files.length === 0 ) {
            setIsComprobanteAdd( false )
        } else{
            setIsLoading( true )
            const url = await fileUpload( e.target.files[0] )
            if ( isMounted.current ) {
                formValues.url = url;
                setIsComprobanteAdd( true );
                setIsLoading( false )
            }
        }
    }

    return (
        <div className="modal__section">
            <input ref={ comprobante } multiple={false} onChange={ handleChangeComprobante } type="file" name="factura" id="factura" accept='.png, .jpg, .jpeg, .pdf'/>
            <button className={`btn ${ isComprobanteAdd ? 'added' : ''}`} onClick={ agregarComprobante }> 
            { isComprobanteAdd 
                ?   <>
                        Comprobante agregado <i className='bi bi-file-earmark-check'></i>
                    </> 
                :   <>
                        Agregar comprobante <i className="bi bi-file-earmark-arrow-up"></i>
                    </> 
                  }
            </button>
            { isLoading && <p>Cargando...</p>}
        </div>
    )
}
