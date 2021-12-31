import { useState } from "react"
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export const LoginScreen = () => {

    const [screen, setScreen] = useState('login')

    const handleChangeScreen = e => {
        e.preventDefault();
        screen === 'login' ? setScreen( 'register') : setScreen('login')
    }

    return (
        <>
            <img className="img-fondo" src="https://www.billin.net/blog/wp-content/uploads/2020/09/Libro-mayor-1140x760.jpg" alt="fondo-contabilidad" />
            <div className="login__screen">
                {
                    screen === 'login'
                    && <LoginForm handleChangeScreen={ handleChangeScreen } />
                }
                {
                    screen === 'register'
                    && <RegisterForm handleChangeScreen= { handleChangeScreen } />
                }
                
            </div>
        </>
    )
}
