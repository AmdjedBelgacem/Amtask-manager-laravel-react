import { createBrowserRouter } from "react-router-dom";
import Login from "./views/Login";
import Signup from "./views/Signup";
import DefaultLayout from "./layouts/DefaultLayout";
import GuestLayout from "./layouts/GuestLayout";
import Dashboard from "./views/Dashboard";
import Payment from "./views/Payment";
import Folders from "./views/Folders";
import FolderTasks from "./views/FolderTasks";
import Premium from "./views/Premium";
import NotFound from "./views/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <DefaultLayout />,
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/folders",
                element: <Folders />,
            },
            {
                path: "/folders/:folderId",
                element: <FolderTasks />,
            },
            {
                path: "/payment",
                element: <Payment />,
            },
            {
                path: "/premium",
                element: <Premium />,
            },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
        ],
    },
    {
        path: "*",
        element: <NotFound/>
    },
]);

export default router;
