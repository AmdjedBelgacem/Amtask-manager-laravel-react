import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../lib/axios-client";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { showToast } from "../components/ui/Toast";

const Folders = () => {
    const { currentUser } = useStateContext();
    const [folderName, setFolderName] = useState("");
    const [folders, setFolders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        if (currentUser?.is_premium) {
            fetchFolders();
        }
    }, [currentUser]);

    const fetchFolders = async () => {
        try {
            const response = await axiosClient.get("/folders");
            const foldersWithTaskCount = await Promise.all(
                response.map(async (folder: { id: string; name: string }) => {
                    const tasksResponse = await axiosClient.get(
                        `/folders/${folder.id}/tasks`
                    );
                    return {
                        ...folder,
                        taskCount: tasksResponse.length,
                    };
                })
            );
            setFolders(foldersWithTaskCount);
        } catch (error) {
            console.error("Error fetching folders:", error);
        }
    };

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axiosClient.post("/folders", {
                name: folderName,
            });
            setFolders((prev) => [...prev, { ...response, taskCount: 0 }]);
            setFolderName("");
            showToast("success", "Folder created successfully!");
        } catch (error) {
            console.error("Error creating folder:", error);
            showToast("error", "Failed to create folder.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteFolder = async (folderId: string) => {
        if (window.confirm("Are you sure you want to delete this folder?")) {
            try {
                await axiosClient.delete(`/folders/${folderId}`);
                setFolders((prev) =>
                    prev.filter((folder) => folder.id !== folderId)
                );
                showToast("success", "Folder deleted successfully!");
            } catch (error) {
                console.error("Error deleting folder:", error);
                showToast("error", "Failed to delete folder.");
            }
        }
    };

    const handleFolderClick = (folderId: string) => {
        navigate(`/folders/${folderId}`);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Folders</h1>
            {currentUser?.is_premium ? (
                <form onSubmit={handleCreateFolder} className="mb-6">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="New Folder Name"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            {isLoading ? "Creating..." : "Create Folder"}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-6">
                    <Link to="/premium" className="text-blue-500">
                        Upgrade to premium to create folders.
                    </Link>
                </div>
            )}
            {folders.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {folders.map((folder) => (
                            <motion.li
                                key={folder.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white p-4 rounded-lg shadow flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => handleFolderClick(folder.id)}
                            >
                                <div>
                                    <h2 className="font-medium text-gray-800">
                                        {folder.name}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        {folder.taskCount} tasks
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteFolder(folder.id);
                                    }}
                                    className="text-red-500 hover:text-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            </motion.li>
                        ))}
                    </AnimatePresence>
                </ul>
            ) : (
                <p className="text-gray-600">No folders found.</p>
            )}
        </div>
    );
};

export default Folders;