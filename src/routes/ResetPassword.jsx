import { useState } from 'react'
import Logo from '../components/Logo.jsx'
import FormPasswordField from '../components/FormPasswordField.jsx'
import { Form } from 'radix-ui'
import { useNavigate, useParams } from 'react-router-dom';
import { useUserProvider } from '../providers/UserProvider.jsx';
import { useToastProvider } from "../providers/ToastProvider.jsx"

function ResetPassword() {
    const [ newPassword, setNewPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');

    const { setUser } = useUserProvider()

    const { token } = useParams()

    const { showToast } = useToastProvider()

    const navigateTo = useNavigate()

    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000'

    async function handleSubmit(event) {
        // prevent default form submission behaviour
        event.preventDefault();

        try {
            // Handle password reset logic here
            const resetPasswordResp = await fetch(`${ backendURL }/auth/forgot-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password: confirmPassword })
            })

            // get response json
            const respJson = await resetPasswordResp.json()

            if ( resetPasswordResp.ok ) {
                if ( respJson.status == 'success' ) {
                    // set authenticated user in context
                    setUser( respJson.data )

                    // navigate to dashboard upon successful password reset
                    navigateTo("/dashboard")
                }
            } else {
                // show HTTP error toast
                showToast(`Error resetting your password: ${ respJson.error.message }`, 'error' )
            }
        } catch ( error ) {
            // show network error toast
            showToast(`Error resetting your password: ${ error.message }`, 'error')
        }
    }

  return (
    <div className="background h-screen w-full bg-black text-white overflow-auto">
        <div className="max-w-lg min-w-[250px] px-6 py-12 md:pt-20 mx-auto">
            <Logo/>

            <h1 className="text-3xl font-medium mb-2 text-center">Reset your Password</h1>

            <p className='mb-6 text-center'>
                Please enter and confirm your new password below.
            </p>

            <Form.Root onSubmit={handleSubmit}>
                {/* new password */}
                <FormPasswordField
                    value={newPassword}
                    handleChange={(e) => setNewPassword(e.target.value)}
                />

                {/* confirm password */}
                <Form.Field>
                    <Form.Label className="text-left mb-2 block font-medium">
                        Confirm New Password
                    </Form.Label>
                    <Form.Control asChild>
                        <input 
                            type="password" 
                            placeholder="Confirm New Password" 
                            className="w-full px-4 py-2 rounded-md border-2 border-white outline-none
                                hover:border-amber-500 focus-within:border-amber-500 text-white"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Control>

                    <Form.Message className="text-amber-500 mt-2 inline-block" match="valueMissing">
                        Please confirm your new password.
                    </Form.Message>

                    <Form.Message className="text-amber-500 mt-2 inline-block" 
                        match={ function( value, formData ) {
                            return value !== newPassword
                        }}>
                        Passwords do not match.
                    </Form.Message>
                </Form.Field>

                <Form.Submit 
                    className="w-full mt-6 px-4 py-2 bg-amber-600 text-white rounded-md 
                    hover:bg-amber-700 font-medium"
                >
                    Reset Password
                </Form.Submit>
            </Form.Root>
        </div>
    </div>
  )
}

export default ResetPassword
