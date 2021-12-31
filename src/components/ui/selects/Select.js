import PropTypes from 'prop-types';

export const Select = ({options, clase, actualizarState, state }) => {
    return (
        <span className='select__view'>
            <select className={ clase } onChange={ actualizarState } defaultValue={ state }>
                {
                    options.map( op => <option key={ op } value={ op }>{ op } </option> )
                }
            </select>
        </span>
    )
}

Select.propTypes = {
    options : PropTypes.array.isRequired,
    clase: PropTypes.string,
    actualizarState: PropTypes.func
}