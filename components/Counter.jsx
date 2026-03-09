'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId, color }) => {

    const { cartItems } = useSelector(state => state.cart);
    const cartItemId = color ? `${productId}-${color}` : productId;

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({ productId, color }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId, color }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} className="p-1 select-none">-</button>
            <p className="p-1">{cartItems[cartItemId]}</p>
            <button onClick={addToCartHandler} className="p-1 select-none">+</button>
        </div>
    )
}

export default Counter