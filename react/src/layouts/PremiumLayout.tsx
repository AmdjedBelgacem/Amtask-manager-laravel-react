import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { useEffect } from "react";
import axiosClient from "../lib/axios-client";

export default function PremiumLayout() {
    const { currentUser } = useStateContext();

    useEffect(() => {
        axiosClient.get("/user").then((res) => {
            //@ts-expect-error expected
            setUser(res);
        });
    }, []);

    if (!currentUser?.is_premium) {
        return <Navigate to="/premium-presentation" />;
    }
    return <Outlet />;
}
