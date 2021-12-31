import { useForm } from "../../hooks/useForm";
import validator from 'validator';
import { useState } from "react";
import { startingRegisterWithEmail } from "../../actions/authActions";
import { useDispatch } from "react-redux";

export const RegisterForm = ({ handleChangeScreen }) => {

    const [errorForm, setErrorForm] = useState( false )
    const dispatch = useDispatch();

    const [ formValues, handleChange ] = useForm({
        nombre: '',
        email1: '',
        email2: '',
        pass1: '',
        pass2: ''
    })

    const isFormRegisterValid = () =>{
        if ( formValues.nombre.trim().length < 3 || !validator.isAlpha( formValues.nombre.trim(), ['es-ES'] ) ) {
            setErrorForm('Nombre invalido')
            return false;
        }
        if ( !validator.isEmail( formValues.email1.trim() )) {
            setErrorForm( 'Email invalido')
            return false;
        }
        if ( formValues.email2.trim() !== formValues.email1.trim() ) {
            setErrorForm( 'Los emails deben ser iguales')
            return false;
        }
        if ( !validator.isStrongPassword( formValues.pass1.trim(), { 
            minLength: 5,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
        }) ) {
            setErrorForm( 'La contraseña debe tener al menos 5 caracteres, mayusculas, minusculas y numeros')
            return false;
        }
        if ( formValues.pass1 !== formValues.pass2 ) {
            setErrorForm('Las contraseñas deben ser iguales')
            return false;
        }
        return true;
    }

    const handleRegister = e => {
        e.preventDefault();
        if ( isFormRegisterValid() ) {
            
            dispatch( startingRegisterWithEmail( formValues.nombre, formValues.email1, formValues.pass1 ) )
            setErrorForm( false )
        }
    }

    return (
        <div className="auth__container flip-scale-up-ver">
            <div className="img-user">
                <i className="bi bi-person"></i>
            </div>
            <h1>Cuentas claras</h1>
            {
                errorForm && 
                    <div className="form__error">
                        <p className="msg-error">{ errorForm }</p>
                    </div>
            }
            <form onSubmit={ handleRegister }>
                <div className="form-floating mb-3">
                    <input autoComplete="off" name="nombre" value={ formValues.nombre } onChange={ handleChange } type="text" className="form-control" id="floatingInputName" required placeholder="Ingrese su nombre"/>
                    <label htmlFor="floatingInputName">Ingrese su nombre</label>
                </div>
                <div className="form-floating mb-3">
                    <input autoComplete="off" name="email1" value={ formValues.email1 } onChange={ handleChange } type="email" className="form-control" id="floatingInputEmail1" required placeholder="Ingrese su email"/>
                    <label htmlFor="floatingInputEmail1">Ingrese su email</label>
                </div>
                <div className="form-floating mb-3">
                    <input autoComplete="off" name="email2" value={ formValues.email2 } onChange={ handleChange } type="email" className="form-control" id="floatingInputEmail2" required placeholder="Confirmar email"/>
                    <label htmlFor="floatingInputEmail2">Confirmar email</label>
                </div>

                <div className="form-floating">
                    <input name="pass1" value={ formValues.pass1 } onChange={ handleChange } type="password" className="form-control" id="floatingPassword1" required placeholder="Password"/>
                    <label htmlFor="floatingPassword1">Password</label>
                </div>
                <div className="form-floating">
                    <input name="pass2" value={ formValues.pass2 } onChange={ handleChange } type="password" className="form-control" id="floatingPassword2" required placeholder="Confirmar password"/>
                    <label htmlFor="floatingPassword2">Confirmar password</label>
                </div>

                <button type="submit" className="btn submit">Registrarse</button>
                <button className="btn change" onClick={ handleChangeScreen }>¿Ya estás registrado? Ingresa con tu cuenta</button>
            </form>
        </div>
    )
}
