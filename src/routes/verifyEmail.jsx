import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useToastProvider } from "../providers/ToastProvider.jsx";
import Logo from "../components/Logo.jsx";
import { useUserProvider } from "../providers/UserProvider.jsx";

function VerifyEmail() {
    const { showToast } = useToastProvider();
    const [isVerifying, setIsVerifying] = useState(true);
    const [status, setStatus] = useState(null);

    const { setUser } = useUserProvider();

    const params = useParams();
    const token = params.token;

    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:7000';

    let renderCount = useRef(0)

    async function verifyEmail() {
        setIsVerifying(true);

        if (!token) {
            showToast("Invalid email confirmation link.", "error");
            setStatus("error");
            setIsVerifying(false);
            return;
        }

        try {
            const resp = await fetch(
                `${ backendURL }/auth/verify/${token}`,
                { method: "GET" }
            );

            if (resp.ok) {
                const json = await resp.json();

                if (json.status === "success") {
                    setStatus("success");
                    showToast("Email confirmed successfully! You can now sign in.", "success");

                    setUser(json.data)
                } else {
                    setStatus("error");
                    showToast(`Email confirmation failed: ${json.error?.message}`, "error");
                }
            } else {
                setStatus("error");
                showToast(`Email confirmation failed: ${ resp.status } ${resp.statusText}`, "error");
                console.log(resp);
            }
        } catch (err) {
            setStatus("error");
            showToast(`Email confirmation error: ${err.message}`, "error");
        } finally {
            setIsVerifying(false);
        }
    }


    useEffect(() => {
        if ( renderCount.current < 1 ) {
            verifyEmail();
        }

        return function() {
            renderCount.current += 1
        }
    }, []);

    return (
        <div className="background h-screen w-full bg-black text-white overflow-auto">
            <div className="max-w-lg min-w-[250px] px-6 py-12 md:pt-20 mx-auto text-center">
                <Logo />

                <h1 className="text-3xl font-semibold mb-3">Confirming your email</h1>

                {isVerifying && (
                    <p className="text-gray-300">Please wait while we verify your email...</p>
                )}

                {!isVerifying && status === "success" && (
                    <div className="mt-6">
                        <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
                        <p className="text-lg text-green-400 font-medium">
                            Your email has been confirmed!
                        </p>
                        <Link
                            to="/dashboard"
                            className="mt-6 inline-block py-2 px-5 bg-amber-500 rounded-md font-semibold text-black hover:bg-amber-600 transition"
                        >
                            Go to dashboard
                        </Link>
                    </div>
                )}

                {!isVerifying && status === "error" && (
                    <div className="mt-6">
                        <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
                        <p className="text-lg text-red-400 font-medium">
                            Email confirmation failed. Try signing up again
                        </p>
                        <Link
                            to="/signup"
                            className="mt-6 inline-block py-2 px-5 bg-gray-700 rounded-md font-semibold text-white hover:bg-gray-600 transition"
                        >
                            Back to Signup
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;
