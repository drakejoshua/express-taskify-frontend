import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { routes } from "./routes.jsx";
import ToastProvider from "./providers/ToastProvider.jsx";
import DialogProvider from "./providers/DialogProvider.jsx";
import UserProvider from "./providers/UserProvider.jsx";
import TasksProvider from "./providers/TasksProvider.jsx"
import TourComponent from "./components/TourComponent.jsx";



createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserProvider>
            <TasksProvider>
                <ToastProvider>
                    <DialogProvider>
                        <RouterProvider router={routes} basename="./" />
                    </DialogProvider>
                </ToastProvider>
            </TasksProvider>
        </UserProvider>
    </StrictMode>
);
