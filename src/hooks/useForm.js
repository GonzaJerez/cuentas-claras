import { useState } from "react";


export const useForm = ( initialState = {} ) => {

    const [formValues, setFormValues] = useState( initialState )

    const handleChange = (e)=> {
        setFormValues({
            ...formValues,
            [ e.target.name ]: e.target.value
        })
    }

    const handleChangeCalendar = e => {
        setFormValues({
            ...formValues,
            fecha: e
        })
    }

    const handleChangeFrom = e =>{
        setFormValues({
            ...formValues,
            from:{
                ...formValues.from,
                [ e.target.name ]: e.target.value
            }
        })
    }

    const handleChangeTo = e =>{
        setFormValues({
            ...formValues,
            to:{
                ...formValues.to,
                [ e.target.name ]: e.target.value
            }
        })
    }

    return [ formValues, handleChange, handleChangeCalendar, handleChangeFrom, handleChangeTo ];
}
