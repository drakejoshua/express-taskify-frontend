import { useEffect, useState } from 'react'
import { useContext, createContext } from 'react'

const userContext = createContext()

export function useUserProvider() {
    return useContext( userContext )
}

function UserProvider({ children }) {
    // user state values
    // "loading" - initial state while checking local-storage and refreshing token
    // "logout" - user is logged out/no user data
    // { ... } - user is logged in/user data object
    const [ user, setUser ] = useState("loading")

    async function refreshToken() {
        const storedUser = JSON.parse( localStorage.getItem('taskify-user') )

        try {
            // get backend URL from environment variable
            const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000'

            // fetch new access token using refresh token
            const refreshTokenResp = await fetch(`${ backendURL }/auth/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refreshToken: storedUser.refreshToken })
            })

            // get response json
            const respJson = await refreshTokenResp.json()

            // if refresh token is valid, update user state with new access token
            // if refresh token is invalid/expired, set user state to "logout"
            if ( refreshTokenResp.ok ) {
                // update user state with new access token
                const updatedUserData = { ...storedUser, accessToken: respJson.accessToken }
                setUser( updatedUserData )
            } else {
                setUser( "logout" )
            }
        } catch {
            setUser( "unavailable" )
        }
    }
    
    // check for user data in local-storage on mount
    useEffect( function() {
        // get user data from local-storage
        const storedUser = localStorage.getItem('taskify-user')
        
        // if no user data, set user to "logout"
        if ( !storedUser || storedUser === "logout" ) {
            return setUser( "logout" )
        } 
        
        // if user data is present, set user to the parsed data 
        if ( storedUser ) {
            refreshToken()
        }
    }, [] )

    // save user data to local-storage whenever it changes
    useEffect(function() {
        if ( user !== "loading" && user !== "unavailable" ) {
            // save user data to local-storage whenever it changes
            localStorage.setItem('taskify-user', user !== "logout" ? JSON.stringify(user) : "logout" )

            // if user is "logout", reset tour seen flag
            if ( user === "logout" ) {
                localStorage.removeItem('taskify-has-seen-tour')
            }
        }
    }, [user] )

    return (
        <userContext.Provider value={{ user, setUser, refreshToken }}>
            { children }
        </userContext.Provider>
    )
}

export default UserProvider
