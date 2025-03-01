import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
export default function Premium() {
    const { currentUser } = useStateContext();
    const navigate = useNavigate();

    if (currentUser?.is_premium) {
        navigate("/premium/folders");
    }   
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 rounded-lg">
            <div className="max-w-4xl mx-auto text-center"></div>
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-200 sm:text-6xl md:text-7xl animate-pulse">
                    Unlock the Full Potential
                </h1>
                <p className="mt-4 text-xl text-indigo-200">
                    Upgrade to{" "}
                    <span className="font-bold text-purple-300">Premium</span>{" "}
                    and enjoy exclusive features designed to enhance your
                    productivity.
                </p>
            </div>
            <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="px-6 py-8 sm:p-10">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-200">
                        Premium vs Basic
                    </h2>
                    <p className="mt-2 text-gray-400">
                        Compare the features and choose the plan that suits you
                        best.
                    </p>
                    <div className="mt-8">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="py-4 text-left text-gray-300 font-semibold">
                                        Feature
                                    </th>
                                    <th className="py-4 text-center text-gray-300 font-semibold">
                                        Basic
                                    </th>
                                    <th className="py-4 text-center text-gray-300 font-semibold">
                                        Premium
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-700 hover:bg-gray-750 transition-all duration-200">
                                    <td className="py-6 text-gray-300">
                                        Create Tasks
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-green-400 text-2xl">
                                            ✅
                                        </span>
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-green-400 text-2xl">
                                            ✅
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-750 transition-all duration-200">
                                    <td className="py-6 text-gray-300">
                                        Organize Tasks (Drag & Drop)
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-green-400 text-2xl">
                                            ✅
                                        </span>
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-green-400 text-2xl">
                                            ✅
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-750 transition-all duration-200">
                                    <td className="py-6 text-gray-300">
                                        Modify Tasks
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-green-400 text-2xl">
                                            ✅
                                        </span>
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-green-400 text-2xl">
                                            ✅
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-750 transition-all duration-200">
                                    <td className="py-6 text-gray-300">
                                        Email Notifications
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-green-400 text-2xl">
                                            ✅
                                        </span>
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-green-400 text-2xl">
                                            ✅
                                        </span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-700 hover:bg-gray-750 transition-all duration-200">
                                    <td className="py-6 text-gray-300">
                                        Use Folders to Store Tasks
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-red-400 text-2xl">
                                            ❌
                                        </span>
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-green-400 text-2xl">
                                            ✅
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-750 transition-all duration-200">
                                    <td className="py-6 text-gray-300">
                                        Mark Tasks as Priority
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-red-400 text-2xl">
                                            ❌
                                        </span>
                                    </td>
                                    <td className="py-6 text-center">
                                        <span className="text-green-400 text-2xl">
                                            ✅
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-10 text-center">
                        <button onClick={()=>{
                            navigate('/payment')
                        }} className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
                            Upgrade to Premium
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            </div>
        </div>
    );
}
