import Dashboard from "../components/Dashboard"
import { useEffect, useState } from 'react'
import { auth } from '../firebaseConfig'

export default function DashboardPage() {
    const [userId, setUserId] = useState(null)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid)
            }
        })
        return () => unsubscribe()
    }, [])

    return userId ? <Dashboard userId={userId} /> :
        <p className="text-center text-2xl font-bold text-gray-800 mt-4">Loading...</p>
}
