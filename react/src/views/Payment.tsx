import { useState } from "react";
import axiosClient from "../lib/axios-client";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import toast from "react-hot-toast";

const Payment = () => {
    const { currentUser } = useStateContext();
    const navigate = useNavigate();
    if (currentUser?.is_premium) {
        navigate("/premium");
    }
    const [isLoading, setIsLoading] = useState(false);
    const [cardData, setCardData] = useState({
        number: "",
        name: "",
        expiry: "",
        cvc: "",
    });
    const [error, setError] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "number") {
            const formattedValue = value
                .replace(/\s/g, "")
                .replace(/(\d{4})/g, "$1 ")
                .trim();
            setCardData((prev) => ({ ...prev, [name]: formattedValue }));
            return;
        }

        if (name === "expiry") {
            const formattedValue = value
                .replace(/\D/g, "")
                .replace(/(\d{2})/, "$1/")
                .substring(0, 5);
            setCardData((prev) => ({ ...prev, [name]: formattedValue }));
            return;
        }

        if (name === "cvc") {
            const formattedValue = value.replace(/\D/g, "").substring(0, 3);
            setCardData((prev) => ({ ...prev, [name]: formattedValue }));
            return;
        }

        setCardData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!validateCardData(cardData)) {
            setError("Please fill in all fields correctly.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axiosClient.post("/activate-premium");
            console.log("Response from server:", response.data);
            toast.success("Premium feature activated successfully!");
            navigate("/"); 
            window.location.reload(); 
        } catch (error) {
            console.error("Error activating premium:", error);
            toast.error("Failed to activate premium feature. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const validateCardData = (data: {
        number: string;
        name: string;
        expiry: string;
        cvc: string;
    }) => {
        const { number, name, expiry, cvc } = data;

        if (
            number.replace(/\s/g, "").length !== 16 ||
            name.trim() === "" ||
            expiry.replace(/\//g, "").length !== 4 ||
            cvc.length !== 3
        ) {
            return false;
        }

        return true;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 rounded-lg">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            </div>
            <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-200 mb-4">
                    Upgrade to Premium
                </h1>
                <p className="text-gray-400 mb-6">
                    Unlock the ability to create folders and organize your tasks
                    efficiently.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Card Number
                        </label>
                        <input
                            type="text"
                            name="number"
                            placeholder="0000 0000 0000 0000"
                            value={cardData.number}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                            maxLength={19}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Cardholder Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={cardData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Expiration Date
                            </label>
                            <input
                                type="text"
                                name="expiry"
                                placeholder="MM/YY"
                                value={cardData.expiry}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                                maxLength={5}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                CVC
                            </label>
                            <input
                                type="text"
                                name="cvc"
                                placeholder="123"
                                value={cardData.cvc}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                                maxLength={3}
                                required
                            />
                        </div>
                    </div>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                    >
                        {isLoading ? "Processing..." : "Activate Premium"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;