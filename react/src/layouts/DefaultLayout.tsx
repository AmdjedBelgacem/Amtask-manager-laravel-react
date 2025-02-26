import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import Sidebar from "../components/navs/SideBar";
import axiosClient from "../lib/axios-client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ToastContainer } from "../components/ui/Toast";

export default function DefaultLayout() {
    const { token, setUser } = useStateContext();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        axiosClient.get("/user").then((res) => {
            console.log(res);
            //@ts-expect-error expected
            setUser(res);
        });
    }, []);

    if (!token) {
        return <Navigate to="/login" />;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <ToastContainer />
            <div className="flex w-full h-screen bg-gray-50">
                <div className="md:hidden fixed top-4 left-4 z-50">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 bg-white rounded-lg shadow-md"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
                <main className="flex-grow p-4 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </DndProvider>
    );
}