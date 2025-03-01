import { useState, useEffect, useRef } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../lib/axios-client";
import img1 from "../../assets/img1.png";
import { useNavigate } from "react-router-dom";

const UserButton = ({ isOpen }: { isOpen: boolean }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const { currentUser, setUser, setToken } = useStateContext();
    const buttonRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        axiosClient.post("/logout").then(() => {
            setUser(null);
            setToken(null);
            navigate("/login");
        });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsTooltipVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [buttonRef]);

    useEffect(() => {
        if (!isOpen) {
            setIsTooltipVisible(false);
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={buttonRef}>
            <button
                className="flex items-center transition-colors duration-200 hover:bg-gray-100 rounded-md w-full p-2 cursor-pointer"
                style={{ textDecoration: "none", overflow: "hidden" }}
                onClick={() => setIsTooltipVisible(!isTooltipVisible)}
            >
                <img
                    src={img1}
                    alt={currentUser?.name}
                    className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                />
                {isOpen && (
                    <div className="ml-2">
                        <span className="block text-xs font-medium text-gray-500">
                            {currentUser?.is_premium ? "Premium" : "Basic"}
                        </span>
                        <span className="font-medium text-gray-700 whitespace-nowrap">
                            {currentUser?.name}
                        </span>
                    </div>
                )}
            </button>

            {isTooltipVisible && (
                <div className="absolute bottom-full mb-1 left-0 bg-white border border-gray-200 shadow-md z-10 w-full p-1 rounded-lg space-y-2">
                    {!currentUser?.is_premium && (
                        <button
                            className="block w-full  py-2 px-4  hover:bg-gray-900 transition-colors duration-200 rounded-lg cursor-pointer text-center bg-black text-white font-semibold"
                            onClick={() => {
                                navigate("/premium-presentation");
                            }}
                        >
                            Become a premium member
                        </button>
                    )}
                    <button
                        className="block w-full text-left py-2 px-4 bg-red-500 hover:bg-red-400 transition-colors duration-200 rounded-lg text-white cursor-pointer"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserButton;
