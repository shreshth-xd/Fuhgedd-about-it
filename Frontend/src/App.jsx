import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Components/Home";
import MainPage from "./Pages/MainPage";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Vault from "./Pages/VaultUI";

const router  = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/app",
        element: <MainPage/>
    },
    {
        path: "/sign-in",
        element: <SignIn/>
    },
    {
        path: "/sign-up",
        element: <SignUp/>
    },
    {
        path: "/vault",
        element: <Vault/>
    }
]);

const App = () => {
    return(
        <>
        <RouterProvider router={router}/>
        </>
    );
};

export default App;
