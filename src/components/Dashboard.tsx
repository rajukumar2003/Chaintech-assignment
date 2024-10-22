import { useEffect, useState } from 'react'
import { toast, Toaster } from 'sonner'
import EditProfileForm from './EditProfileForm'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'

interface DashboardProps {
    userId: string;
}

interface UserData {
    name: string;
    email: string;
    phoneNumber: string;
}

export default function Dashboard({ userId }: DashboardProps) {
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
    const [userData, setUserData] = useState < UserData > ({ name: 'User', email: '', phoneNumber: '' })
    const navigate = useNavigate()

    useEffect(() => {
        // Fetch user data from Firestore
        const fetchUserData = async () => {
            try {
                // Fetch user data from Firestore
                const userDocRef = doc(db, 'users', userId)
                const userDoc = await getDoc(userDocRef)
                if (userDoc.exists()) {
                    setUserData(userDoc.data() as UserData)
                } else {
                    console.log('No such document!')
                    toast.error('User data not found')
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
                toast.error(`Failed to fetch user data ${error}`)
            }
        }

        if (userId) {
            fetchUserData()
        }
    }, [userId]);

    const handleProfileUpdate = (updatedName: string, updatedPhone: string) => {
        setUserData({ ...userData, name: updatedName, phoneNumber: updatedPhone });
        setIsEditProfileOpen(false);
    }
    // Logout user
    const handleLogout = async () => {
        await signOut(auth)
        toast.success('Logged out successfully')
        navigate('/login')
    }

    return (
        <div className="w-full max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Welcome, {userData.name}!</h2>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <div className="mb-4">
                    <p className="text-gray-600">Name:</p>
                    <p className="font-semibold">{userData.name}</p>
                </div>
                <div className="mb-4">
                    <p className="text-gray-600">Email:</p>
                    <p className="font-semibold">{userData.email}</p>
                </div>
                <div className="mb-4">
                    <p className="text-gray-600">Phone:</p>
                    <p className="font-semibold">{userData.phoneNumber}</p>
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Actions</h3>
                <button
                    onClick={() => setIsEditProfileOpen(true)}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Edit Account Information
                </button>

                {/* Pop-up component for editing profile info */}
                {isEditProfileOpen && (
                    <EditProfileForm
                        userId={userId}
                        initialName={userData.name}
                        initialPhoneNumber={userData.phoneNumber}
                        onSave={handleProfileUpdate}
                        onClose={() => setIsEditProfileOpen(false)}
                    />
                )}

                <button
                    onClick={handleLogout}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Log Out
                </button>
            </div>
            <Toaster />
        </div>
    )
}