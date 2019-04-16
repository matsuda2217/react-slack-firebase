import * as actionTypes from './../actions/types';

const initialState = {
  primaryColor: "#eee",
  secondaryColor: "#4c3c4c"
}
const color_reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_COLORS:
      return {
        ...state,
        primaryColor: action.payload.primaryColor,
        secondaryColor: action.payload.secondaryColor,
      }
    default:
      return state
  }
}
export default color_reducer;