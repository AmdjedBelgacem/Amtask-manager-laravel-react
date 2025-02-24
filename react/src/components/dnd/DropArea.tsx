import React, { useState, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import DraggableTask from "./DraggableTask";
import axiosClient from "../../lib/axios-client";
import CreateTaskModal from "../ui/CreateTaskModal";
import { useAtom } from "jotai";
import { tasksAtom } from "../../atoms/taskAtoms";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Task } from "../../lib/interfaces";

const DropArea = () => {
    const [tasks, setTasks] = useAtom(tasksAtom);
    const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const fetchTasks = async (page = 1, search = "") => {
        setIsLoading(true);
        try {
            const response = await axiosClient.get("/tasks", {
                params: {
                    page,
                    search,
                },
            });
            setTasks(response.data);
            setCurrentPage(response.current_page);
            setTotalPages(response.last_page);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks(currentPage, searchQuery);
    }, [currentPage, searchQuery]);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await axiosClient.get("/folders");
                setFolders(response);
            } catch (error) {
                console.error("Error fetching folders:", error);
            }
        };

        fetchFolders();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const moveTask = async (dragIndex: number, hoverIndex: number) => {
        const newTasks = [...tasks];
        const [removed] = newTasks.splice(dragIndex, 1);
        newTasks.splice(hoverIndex, 0, removed);

        const updatedTasks = newTasks.map((task, index) => ({
            ...task,
            order: index,
        }));

        setTasks(updatedTasks);

        try {
            await axiosClient.put("/tasks/reorder", {
                tasks: updatedTasks,
            });
            toast.success("Tasks reordered successfully!");
        } catch (error) {
            console.error("Error updating task order:", error);
            toast.error("Failed to reorder tasks.");
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await axiosClient.delete(`/tasks/${taskId}`);
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== taskId)
            );
            toast.success("Task deleted successfully!");
        } catch (error) {
            console.error("Error deleting task:", error);
            toast.error("Failed to delete task.");
        }
    };

    const handleEditTask = (task: Task) => {
        setSelectedTask(task);
        setIsUpdateModalOpen(true);
    };

    const handleUpdateTask = async (updatedTask: {
        title: string;
        description: string;
        status: string;
        due_date: string;
        priority: boolean;
    }) => {
        if (!selectedTask) return;

        try {
            await axiosClient.put(`/tasks/${selectedTask.id}`, updatedTask);
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === selectedTask.id
                        ? { ...task, ...updatedTask }
                        : task
                )
            );
            setIsUpdateModalOpen(false);
            toast.success("Task updated successfully!");
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Failed to update task.");
        }
    };

    const handleAddToFolder = async (taskId: string, folderId: string) => {
        try {
            await axiosClient.post(`/folders/${folderId}/add-task`, {
                task_id: taskId,
            });
            toast.success("Task added to folder successfully!");
        } catch (error) {
            console.error("Error adding task to folder:", error);
            toast.error("Failed to add task to folder.");
        }
    };

    const handleSetPriority = async (taskId: string, priority: boolean) => {
        try {
            await axiosClient.put(`/tasks/${taskId}`, { priority });
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, priority } : task
                )
            );
            toast.success("Task priority updated!");
        } catch (error) {
            console.error("Error setting task priority:", error);
            toast.error("Failed to update task priority.");
        }
    };

    const dropRef = useRef<HTMLDivElement>(null);
    const [, drop] = useDrop({
        accept: "TASK",
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    drop(dropRef);

    return (
        <div ref={dropRef} className="p-4">
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search tasks by title..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-1/3 p-2 border border-gray-300 rounded"
                />

                <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 border ${
                                    currentPage === page
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-gray-700"
                                } rounded`}
                            >
                                {page}
                            </button>
                        )
                    )}
                </div>
            </div>

            {isLoading ? (
                <motion.div
                    className="flex justify-center items-center h-64"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                        }}
                    />
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {tasks.map((task) => (
                        <DraggableTask
                            key={task.id}
                            id={task.id}
                            index={task.order}
                            title={task.title}
                            description={task.description}
                            status={task.status}
                            due_date={task.due_date}
                            priority={task.priority}
                            moveTask={moveTask}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                            onAddToFolder={handleAddToFolder}
                            onSetPriority={handleSetPriority}
                            folders={folders}
                        />
                    ))}
                </div>
            )}

            {selectedTask && (
                <CreateTaskModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onSubmit={handleUpdateTask}
                    mode="update"
                    task={{
                        ...selectedTask,
                        due_date: selectedTask.due_date,
                    }}
                />
            )}
        </div>
    );
};

export default DropArea;
