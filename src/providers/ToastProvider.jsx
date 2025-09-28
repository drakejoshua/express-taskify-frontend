import { Toast } from 'radix-ui'
import { FaXmark, FaTriangleExclamation, FaCheck, FaCircleInfo } from 'react-icons/fa6'
import React, { useState, useContext } from 'react';

const ToastContext = React.createContext();

export function useToastProvider() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]); // This will hold the list of toasts

    // toast structure
    // { id, title, type }

    function showToast(title, type = 'info') {
        const id = Date.now();
        const newToast = { id, title, type };

        // Logic to add the new toast to the list
        setToasts((prevToasts) => [...prevToasts, newToast]);
    }

    function hideToast(id) {
        // Logic to remove the toast from the list
        setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
    }

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}

            <Toast.Provider swipeDirection="right">
                {
                    toasts.map( function( toast ) {
                        return (
                            <Toast.Root className="toast--root flex 
                                items-center gap-2 bg-gray-800 border
                                border-gray-700 rounded-md p-4 mb-2
                            " duration={5000} onOpenChange={ (open) => {
                                if (!open) hideToast(toast.id);
                            }} key={toast.id}>
                                <Toast.Title className='toast--title text-white font-medium flex items-center gap-4'>
                                    {
                                        {
                                            info: <FaCircleInfo className='text-blue-500 text-3xl' />,
                                            success: <FaCheck className='text-green-500 text-3xl' />,
                                            error: <FaTriangleExclamation className='text-amber-500 text-3xl' />
                                        }[toast.type]
                                    }

                                    <span className='toast--title__text'>{toast.title}</span>
                                </Toast.Title>

                                <Toast.Close className='toast--close' onClick={() => hideToast(toast.id)}>
                                    <FaXmark className='text-white text-lg'/>
                                </Toast.Close>
                            </Toast.Root>
                        )
                    })
                }

                <Toast.Viewport className='toast--viewport fixed top-0 right-0 p-4 w-xs' />
            </Toast.Provider>
        </ToastContext.Provider>
    )
}
