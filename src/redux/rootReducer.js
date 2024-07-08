const initialState = {
    loading: false,
    cartItems: []
}
export const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        case "ADD_TO_CART":
            // Check if the product is already in the cart
            const existingProductIndex = state.cartItems.findIndex(product => product._id === action.payload._id);
            if (existingProductIndex !== -1) {
                // If the product exists, update its quantity
                const updatedCartItems = [...state.cartItems];
                updatedCartItems[existingProductIndex].quantity += 1;
                return {
                    ...state,
                    cartItems: updatedCartItems
                };
            } else {
                // If the product is not in the cart, add it
                return {
                    ...state,
                    cartItems: [...state.cartItems, action.payload]
                };
            }
        
        case "DELETE_FROM_CART":
            // Filter out the product with the given id
            const updatedCartItems = state.cartItems.filter(product => product._id !== action.payload._id);
            return {
                ...state,
                cartItems: updatedCartItems
            };

        case "UPDATE_CART":
            // Update the quantity of the product with the given id
            const updatedItems = state.cartItems.map(product => {
                if (product._id === action.payload._id) {
                    return { ...product, quantity: action.payload.quantity };
                }
                return product;
            });
            return {
                ...state,
                cartItems: updatedItems
            };
        case "CLEAR_CART":
                return {
                    ...state,
                    cartItems: []
                };
        

        default:
            return state;
    }
}
