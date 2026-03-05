'use client'
import { XIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { addAddress } from "@/lib/features/address/addressSlice"

const AddressModal = ({ setShowAddressModal }) => {
    const dispatch = useDispatch()

    const [address, setAddress] = useState({
        name: '',
        email: 'customer@example.com', // default or optional since user didn't mention it
        street: '',
        landmark: '',
        city: '',
        state: 'N/A', // default
        zip: '00000', // default
        country: 'PK', // default
        phone: '',
        emergencyContact: ''
    })

    const handleAddressChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const response = await fetch('/api/address', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(address)
        })

        const data = await response.json()

        if (data.success) {
            dispatch(addAddress(data.data))
            setShowAddressModal(false)
            return data.message
        } else {
            throw new Error(data.message || 'Failed to add address')
        }
    }

    return (
        <form onSubmit={e => toast.promise(handleSubmit(e), { loading: 'Adding Address...' })} className="fixed inset-0 z-50 bg-white/60 backdrop-blur h-screen flex items-center justify-center">
            <div className="flex flex-col gap-4 text-slate-700 w-full max-w-md mx-6 bg-white p-8 rounded-xl border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl mb-2">Delivery <span className="font-semibold">Address</span></h2>

                <input name="name" onChange={handleAddressChange} value={address.name} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm" type="text" placeholder="Full Name (Required)" required />
                <input name="phone" onChange={handleAddressChange} value={address.phone} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm" type="text" placeholder="Contact number (Required)" required />

                <input name="street" onChange={handleAddressChange} value={address.street} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm" type="text" placeholder="Address (Required)" required />

                <input name="landmark" onChange={handleAddressChange} value={address.landmark} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm" type="text" placeholder="Famous Place / Landmark (Required for easy delivery)" required />

                <div className="flex gap-4">
                    <input name="city" onChange={handleAddressChange} value={address.city} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm" type="text" placeholder="City (Required)" required />
                    <input name="emergencyContact" onChange={handleAddressChange} value={address.emergencyContact} className="p-2.5 px-4 outline-none border border-slate-200 rounded-lg w-full text-sm" type="text" placeholder="Emergency Contact (Optional)" />
                </div>

                <button className="bg-slate-800 text-white font-medium py-3 mt-2 rounded-lg hover:bg-slate-900 active:scale-95 transition-all">SAVE ADDRESS</button>
            </div>
            <XIcon size={30} className="absolute top-5 right-5 text-slate-500 hover:text-slate-700 cursor-pointer" onClick={() => setShowAddressModal(false)} />
        </form>
    )
}

export default AddressModal