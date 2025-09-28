import React, { useEffect, useRef } from 'react'
import { FaSpinner } from 'react-icons/fa6'
import { useNavigate, useParams } from 'react-router-dom'
import { useToastProvider } from '../providers/ToastProvider'
import { useUserProvider } from '../providers/UserProvider'

function Magiclink() {
    const navigateTo = useNavigate()

    const { showToast } = useToastProvider()

    const { setUser } = useUserProvider()

    const { token } = useParams()

    let renderCount = useRef(0)

    async function retrieveAndSaveAuthUser() {
        const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000'

        try {
            // verify the magic link token and get the user data
            const magicLinkResp = await fetch(`${ backendURL }/auth/magiclink/${ token }`)
            const respJson = await magicLinkResp.json()

            if ( magicLinkResp.ok ) {
                // save the authenticated user data to userProvider
                setUser( respJson )

                // navigate to dashboard
                navigateTo("/dashboard")
            } else {
                // show HTTP error toast
                showToast(`Error signing in via magic link: ${ respJson.error.message }`, "error")

                // navigate to signin page
                navigateTo("/signin")
            }
        } catch( err ) {
            // show non-HTTP error toast
            showToast(`Error signing in via magic link: ${ err.message }`, "error")

            // navigate to signin page
            navigateTo("/signin")
        }
    }

    useEffect(function() {
        if ( renderCount.current < 1 ) {
            retrieveAndSaveAuthUser()
        }

        return function() {
            renderCount.current += 1
        }
    }, [])

  return (
    <div className="background h-screen w-full bg-black text-white overflow-auto">
        <div className="auth-google max-w-lg min-w-[250px] px-6 py-12 md:pt-20 mx-auto">
            <div className="auth-google--spinner-ctn flex flex-col items-center
                justify-center gap-2">
                <FaSpinner className='auth-google--spinner-ctn__spinner 
                    animate-spin text-amber-500 text-3xl'/>

                <span className="auth-google--spinner-ctn__spinner-text
                    block mt-4 text-white/70 text-center">
                    Authenticating via Magiclink
                </span>
            </div>
        </div>
    </div>
  )
}

export default Magiclink
