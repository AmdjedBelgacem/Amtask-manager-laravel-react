import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { AnimatePresence } from "framer-motion";
import { ToastContainer } from "../components/ui/Toast";

export default function GuestLayout() {
    const { token } = useStateContext();

    if (token) {
        return <Navigate to="/" />;
    }

    return (
        <AnimatePresence mode="wait" initial={false}>
            <ToastContainer />
            <Outlet />
        </AnimatePresence>
    );
}
