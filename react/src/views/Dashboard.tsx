import { useState } from "react";
import DropArea from "../components/dnd/DropArea";
import CreateTaskModal from "../components/ui/CreateTaskModal";
import axiosClient from "../lib/axios-client";
import { useAtom } from "jotai";
import { tasksAtom } from "../atoms/taskAtoms";
import toast from "react-hot-toast";

export default function Dashboard() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [, setTasks] = useAtom(tasksAtom);

    const handleCreateTask = async (task: {
        title: string;
        description: string;
        status: string;
        due_date: string;
        priority: boolean;
    }) => {
        try {
            const response = await axiosClient.post("/tasks", {
                title: task.title,
                description: task.description,
                status: task.status,
                due_date: task.due_date,
                priority: task.priority,
            });
            //@ts-expect-error expected
            setTasks((prev) => [...prev, response]);
            toast.success("Task created successfully!");
        } catch (error) {
            console.error("Error creating task:", error);
            toast.error("Failed to create task.");
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="text-sm font-bold py-2 px-4 transition duration-300 ease-in-out transform cursor-pointer text-blue-500 hover:text-blue-600"
                >
                    Create a new Task
                </button>
            </div>
            <div className="flex space-x-4">
                <div className="w-full">
                    <DropArea />
                </div>
            </div>
            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateTask}
                mode="create"
            />
        </div>
    );
}