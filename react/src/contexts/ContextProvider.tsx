import { createContext, ReactNode, useContext, useState } from "react";
import { StateContextType } from "../lib/interfaces";

const StateContext = createContext<StateContextType>({
    currentUser: null,
    token: null,
    notification: "",
    setUser: () => {},
    setToken: () => {},
    setNotification: () => {},
});

export const ContextProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setUser] = useState<{
        id: number;
        name: string;
        is_premium: boolean;
    } | null>(null);
    const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
    const [notification, _setNotification] = useState("");

    const setToken = (token: string | null) => {
        _setToken(token);
        if (token) {
            localStorage.setItem("ACCESS_TOKEN", token);
        } else {
            localStorage.removeItem("ACCESS_TOKEN");
        }
    };

    const setNotification = (message: string) => {
        _setNotification(message);

        setTimeout(() => {
            _setNotification("");
        }, 5000);
    };

    return (
        <StateContext.Provider
            value={{
                currentUser,
                setUser,
                token,
                setToken,
                notification,
                setNotification,
            }}
        >
            {children}
        </StateContext.Provider>
    );
};

export const useStateContext = () => useContext(StateContext);
