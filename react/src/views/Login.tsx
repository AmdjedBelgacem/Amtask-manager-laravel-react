import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import video2 from "../assets/video2.mp4";
import axiosClient from "../lib/axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";

export default function Login() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const { setUser, setToken } = useStateContext();
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
        };

        axiosClient
            .post("/login", payload)
            .then(
                (
                    res: AxiosResponse<{
                        user: { [key: string]: string };
                        token: string;
                    }>
                ) => {
                    // @ts-expect-error expected
                    setUser(res.user);
                    // @ts-expect-error expected
                    setToken(res.token);
                    toast.success("Logged in successfully!");
                }
            )
            .catch((err) => {
                if (err.response && err.response.status === 422) {
                    const response = err.response.data;
                    if (response.message) {
                        setErrors({ general: [response.message] });
                        toast.error(response.message);
                    }
                } else {
                    setErrors({
                        general: [
                            "An unexpected error occurred. Please try again.",
                        ],
                    });
                    toast.error("An unexpected error occurred. Please try again.");
                }
            });
    };

    return (
        <div className="h-screen relative overflow-hidden">
            <video
                autoPlay
                loop
                muted
                src={video2}
                className="absolute inset-0 w-full h-full object-cover z-0"
            ></video>

            <div className="absolute inset-0 bg-black/60 z-10"></div>

            <AnimatePresence mode="wait">
                <motion.div
                    className="flex flex-col items-center justify-center h-full relative z-20"
                    initial={{ opacity: 0, x: 1000 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -1000 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Welcome To Task Manager
                    </h1>
                    <p className="text-gray-200 mb-8">
                        Below fill your credentials to log in
                    </p>
                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-6 w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
                    >
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label
                                    htmlFor="email-address"
                                    className="sr-only"
                                >
                                    Email address
                                </label>
                                <input
                                    ref={emailRef}
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    ref={passwordRef}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                            >
                                Sign in
                            </button>
                        </div>
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    to="/signup"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                        {errors.general && (
                            <motion.div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                {errors.general.map((message, index) => (
                                    <p key={`general-${index}`}>
                                        <strong>Error:</strong> {message}
                                    </p>
                                ))}
                            </motion.div>
                        )}
                    </form>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}