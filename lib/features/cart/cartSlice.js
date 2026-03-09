import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {},
    },
    reducers: {
        addToCart: (state, action) => {
            const { productId, color } = action.payload
            const cartItemId = color ? `${productId}-${color}` : productId;

            if (state.cartItems[cartItemId]) {
                state.cartItems[cartItemId]++
            } else {
                state.cartItems[cartItemId] = 1
            }
            state.total += 1
        },
        removeFromCart: (state, action) => {
            const { productId, color } = action.payload
            const cartItemId = color ? `${productId}-${color}` : productId;

            if (state.cartItems[cartItemId]) {
                state.cartItems[cartItemId]--
                if (state.cartItems[cartItemId] === 0) {
                    delete state.cartItems[cartItemId]
                }
            }
            state.total -= 1
        },
        deleteItemFromCart: (state, action) => {
            const { productId, color } = action.payload
            const cartItemId = color ? `${productId}-${color}` : productId;

            state.total -= state.cartItems[cartItemId] ? state.cartItems[cartItemId] : 0
            delete state.cartItems[cartItemId]
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions

export default cartSlice.reducer
