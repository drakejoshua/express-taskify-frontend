import React from 'react'
import { Dialog } from 'radix-ui';
import { useContext } from 'react';
import { FaXmark } from 'react-icons/fa6';

const DialogContext = React.createContext();

export function useDialogProvider() {
    return useContext(DialogContext);
}

export default function DialogProvider({ children }) {
    const [dialogs, setDialogs] = React.useState([]); // This will hold the list of dialogs

    // dialog structure
    // { id, title, content, description }

    function showDialog(title, description, content) {
        const id = Date.now();
        const newDialog = { id, title, content, description };

        // Logic to add the new dialog to the list
        setDialogs(prevDialogs => [...prevDialogs, newDialog]);

        return id; // Return the id to allow closing the dialog in other components
    }

    function hideDialog(id) {
        setDialogs(prevDialogs => prevDialogs.filter(dialog => dialog.id !== id));
    }

    return (
        <DialogContext.Provider value={{ showDialog, hideDialog }}>
            { children }

            {
                dialogs.map( function( dialog ) { 
                    return (     
                        <Dialog.Root key={dialog.id} defaultOpen={true} onOpenChange={ (open) => {
                            if (!open) hideDialog(dialog.id);
                        }}>
                            <Dialog.Portal>
                                <Dialog.Overlay className="dialog--overlay fixed inset-0 bg-black/90"/>
                                <Dialog.Content className="dialog--content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    bg-gray-800 rounded-md py-10 px-12 w-11/12 max-w-md
                                ">
                                    <Dialog.Close className="dialog--close absolute top-4 right-4 text-white text-xl
                                        hover:text-amber-500 transition
                                    ">
                                        <FaXmark/>
                                    </Dialog.Close>

                                    <Dialog.Title className="dialog--title text-2xl font-medium mb-2 text-white text-center">
                                        {dialog.title}
                                    </Dialog.Title>

                                    <Dialog.Description className="dialog--description text-base font-normal mb-4 text-white text-center">
                                        {dialog.description}
                                    </Dialog.Description>

                                    {dialog.content}
                                </Dialog.Content>
                            </Dialog.Portal>
                        </Dialog.Root>
                    )
                })
            }
        </DialogContext.Provider>
    )
}

export function DialogComponent({ title, description, content, open, handleOpenChange }) {
    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="dialog--overlay fixed inset-0 bg-black/90"/>
                <Dialog.Content className="dialog--content fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    bg-gray-800 rounded-md py-10 px-12 w-11/12 max-w-md
                ">
                    <Dialog.Close className="dialog--close absolute top-4 right-4 text-white text-xl
                        hover:text-amber-500 transition
                    ">
                        <FaXmark/>
                    </Dialog.Close>

                    <Dialog.Title className="dialog--title text-2xl font-medium mb-2 text-white text-center">
                        {title}
                    </Dialog.Title>

                    <Dialog.Description className="dialog--description text-base font-normal mb-4 text-white text-center">
                        {description}
                    </Dialog.Description>

                    {content}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
