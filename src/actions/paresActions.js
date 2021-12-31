import { types } from "../types/types";

export const actualizarValores = pares => {

    return{
        type: types.actualizarValores,
        payload: pares
    }
}
