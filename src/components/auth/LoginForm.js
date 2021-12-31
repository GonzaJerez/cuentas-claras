import { useState } from "react";
import { useDispatch } from "react-redux"
import validator from 'validator';
import { startingLoginWithEmail, startingLoginWithGoogle } from "../../actions/authActions";
import { useForm } from "../../hooks/useForm";

export const LoginForm = ({ handleChangeScreen }) => {

    const dispatch = useDispatch();
    const [errorForm, setErrorForm] = useState( false )

    const loginWithGoogle = e => {
        e.preventDefault()
        dispatch( startingLoginWithGoogle() )
    }

    const [ formValues, handleChange ] = useForm({
        email: '',
        pass: '',
    })

    const isFormLoginValid = () =>{
        if ( !validator.isEmail( formValues.email1.trim() )) {
            setErrorForm( 'Email invalido')
            return false;
        }
        return true;
    }

    const handleLogin = e => {
        e.preventDefault();
        if ( isFormLoginValid ) {
            
            dispatch( startingLoginWithEmail( formValues.email, formValues.pass ) )
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
            <form onSubmit={ handleLogin }>
                <div className="form-floating mb-3">
                    <input name="email" value={ formValues.email } onChange={ handleChange } type="email" className="form-control" id="floatingInput" placeholder="Email usuario"/>
                    <label htmlFor="floatingInput">Email usuario</label>
                </div>

                <div className="form-floating">
                    <input name="pass" value={ formValues.pass } onChange={ handleChange } type="password" className="form-control" id="floatingPassword" placeholder="Password"/>
                    <label htmlFor="floatingPassword">Password</label>
                </div>

                <button type="submit" className="btn submit">Ingresar</button>

                <div className="auth__social-networks">
                    <p>Ingresar con Google</p>
                    <div 
                        className="google-btn"
                        onClick={ loginWithGoogle }
                    >
                        <div className="google-icon-wrapper">
                            <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="google button" />
                        </div>
                        <p className="btn-text">
                            Sign in with google
                        </p>
                    </div>
                </div>

                <button className="btn change" onClick={ handleChangeScreen }>¿No estás registrado? Registrate ahora</button>
            </form>
        </div>
    )
}
