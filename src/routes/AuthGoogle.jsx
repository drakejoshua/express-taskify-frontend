import { useEffect, useRef } from 'react'
import { FaSpinner } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { useToastProvider } from '../providers/ToastProvider'
import { useUserProvider } from '../providers/UserProvider'

function AuthGoogle() {
    const navigateTo = useNavigate()

    const { showToast } = useToastProvider()

    let renderCount = useRef(0)

    const { setUser } = useUserProvider()

    async function retrieveAndSaveAuthUser() {
        // get search params from the window's URL
        const searchParams = new URLSearchParams( window.location.search )

        // get the access and refresh tokens from the search params
        const accessToken = searchParams.get('a')

        const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000'

        try {
            // get the information of the newly authenticated user
            const authUserResp = await fetch(`${ backendURL }/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            if ( authUserResp.ok ) {
                // convert response to json
                const authUser = await authUserResp.json()

                // save the authenticated user data to userProvider
                setUser( authUser.data )

                // navigate to dashboard
                navigateTo("/dashboard")
            } else {
                // show HTTP error toast
                showToast("Error retrieving authenticated user data", "error")

                // navigate to signin page
                navigateTo("/signin")
            }
        } catch( err ) {
            // show non-HTTP error toast
            showToast(`Error signing up with google: ${ err.message }`, "error")

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
                        Authenticating via Google <br />
                        Redirecting you to dashboard...
                    </span>
                </div>
            </div>
        </div>
    )
}

export default AuthGoogle
