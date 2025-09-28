import { FaCalendarPlus, FaGoogle, FaLink, FaUsers, FaCircleCheck, FaCloudArrowUp } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Logo from "../components/Logo.jsx";
import { motion } from "framer-motion";

// Animation variants
const heroVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } },
};

const buttonVariants = {
    rest: { scale: 1, boxShadow: "0 0 0px #000" },
    hover: { scale: 1.07, boxShadow: "0 4px 24px #fbbf24", transition: { type: "spring", stiffness: 400 } },
    tap: { scale: 0.97 },
};

const iconVariants = {
    initial: { rotate: -20 },
    animate: { rotate: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.2, rotate: 15 },
};

const featureVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const testimonialVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

function Landing() {
    return (
        <div className="background min-h-screen w-full bg-black text-white overflow-auto">
            {/* Hero Section */}
            <section className="hero-section flex items-center justify-center min-h-[80vh]">
                <motion.div
                    className="landing max-w-xl w-full px-6 py-12 md:py-20 mx-auto flex flex-col items-center"
                    initial="hidden"
                    animate="visible"
                    variants={heroVariants}
                >
                    <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1, transition: { duration: 0.8, type: "spring" } }}
                    >
                        <Logo className="mb-6 flex items-center gap-2" />
                    </motion.div>

                    <motion.h1
                        className="landing--heading text-4xl md:text-5xl font-extrabold mb-4 text-center bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.8 } }}
                    >
                        Organize Your Life, Creatively.
                    </motion.h1>

                    <motion.p
                        className="landing--subtext text-lg text-gray-300 text-center mb-10 max-w-md"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.7 } }}
                    >
                        Taskify helps you plan, track, and complete your tasks with style. Experience productivity with delightful micro-interactions and smooth animations.
                    </motion.p>

                    <motion.div
                        className="flex flex-col gap-4 w-full"
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <motion.div variants={buttonVariants}>
                            <Link
                                to="/signup"
                                className="landing--cta-btn bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-3 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                <motion.span variants={iconVariants} initial="initial" animate="animate" whileHover="hover">
                                    <FaCalendarPlus className="text-2xl" />
                                </motion.span>
                                Start Planning
                            </Link>
                        </motion.div>
                        <motion.div variants={buttonVariants}>
                            <Link
                                to="/signin"
                                className="landing--cta-btn bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-3 transition-all shadow focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                <motion.span variants={iconVariants} initial="initial" animate="animate" whileHover="hover">
                                    <FaGoogle className="text-xl" />
                                </motion.span>
                                Sign In
                            </Link>
                        </motion.div>
                        <motion.div variants={buttonVariants}>
                            <Link
                                to="/signup"
                                className="landing--cta-btn bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg text-lg flex items-center justify-center gap-3 transition-all shadow focus:outline-none focus:ring-2 focus:ring-amber-400"
                            >
                                <motion.span variants={iconVariants} initial="initial" animate="animate" whileHover="hover">
                                    <FaLink className="text-xl" />
                                </motion.span>
                                Try Magic Link
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="features-section bg-gray-900 py-20">
                <motion.div
                    className="max-w-4xl mx-auto px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={featureVariants}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
                        Why Taskify?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            className="feature-card bg-gray-800 rounded-xl p-8 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform"
                            whileHover={{ scale: 1.07, boxShadow: "0 4px 24px #fbbf24" }}
                        >
                            <FaCircleCheck className="text-amber-500 text-4xl mb-4" />
                            <h3 className="font-semibold text-xl mb-2">Task Management</h3>
                            <p className="text-gray-300 text-base">Create, edit, and track your tasks with ease. Stay on top of your goals every day.</p>
                        </motion.div>
                        <motion.div
                            className="feature-card bg-gray-800 rounded-xl p-8 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform"
                            whileHover={{ scale: 1.07, boxShadow: "0 4px 24px #fbbf24" }}
                        >
                            <FaUsers className="text-amber-500 text-4xl mb-4" />
                            <h3 className="font-semibold text-xl mb-2">Collaboration</h3>
                            <p className="text-gray-300 text-base">Invite teammates, share tasks, and work together. Productivity is better with friends.</p>
                        </motion.div>
                        <motion.div
                            className="feature-card bg-gray-800 rounded-xl p-8 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform"
                            whileHover={{ scale: 1.07, boxShadow: "0 4px 24px #fbbf24" }}
                        >
                            <FaCloudArrowUp className="text-amber-500 text-4xl mb-4 animate-bounce" />
                            <h3 className="font-semibold text-xl mb-2">Sync Anywhere</h3>
                            <p className="text-gray-300 text-base">Access your tasks from any device. Your progress is always up-to-date and secure.</p>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Social Proof Section */}
            <section className="social-proof-section py-20">
                <motion.div
                    className="max-w-4xl mx-auto px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={testimonialVariants}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 bg-clip-text text-transparent">
                        Trusted by Creative Teams
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <motion.div
                            className="testimonial-card bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform"
                            whileHover={{ scale: 1.05, boxShadow: "0 4px 24px #fbbf24" }}
                        >
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDfVNX_LPCi3yeVPCTdOJT34J5RtyISy9biA&s" alt="User" className="w-16 h-16 rounded-full mb-3 border-2 border-amber-500" />
                            <p className="text-gray-300 text-base mb-2">“Taskify transformed our workflow. The animations make it fun to use!”</p>
                            <span className="text-amber-500 font-semibold">Alex, Product Designer</span>
                        </motion.div>
                        <motion.div
                            className="testimonial-card bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform"
                            whileHover={{ scale: 1.05, boxShadow: "0 4px 24px #fbbf24" }}
                        >
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDfVNX_LPCi3yeVPCTdOJT34J5RtyISy9biA&s" alt="User" className="w-16 h-16 rounded-full mb-3 border-2 border-amber-500" />
                            <p className="text-gray-300 text-base mb-2">“Collaboration is seamless. Our team loves the creative vibe!”</p>
                            <span className="text-amber-500 font-semibold">Maria, Team Lead</span>
                        </motion.div>
                        <motion.div
                            className="testimonial-card bg-gray-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform"
                            whileHover={{ scale: 1.05, boxShadow: "0 4px 24px #fbbf24" }}
                        >
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDfVNX_LPCi3yeVPCTdOJT34J5RtyISy9biA&s" alt="User" className="w-16 h-16 rounded-full mb-3 border-2 border-amber-500" />
                            <p className="text-gray-300 text-base mb-2">“Syncing across devices is flawless. I never miss a deadline!”</p>
                            <span className="text-amber-500 font-semibold">Sam, Freelancer</span>
                        </motion.div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-8 items-center mt-8">
                        {/* Brand icons (replace with real logos if available) */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" className="h-10 w-10 grayscale hover:grayscale-0 transition" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="h-10 w-10 grayscale hover:grayscale-0 transition" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="JS" className="h-10 w-10 grayscale hover:grayscale-0 transition" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="Tailwind" className="h-10 w-10 grayscale hover:grayscale-0 transition" />
                    </div>
                </motion.div>
            </section>
        </div>
    );
}

export default Landing;