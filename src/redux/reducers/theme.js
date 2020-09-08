const initialState = {
    lightTheme: false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {
        case 'THEME:TOGGLE':
            return {
                ...state,
                lightTheme: payload
            };
        default:
            return state
    }
}