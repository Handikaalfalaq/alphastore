const initialState = {
  popup: false,
  isLogin: false,
  isLoading: false,
  user: {},
  notes: [],
  product: {},
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHANGE_POPUP':
      return {
        ...state,
        popup: action.value,
      };
    case 'CHANGE_ISLOGIN':
      return {
        ...state,
        isLogin: action.value,
      };
    case 'CHANGE_USER':
      return {
        ...state,
        user: action.value,
      };
    case 'CHANGE_LOADING':
      return {
        ...state,
        isLoading: action.value,
      };
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.value,
      };
    case 'SET_PRODUCT':
      return {
        ...state,
        product: action.value,
      };
    default:
      return state;
  }
};

export default reducer;
