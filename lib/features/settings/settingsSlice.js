import { createSlice } from '@reduxjs/toolkit'

const getInitialCurrency = () => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('currency')
        if (saved) return saved
    }
    return process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'Rs'
}

const initialState = {
    currency: getInitialCurrency(),
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setCurrency: (state, action) => {
            state.currency = action.payload
            if (typeof window !== 'undefined') {
                localStorage.setItem('currency', action.payload)
            }
        }
    }
})

export const { setCurrency } = settingsSlice.actions
export default settingsSlice.reducer
