import Dashboard from "../components/Dashboard"
import { useEffect, useState } from 'react'
import { auth } from '../firebaseConfig'

export default function DashboardPage() {
    const [userId, setUserId] = useState < string | null > (null)
    // Get the current user
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid)
            }
        })
        return () => unsubscribe()
    }, [])
    // If user is logged in, show the Dashboard component
    return userId ? <Dashboard userId={userId} /> :
        <p className="text-center text-2xl font-bold text-gray-800 mt-4">Loading...</p>
}