import { doc, updateDoc } from 'firebase/firestore';
import { useState } from 'react'
import { toast } from 'sonner'
import { db } from '../firebaseConfig';

interface EditProfileFormProps {
    userId: string;
    initialName: string;
    initialPhoneNumber: string;
    onSave: (name: string, phoneNumber: string) => void;
    onClose: () => void;
}

export default function EditProfileForm({ userId, initialName, onSave, initialPhoneNumber, onClose }: EditProfileFormProps) {
    const [name, setName] = useState(initialName)
    const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Name is required
        if (!name.trim()) {
            toast.error('Name is required')
            return
        }
        // Phone number must be 10 digits
        const phoneRegex = /^\d{10}$/
        if (!phoneRegex.test(phoneNumber)) {
            toast.error('Phone number must be 10 digits')
            return
        }

        try {
            // Reference to the Firestore document
            const userDocRef = doc(db, 'users', userId)

            // Updating the document with the new data
            await updateDoc(userDocRef, {
                name,
                phoneNumber
            })
            // Calling the onSave callback to update the UI
            onSave(name, phoneNumber);

            toast.success('Profile updated successfully 🎉');
            onClose()
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error('Failed to update profile')
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="relative bg-white rounded-lg shadow-xl p-8 m-4 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                            id="phoneNumber"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
