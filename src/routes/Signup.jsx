    import {
        FaCalendarPlus,
        FaGoogle,
        FaLink,
        FaRegEye,
        FaRegEyeSlash,
    } from "react-icons/fa6";
    import {
        Form 
    } from "radix-ui";
    import { Link } from "react-router-dom";
    import { useState } from "react";
    import { useToastProvider } from "../providers/ToastProvider.jsx";
    import { useDialogProvider } from "../providers/DialogProvider.jsx";
    import FormEmailField from "../components/FormEmailField.jsx";
    import FormPasswordField from "../components/FormPasswordField.jsx";
    import Logo from "../components/Logo.jsx";

    // Multi-step indicator component with connecting lines
    function StepIndicator({ step, steps }) {
        return (
            <div className="flex justify-center mb-8 gap-0">
                {steps.map((label, idx) => {
                    const active = step === idx + 1;
                    const completed = step > idx + 1;
                    const isLast = idx === steps.length - 1;
                    return (
                        <div key={label} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2
                                        ${active ? "border-amber-500 bg-amber-500 text-black" : completed ? "border-green-500 bg-green-500 text-white" : "border-gray-600 bg-gray-800 text-gray-400"}
                                        font-semibold transition`}
                                >
                                    {idx + 1}
                                </div>
                                <span className={`mt-1 text-xs ${active || completed ? "text-white" : "text-gray-400"}`}>
                                    {label}
                                </span>
                            </div>
                            {!isLast && (
                                <div className="flex-1 flex items-center">
                                    <div
                                        className={`h-1 w-10 mx-2 rounded transition-all
                                            ${step > idx + 1
                                                ? "bg-green-500"
                                                : step === idx + 1
                                                ? "bg-amber-500"
                                                : "bg-gray-600"
                                            }`}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    function Signup() {
        const { showToast } = useToastProvider();
        const { showDialog, hideDialog } = useDialogProvider();

        const [step, setStep] = useState(1);
        const [isSigningUp, setIsSigningUp] = useState(false)
        const [form, setForm] = useState({
            username: "",
            email: "",
            photo: null,
            password: "",
        });

        const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000'

        function handleChange(e) {
            const { name, value, files } = e.target;
            setForm((prev) => ({
                ...prev,
                [name]: files ? files[0] : value,
            }));
        }

        function handleNext(e) {
            e.preventDefault();
            setStep((s) => s + 1);
        }

        function handleBack(e) {
            e.preventDefault();
            setStep((s) => s - 1);
        }

        async function handleSubmit(e) {
            // Prevent default form submission behavior
            e.preventDefault();

            // show Signup Loading state on the UI
            setIsSigningUp(true);

            // create signup form data in order to allow direct photo upload
            const signupFormData = new FormData()

            // get frontend URL from env variables
            const frontendURL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'

            // encode email confirmation redirect URL for query param
            const emailRedirectURL = encodeURIComponent(`${frontendURL}/verify-email/`)

            // append all signup form fields to form data
            signupFormData.append('name', form.username);
            signupFormData.append('email', form.email);
            signupFormData.append('photo', form.photo);
            signupFormData.append('password', form.password);

            try {
                // make signup Auth call
                const signupResp = await fetch(`${ backendURL }/auth/register-user?emailredirect=${emailRedirectURL}`, {
                    method: 'POST',
                    body: signupFormData
                })

                // check if signup response is okay and handle accordingly
                if ( signupResp.ok ) {
                    // if ok, parse response json
                    const respJson = await signupResp.json()

                    // if response status is error, show error toast
                    // else show success toast
                    if ( respJson.status == 'error' ) {
                        showToast(`Error signing you up: ${ respJson.error.message }`, 'error')
                    } else {
                        const dialogId = showDialog(
                            "Signup Successful", 
                            "Please check your email for confirmation", 
                            <>
                                <button className="mt-6 w-full py-2 px-5 bg-amber-500 rounded-md font-semibold text-black hover:bg-amber-600 transition"
                                    onClick={ () => { 
                                        hideDialog( dialogId )
                                        window.open( 'https://mail.google.com', '_blank' )
                                    } }
                                >
                                    Open Email App
                                </button>
                            </>
                        )
                    }
                } else {
                    // if not ok, show error toast with status code and text
                    showToast(`Error signing you up: ${ signupResp.status } ${ signupResp.statusText }`, 'error')
                }
            } catch ( err ) {
                // since signup fetch failed, show error toast with error message
                showToast(`Error signing you up: ${ err.message }`, 'error')
            } finally {
                // in any case, remove signing up state from UI
                setIsSigningUp(false)
            }
        }

        async function handleGoogleSignup() {
            // get fronend URL from env variables
            const frontendURL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'

            // encode frontend redirect URL after google auth
            const googleAuthRedirect = encodeURI(`${ frontendURL }/#/auth/google`)

            // get google details by redirecting to backend URL
            window.open(`${ backendURL }/auth/google?redirect=${ googleAuthRedirect }`, "_self")
        }

        async function handleMagicLinkSignup() {
            // magic link signup logic
            if ( !form.email ) {
                return showToast("Please enter a valid email to use magiclink signup", "error")
            }

            // get frontend URL from env variables
            const frontendURL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173'

            // encode email confirmation redirect URL for query param
            const emailRedirectURL = encodeURIComponent(`${ frontendURL }/#/magiclink/`)

            // send magic link signup request
            try {
                const magicLinkResp = await fetch(`${ backendURL }/auth/magiclink?emailredirect=${emailRedirectURL}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: form.email })
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

        const steps = ["Name", "Email", "Photo", "Password"];

        return (
            <div className="background h-screen w-full bg-black text-white overflow-auto">
                <div className="signup max-w-lg min-w-[250px] px-6 py-12 md:pt-20 mx-auto">
                    <Logo/>

                    <h1 className="signup--heading text-3xl font-semibold mb-3 text-center capitalize">
                        Create your account
                    </h1>

                    <p className="signup--subtext w-full sm:w-2/3 text-center mx-auto mb-8 text-sm text-gray-300">
                        Please fill in the details to sign up. Already have an account?
                        <Link to="/signin" className="text-amber-500">
                            Sign in
                        </Link>
                    </p>

                    {/* Step Indicator */}
                    <StepIndicator step={step} steps={steps} />

                    <Form.Root className="signup--form" onSubmit={step === 4 ? handleSubmit : handleNext}>
                        {step === 1 && (
                            <div className="mb-6">
                                <Form.Field name="username">
                                    <Form.Label className="block mb-2 font-medium">Username:</Form.Label>
                                    <Form.Control asChild>
                                        <input
                                            className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                                            type="text"
                                            name="username"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            autoFocus
                                        />
                                    </Form.Control>

                                    <Form.Message className="text-amber-500 mt-2 inline-block" match="valueMissing">
                                        Please enter your username.
                                    </Form.Message>
                                </Form.Field>
                                <button
                                    className="mt-6 w-full py-2 px-5 bg-amber-500 rounded-md font-semibold text-black hover:bg-amber-600 transition"
                                    type="submit"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="mb-6">
                                <FormEmailField
                                    value={form.email}
                                    handleChange={handleChange}
                                    name="email"
                                    required
                                />
                                <div className="flex justify-between mt-6">
                                    <button
                                        className="py-2 px-5 bg-gray-700 rounded-md font-semibold text-white hover:bg-gray-600 transition"
                                        onClick={handleBack}
                                        type="button"
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="py-2 px-5 bg-amber-500 rounded-md font-semibold text-black hover:bg-amber-600 transition"
                                        type="submit"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="mb-6">
                                <Form.Field name="photo">
                                    <Form.Label className="block mb-2 font-medium">Profile Photo</Form.Label>
                                    <Form.Control asChild>
                                        <input
                                            className="w-full px-3 py-2 rounded bg-gray-800 text-white"
                                            type="file"
                                            name="photo"
                                            accept="image/*"
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Control>
                                    {form.photo && (
                                        <div className="mt-4 flex flex-col items-center">
                                            <img
                                                src={URL.createObjectURL(form.photo)}
                                                alt="Profile Preview"
                                                className="w-24 h-24 rounded-full object-cover border-2 border-amber-500"
                                            />
                                            <span className="text-xs text-gray-400 mt-2">{form.photo.name}</span>
                                        </div>
                                    )}
                                </Form.Field>
                                <div className="flex justify-between mt-6">
                                    <button
                                        className="py-2 px-5 bg-gray-700 rounded-md font-semibold text-white hover:bg-gray-600 transition"
                                        onClick={handleBack}
                                        type="button"
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="py-2 px-5 bg-amber-500 rounded-md font-semibold text-black hover:bg-amber-600 transition"
                                        type="submit"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="mb-6">
                                <FormPasswordField
                                    value={form.password}
                                    handleChange={handleChange}
                                    name="password"
                                    required
                                />
                                <div className="flex justify-between mt-6 gap-3">
                                    <button
                                        className="py-2 px-5 bg-gray-700 rounded-md font-semibold text-white hover:bg-gray-600 transition"
                                        onClick={handleBack}
                                        type="button"
                                    >
                                        Back
                                    </button>
                                    <Form.Submit asChild>
                                        <button
                                            className="py-2 px-5 bg-amber-500 w-full rounded-md font-semibold text-black hover:bg-amber-600 transition flex items-center justify-center gap-2"
                                            type="submit"
                                            disabled={isSigningUp}
                                        >
                                            {isSigningUp ? <>Signing Up...</> : <>Sign Up</>}
                                        </button>
                                    </Form.Submit>
                                </div>
                            </div>
                        )}
                    </Form.Root>

                    <div className="mt-6">
                        <button
                            className="signup--form__google-btn bg-gray-800 hover:bg-gray-700 w-full
                                            py-2 px-5 rounded-md font-semibold flex items-center justify-center
                                            transition
                                    "
                            type="button"
                            onClick={handleGoogleSignup}
                        >
                            <FaGoogle className="text-white text-xl mr-2" />
                            Sign up with Google
                        </button>

                        <button
                            className="signup--form__magic-btn bg-gray-800 hover:bg-gray-700 w-full
                                            mt-4 py-2 px-5 rounded-md font-semibold flex items-center justify-center
                                            transition
                                    "
                            type="button"
                            onClick={handleMagicLinkSignup}
                        >
                            <FaLink className="text-white text-xl mr-2" />
                            Sign up with Magic Link
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    export default Signup;
