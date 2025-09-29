import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./Components/Home";
import MainPage from "./Components/MainPage";

const router  = createBrowserRouter([
    {
        path: "/",
        element: <Home/>
    },{
        path: "/app",
        element: <MainPage/>
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
