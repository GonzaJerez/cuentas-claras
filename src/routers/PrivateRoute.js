
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { Modal } from "../components/ui/modal/Modal";

export const PrivateRoute= ({ children }) => {

    const { isOpen } = useSelector(state => state.modals ) 
    const { uid } = useSelector(state => state.auth)

    return (
        <div>
            {
                isOpen && <Modal />
            }
            {
                uid
                    ? children
                    : <Navigate to='/login' />
            }
        </div>
    )
}
