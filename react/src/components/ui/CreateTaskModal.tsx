import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStateContext } from "../../contexts/ContextProvider";
import { CreateTaskModalProps } from "../../lib/interfaces";

const CreateTaskModal = ({
    isOpen,
    onClose,
    onSubmit,
    mode,
    task,
}: CreateTaskModalProps) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const statusRef = useRef<HTMLSelectElement>(null);
    const dueDateRef = useRef<HTMLInputElement>(null);
    const [priority, setPriority] = useState(task?.priority || false);
    const { currentUser } = useStateContext();

    useEffect(() => {
        if (mode === "update" && task) {
            if (titleRef.current) titleRef.current.value = task.title;
            if (descriptionRef.current)
                descriptionRef.current.value = task.description;
            if (statusRef.current) statusRef.current.value = task.status;
            if (dueDateRef.current) dueDateRef.current.value = task.due_date;
            setPriority(task.priority || false);
        }
    }, [mode, task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const title = titleRef.current?.value || "";
        const description = descriptionRef.current?.value || "";
        const status = statusRef.current?.value || "pending";
        const due_date = dueDateRef.current?.value || "";

        onSubmit({ title, description, status, due_date, priority });

        if (mode === "create") {
            if (titleRef.current) titleRef.current.value = "";
            if (descriptionRef.current) descriptionRef.current.value = "";
            if (statusRef.current) statusRef.current.value = "pending";
            if (dueDateRef.current) dueDateRef.current.value = "";
            setPriority(false);
        }

        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] bg-opacity-50 z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-bold mb-4">
                            {mode === "create"
                                ? "Create a New Task"
                                : "Update Task"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    ref={titleRef}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    ref={descriptionRef}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    rows={3}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    ref={statusRef}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">
                                        In Progress
                                    </option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    ref={dueDateRef}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            {currentUser?.is_premium && (
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="priority"
                                        checked={priority}
                                        onChange={(e) =>
                                            setPriority(e.target.checked)
                                        }
                                        className="h-4 w-4 text-blue-500 rounded focus:ring-blue-500 border-gray-300"
                                    />
                                    <label
                                        htmlFor="priority"
                                        className="ml-2 text-sm text-gray-700"
                                    >
                                        Mark as Priority
                                    </label>
                                </div>
                            )}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors duration-200"
                                >
                                    {mode === "create"
                                        ? "Create Task"
                                        : "Update Task"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CreateTaskModal;
