import { createHashRouter } from 'react-router-dom'
import Home from './routes/Home'
import Signup from './routes/Signup'
import Signin from './routes/Signin'
import Dashboard from './routes/Dashboard'
import VerifyEmail from './routes/verifyEmail'
import AuthGoogle from './routes/AuthGoogle'
import Magiclink from './routes/Magiclink'
import ResetPassword from './routes/ResetPassword'
import ProtectedRoute from './components/ProtectedRoute'
import TourComponent from './components/TourComponent'

export const routes = createHashRouter([
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/signup',
        element: <Signup/>
    },
    {
        path: '/signin',
        element: <Signin/>
    },
    {
        path: '/dashboard',
        element: <ProtectedRoute>
                    <TourComponent>
                        <Dashboard/>
                    </TourComponent>
                </ProtectedRoute>
    },
    {
        path: '/verify-email/:token',
        element: <VerifyEmail/>
    },
    {
        path: '/auth/google',
        element: <AuthGoogle/>
    },
    {
        path: '/magiclink/:token',
        element: <Magiclink/>
    },
    {
        path: '/reset-password/:token',
        element: <ResetPassword/>
    },
])