import {
  FaCalendarPlus,
  FaGoogle,
  FaLink,
  FaRegEye,
  FaRegEyeSlash, 
} from "react-icons/fa6";
import {
  Form,
  unstable_PasswordToggleField as PasswordToggleField,
  Dialog,
} from "radix-ui";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToastProvider } from "../providers/ToastProvider.jsx";
import { DialogComponent, useDialogProvider } from "../providers/DialogProvider.jsx";
import FormEmailField from "../components/FormEmailField.jsx";
import FormPasswordField from "../components/FormPasswordField.jsx";
import Logo from "../components/Logo.jsx";
import { useUserProvider } from "../providers/UserProvider.jsx";

function Signin() {
    // toast provider - to show toast notifications
    const { showToast } = useToastProvider();
    
    // dialog provider - to show dialog modals
    const { showDialog } = useDialogProvider();

    // user provider - to get and set authenticated user data
    const { setUser } = useUserProvider()

    const navigateTo = useNavigate()

    const [ isSigningIn, setIsSigningIn ] = useState(false);

    const [ isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen ] = useState(false)
    const [ forgotPasswordEmail, setForgotPasswordEmail ] = useState("")
    const [ forgotPasswordLoading, setForgotPasswordLoading ] = useState(false)
 
    // form state
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000'

    async function handleSubmit(event) {
        // prevent default form submission behavior
        event.preventDefault();

        // set signing in state to true
        setIsSigningIn(true);

        try {
            const signInResp = await fetch(`${ backendURL }/auth/login-user`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email, password
                })
            })
            const signInData = await signInResp.json()


            if ( signInResp.ok ) {
                if ( signInData.status === "success" ) {

                    // save authenticated user data to userProvider
                    setUser( signInData.data )

                    // navigate to dashboard
                    navigateTo("/dashboard")
                }
            } else {
                // show HTTP error toast
                showToast(`Error signing in: ${ signInData.error.message }`, "error")
            }
        } catch( err ) {
            // show non-HTTP error toast
            showToast(`Error signing in: ${ err.message }`, "error")
        } finally {
            // reset signing loading state
            setIsSigningIn(false);
        }
    }

    async function handleForgotPasswordSubmit(event) {
        // prevent default form submission behaviour
        event.preventDefault()

        // show loading state in forgot password dialog
        setForgotPasswordLoading(true)

        // encode redirect URL to be used in the password reset link
        const redirectURL = encodeURIComponent(`${window.location.origin}/auth/reset-password/`)

        try {
            // send the password reset link request to the server
            const resp = await fetch(
                `${ backendURL }/auth/forgot-password?emailredirect=${redirectURL}`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: forgotPasswordEmail
                    })
                }
            )

            // handle the response if the request was successful,
            // else, show an error toast
            if ( resp.ok ) {
                // get the response json
                const json = await resp.json()

                // show success toast if the password reset link was sent successfully
                if ( json.status === "success" ) {
                    showToast("Password reset link has been sent, if an account with that email exists.", "success")

                    // close the forgot password dialog
                    setIsForgotPasswordDialogOpen(false)

                    // reset the forgot password email field
                    setForgotPasswordEmail("")
                }
            } else {
                // show HTTP error toast
                showToast(`Error sending password reset link: ${ resp.status } ${ resp.statusText }`, "error")

                // close the forgot password dialog
                setIsForgotPasswordDialogOpen(false)
            }
        } catch (err) {
            // show non-HTTP error toast
            showToast(`Error sending password reset link: ${err.message}`, "error")

            // close the forgot password dialog
            setIsForgotPasswordDialogOpen(false)
        } finally {
            // hide loading state in forgot password dialog
            setForgotPasswordLoading(false)
        }
    }

    async function handleGoogleSignup() {
        // encode frontend redirect URL after google auth
        const googleAuthRedirect = encodeURI(`${ window.location.origin }/auth/google/`)

        // get google details by redirecting to backend URL
        window.open(`${ backendURL }/auth/google?redirect=${ googleAuthRedirect }`, "_self")
    }

    async function handleMagicLinkSignup() {
        // magic link signup logic
        if ( !email ) {
            return showToast("Please enter a valid email to use magiclink signup", "error")
        }

        // encode email confirmation redirect URL for query param
        const emailRedirectURL = encodeURIComponent(`${ window.location.origin }/magiclink/`)

        // send magic link signup request
        try {
            const magicLinkResp = await fetch(`${ backendURL }/auth/magiclink?emailredirect=${emailRedirectURL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            const respJson = await magicLinkResp.json()

            if ( magicLinkResp.ok ) {
                showToast("Magic link sent! Please check your email", "success")
            } else {
                showToast(`Error sending magic link: ${ respJson.error.message }`, "error")
            }
        } catch( err ) {
            showToast(`Error sending magic link: ${ err.message }`, "error")
        }
    }


  return (
    <div className="background h-screen w-full bg-black text-white overflow-auto">
      <div className="signin max-w-lg min-w-[250px] px-6 py-12 md:pt-20 mx-auto">
        <Logo/>

        <h1 className="signin--heading text-3xl font-semibold mb-3 text-center capitalize">
          sign into your account
        </h1>

        <p className="signin--subtext w-full sm:w-2/3 text-center mx-auto mb-8 text-sm text-gray-300">
          Please enter your email and password to sign in or you can sign in
          with google or magiclink. If you don't have an account?
          <Link to="/signup" className="text-amber-500">
            Sign up
          </Link>
        </p>

        <Form.Root className="signin--form" onSubmit={handleSubmit}>
          {/* email */}
          <FormEmailField value={email} handleChange={(e) => setEmail(e.target.value)} />

          {/* password */}
          <FormPasswordField value={password} handleChange={(e) => setPassword(e.target.value)} />

          <a
            href="javascript:void(0)"
            className="signin--form__forgot-password-link 
                    block mb-6 text-amber-500 hover:underline text-right"
            onClick={() => setIsForgotPasswordDialogOpen(true)}
          >
            Forgot Password?
          </a>

          {/* form submit button */}
          <Form.Submit asChild>
            <button
              className="signin--form__submit-btn py-2 px-5 bg-amber-500 w-full
                        rounded-md font-semibold text-black hover:bg-amber-600 transition
                        flex items-center justify-center gap-2
                    "
              type="submit"
              disabled={isSigningIn}
            >
              {isSigningIn ? <>Signing In...</> : <>Sign In</>}
            </button>
          </Form.Submit>

          {/* sign in with google button */}
          <button
            className="signin--form__google-btn bg-gray-800 hover:bg-gray-700 w-full
                    mt-4 py-2 px-5 rounded-md font-semibold flex items-center justify-center
                    transition
                "
            type="button"
            onClick={handleGoogleSignup}
          >
            <FaGoogle className="text-white text-xl mr-2" />
            Sign in with Google
          </button>

          {/* sign in with magic link button */}
          <button
            className="signin--form__magic-btn bg-gray-800 hover:bg-gray-700 w-full
                    mt-4 py-2 px-5 rounded-md font-semibold flex items-center justify-center
                    transition
                "
            type="button"
            onClick={handleMagicLinkSignup}
          >
            <FaLink className="text-white text-xl mr-2" />
            Sign in with Magic Link
          </button>
        </Form.Root>

        
      </div>

      <DialogComponent
        title={"Forgot Password?"}
        description={"Enter your email to receive a password reset" 
            + "link if an account with that email exists."}
        open={isForgotPasswordDialogOpen}
        handleOpenChange={setIsForgotPasswordDialogOpen}
        content={
            <Form.Root className="signin--forgot-password__form mt-4"
                onSubmit={handleForgotPasswordSubmit}
            >
                <FormEmailField 
                    value={forgotPasswordEmail}
                    handleChange={(e) => setForgotPasswordEmail(e.target.value)}
                />

                <div className="signin--forgot-password__form__actions 
                    flex gap-2 mt-4">
                    {/* cancel button */}
                    <button
                        className="signin--forgot-password__form__cancel-btn py-2 px-5 bg-gray-500 w-full
                            rounded-md font-semibold text-white hover:bg-gray-600 transition
                            flex items-center justify-center gap-2 flex-grow
                        "
                        type="button"
                        onClick={() => setIsForgotPasswordDialogOpen(false)}
                    >
                        Cancel
                    </button>

                    <Form.Submit
                        className="signin--forgot-password__form__submit-btn py-2 px-5 bg-amber-500 w-full
                            rounded-md font-semibold text-black hover:bg-amber-600 transition
                            flex items-center justify-center gap-2 flex-grow text-white
                        "
                        disabled={forgotPasswordLoading}
                    >
                        {forgotPasswordLoading ? <>Sending...</> : <>Send Reset Link</>}
                    </Form.Submit>
                </div>
            </Form.Root>
        }
      />
    </div>
  );
}

export default Signin;
