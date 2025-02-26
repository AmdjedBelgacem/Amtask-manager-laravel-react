import { useRef, useState } from "react";
import { AxiosResponse } from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import video1 from "../assets/video1.mp4";
import axiosClient from "../lib/axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import toast from "react-hot-toast";

export default function Register() {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const { setUser, setToken } = useStateContext();
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            name: nameRef.current?.value,
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
            password_confirmation: confirmPasswordRef.current?.value,
        };

        axiosClient
            .post("/signup", payload)
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
                    toast.success("Account created successfully!");
                }
            )
            .catch((err) => {
                console.log(err);
                const response = err.response.data;
                if (response) {
                    console.error(response.errors);
                    setErrors(response.errors);
                    toast.error("Failed to create account. Please check your inputs.");
                }
            });
    };

    return (
        <div className="h-screen relative overflow-hidden">
            <video
                autoPlay
                loop
                muted
                src={video1}
                className="absolute inset-0 w-full h-full object-cover z-0"
            ></video>

            <div className="absolute inset-0 bg-black/60 z-10"></div>

            <AnimatePresence mode="wait">
                <motion.div
                    className="flex flex-col items-center justify-center h-full relative z-20"
                    initial={{ opacity: 0, x: 1000 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -1000 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-4xl font-bold text-white mb-2">
                        Join Us Today
                    </h1>
                    <p className="text-gray-200 mb-8">
                        Create your account to get started
                    </p>
                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-6 w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
                    >
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="name" className="sr-only">
                                    Name
                                </label>
                                <input
                                    ref={nameRef}
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="name"
                                />
                            </div>
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
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Password"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="sr-only"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    ref={confirmPasswordRef}
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Confirm Password"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                            >
                                Register
                            </button>
                        </div>
                        <div className="text-sm text-center">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                        {Object.keys(errors).length > 0 && (
                            <motion.div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ul className="mt-2 list-disc list-inside">
                                    {Object.entries(errors).map(
                                        ([field, messages]) =>
                                            (messages as string[]).map(
                                                (message, index) => (
                                                    <li
                                                        key={`${field}-${index}`}
                                                    >
                                                        <strong>
                                                            {field}:
                                                        </strong>{" "}
                                                        {message}
                                                    </li>
                                                )
                                            )
                                    )}
                                </ul>
                            </motion.div>
                        )}
                    </form>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}