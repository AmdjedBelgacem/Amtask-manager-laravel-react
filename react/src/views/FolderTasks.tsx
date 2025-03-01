import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../lib/axios-client";
import DraggableTask from "../components/dnd/DraggableTask";
import CreateTaskModal from "../components/ui/CreateTaskModal";
import { useAtom } from "jotai";
import { tasksAtom } from "../atoms/taskAtoms";
import { Task } from "../lib/interfaces";
import { showToast } from "../components/ui/Toast";

const FolderTasks = () => {
    const { folderId } = useParams();
    const [tasks, setTasks] = useAtom(tasksAtom);
    const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
    const [folderName, setFolderName] = useState("");
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchFolderTasks = async (page = 1, search = "") => {
        try {
            const folderResponse = await axiosClient.get(`/folders/${folderId}`);
            // @ts-expect-error expected
            setFolderName(folderResponse.name || "Unnamed Folder");
    
            const tasksResponse = await axiosClient.get(`/folders/${folderId}/tasks`, {
                params: { page, search },
            });
    
            const tasksData = Array.isArray(tasksResponse) ? tasksResponse : tasksResponse.data || [];
            const sortedTasks = tasksData.sort(
                (a: Task, b: Task) => (a.pivot?.order || 0) - (b.pivot?.order || 0)
            );
            setTasks(sortedTasks);
            // @ts-expect-error expected
            setCurrentPage(tasksResponse.current_page || 1);
            // @ts-expect-error expected
            setTotalPages(tasksResponse.last_page || 1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error fetching folder tasks:", error.response?.data || error.message);
            setTasks([]);
            setFolderName("Error loading folder");
            showToast("error", error.response?.data?.message || "Failed to load folder tasks.");
        }
    };

    useEffect(() => {
        fetchFolderTasks(currentPage, searchQuery);
    }, [folderId, currentPage, searchQuery]);

    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await axiosClient.get("/folders");
                setFolders(response.data);
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

    const handleRemoveFromFolder = async (taskId: string) => {
        try {
            await axiosClient.delete(
                `/folders/${folderId}/remove-task/${taskId}`
            );
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== taskId)
            );
            showToast("success", "Task removed from folder successfully!");
        } catch (error) {
            console.error("Error removing task from folder:", error);
            showToast("error", "Failed to remove task from folder.");
        }
    };

    const moveTask = async (dragIndex: number, hoverIndex: number) => {
        const newTasks = [...tasks];
        const [draggedTask] = newTasks.splice(dragIndex, 1);
        newTasks.splice(hoverIndex, 0, draggedTask);

        const updatedTasks = newTasks.map((task, index) => ({
            ...task,
            pivot: {
                // @ts-expect-error expected
                ...task.pivot,
                order: index,
            },
        }));

        setTasks(updatedTasks);

        try {
            await axiosClient.put(`/folders/${folderId}/reorder-tasks`, {
                orders: updatedTasks.map((task) => ({
                    id: task.id,
                    order: task.pivot.order,
                })),
            });
            console.log("Tasks reordered successfully!");
        } catch (error) {
            console.error("Error updating task order:", error);
            setTasks(tasks);
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
            await axiosClient.put(`/tasks/${selectedTask.id}`, {
                title: updatedTask.title,
                description: updatedTask.description,
                status: updatedTask.status,
                due_date: updatedTask.due_date,
                priority: updatedTask.priority,
            });

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === selectedTask.id
                        ? {
                              ...task,
                              ...updatedTask,
                              due_date: updatedTask.due_date,
                              priority: updatedTask.priority,
                          }
                        : task
                )
            );

            setIsUpdateModalOpen(false);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleAddToFolder = async (taskId: string, folderId: string) => {
        try {
            await axiosClient.post(`/folders/${folderId}/add-task`, {
                task_id: taskId,
            });
            alert("Task added to folder successfully!");
        } catch (error) {
            console.error("Error adding task to folder:", error);
            alert("Failed to add task to folder.");
        }
    };

    const handleSetPriority = async (taskId: string, priority: boolean) => {
        try {
            await axiosClient.put(`/tasks/${taskId}`, {
                priority,
            });

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === taskId ? { ...task, priority } : task
                )
            );
        } catch (error) {
            console.error("Error setting task priority:", error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Folder: {folderName}</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tasks.map((task) => (
                    <DraggableTask
                        key={task.id}
                        id={task.id}
                        // @ts-expect-error expected
                        index={task.pivot?.order || 0}
                        title={task.title}
                        description={task.description}
                        status={task.status}
                        due_date={task.due_date}
                        // @ts-expect-error expected
                        priority={task.priority}
                        moveTask={moveTask}
                        onDelete={handleRemoveFromFolder} 
                        onEdit={handleEditTask}
                        onAddToFolder={handleAddToFolder}
                        onSetPriority={handleSetPriority}
                        folders={folders}
                    />
                ))}
            </div>
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

export default FolderTasks;
