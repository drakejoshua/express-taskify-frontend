import React from 'react'
import { useEffect } from 'react'
import { useUserProvider } from '../providers/UserProvider.jsx'
import { useNavigate } from 'react-router-dom'
import { FaSpinner } from 'react-icons/fa6'


function ProtectedRoute({ children }) {
    const { user } = useUserProvider()

    const navigateTo = useNavigate()

    useEffect(() => {
        if ( ( user === "logout" || user === "unavailable" ) && user !== "loading" ) {
            // Redirect to login page
            navigateTo('/signin')
        }
    }, [user] )

  return (
    <>
      {user === "loading" ? (
        <div className="background h-screen w-full bg-black text-white overflow-auto">
            <div className="max-w-lg min-w-[250px] px-6 py-12 md:pt-20 mx-auto">
                <FaSpinner className="animate-spin mx-auto mb-4 text-4xl text-white" />
                <h1 className="text-xl font-bold mb-6 text-center">Loading...</h1>
                <p className="text-center">Please wait while we verify your session.</p>
            </div>
        </div>
      ) : (
        children
      )}
    </>
  )
}

export default ProtectedRoute
