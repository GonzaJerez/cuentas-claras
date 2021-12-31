import { types } from "../types/types";


export const openModal = ( typeModal ) => (
    {
        type: types.openModal,
        payload: {
            tipo: typeModal.tipo,
            modo: typeModal.modo,
            title: typeModal.title
        }
    }
)

export const closeModal = () => (
    {
        type: types.closeModal,
    }
)