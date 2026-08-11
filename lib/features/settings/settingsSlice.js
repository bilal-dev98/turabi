import { createSlice } from '@reduxjs/toolkit'

const getInitialCurrency = () => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('currency')
        if (saved && saved !== 'Rs' && saved !== 'PKR') {
            localStorage.removeItem('currency')
        }
    }
    return 'Rs'
}

const initialState = {
    currency: getInitialCurrency(),
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setCurrency: (state, action) => {
            const val = (action.payload === '$' || action.payload === 'USD') ? 'Rs' : action.payload
            state.currency = val || 'Rs'
            if (typeof window !== 'undefined') {
                localStorage.setItem('currency', state.currency)
            }
        }
    }
})

export const { setCurrency } = settingsSlice.actions
export default settingsSlice.reducer

