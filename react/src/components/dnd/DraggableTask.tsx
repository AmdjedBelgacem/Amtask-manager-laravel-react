import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Calendar, Trash2, PenSquare, FolderPlus, Star } from "lucide-react";
import AddToFolderPopup from "../ui/AddToFolderModal";
import { useStateContext } from "../../contexts/ContextProvider";
import Tooltip from "../ui/Tooltip";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { taskVariants, descriptionVariants } from "../../lib/animations";
import { DraggableTaskProps } from "../../lib/interfaces";

const DraggableTask = ({
    id,
    index,
    title,
    description,
    status,
    due_date,
    priority,
    moveTask,
    onDelete,
    onEdit,
    onAddToFolder,
    folders,
    onSetPriority,
}: DraggableTaskProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { currentUser } = useStateContext();

    const [{ isDragging }, drag] = useDrag({
        type: "TASK",
        item: { id, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: "TASK",
        hover: (item: { id: string; index: number }, monitor) => {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            moveTask(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    drag(drop(ref));

    const handleAddToFolder = (folderId: string) => {
        if (onAddToFolder) {
            onAddToFolder(id, folderId);
            setIsPopupOpen(false);
            toast.success("Task added to folder successfully!");
        }
    };

    const handleSetPriority = async () => {
        if (!currentUser?.is_premium) {
            toast.error("Only premium users can mark tasks as priority.");
            return;
        }

        await onSetPriority(id, !priority);
        toast.success("Task priority updated!");
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <AnimatePresence>
            <motion.div
                ref={ref}
                className={`relative flex flex-col justify-between p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    isDragging ? "opacity-50" : "opacity-100"
                } ${
                    priority
                        ? "border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100"
                        : "border border-gray-200 bg-white"
                }`}
                style={{
                    cursor: "move",
                }}
                onClick={toggleExpand}
                variants={taskVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
            >
                <div>
                    <div className="flex justify-between items-center mb-4">
                        {currentUser?.is_premium ? (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSetPriority();
                                    }}
                                    className={`cursor-pointer ${
                                        priority
                                            ? "bg-yellow-400 text-white p-1 rounded-full"
                                            : "text-gray-500 hover:text-yellow-500"
                                    } transition-colors duration-200 `}
                                    aria-label="Set Priority"
                                >
                                    <Star className="h-5 w-5" />
                                </button>
                            </div>
                        ) : (
                            <div />
                        )}

                        <div className="flex space-x-2">
                            <Tooltip content="Edit Task">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit({
                                            id,
                                            title,
                                            description,
                                            status,
                                            due_date,
                                            order: index,
                                            priority,
                                        });
                                    }}
                                    className="cursor-pointer p-2 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                                    aria-label="Edit Task"
                                >
                                    <PenSquare className="h-5 w-5" />
                                </button>
                            </Tooltip>
                            <Tooltip content="Delete Task">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(id);
                                    }}
                                    className="cursor-pointer p-2 text-gray-500 hover:text-red-500 transition-colors duration-200"
                                    aria-label="Delete Task"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </Tooltip>
                            {(folders || currentUser?.is_premium) && (
                                <Tooltip content="Add to Folder">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsPopupOpen(true);
                                        }}
                                        className="cursor-pointer p-2 text-gray-500 hover:text-green-500 transition-colors duration-200"
                                        aria-label="Add to Folder"
                                    >
                                        <FolderPlus className="h-5 w-5" />
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                    <div className="overflow-hidden mb-5">
                        <h2
                            className={`text-xl font-bold ${
                                priority ? "text-yellow-800" : "text-gray-800"
                            } mb-2 truncate`}
                            title={title}
                        >
                            {title}
                        </h2>
                        <motion.div
                            className={`text-gray-600 text-sm mb-4 ${
                                priority ? "text-yellow-700" : ""
                            }`}
                            variants={descriptionVariants}
                            initial="collapsed"
                            animate={isExpanded ? "expanded" : "collapsed"}
                            transition={{ duration: 0.3 }}
                        >
                            <p className="overflow-hidden text-ellipsis whitespace-pre-line">
                                {description}
                            </p>
                        </motion.div>
                    </div>
                </div>
                <div>
                    <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                            status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                        }`}
                    >
                        {status.replace("_", " ")}
                    </span>
                    <div className="mt-4 flex items-center text-gray-600 text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                            Due: {new Date(due_date).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </motion.div>

            {(folders || currentUser?.is_premium) && (
                <AddToFolderPopup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    folders={folders ?? []}
                    onSelectFolder={handleAddToFolder}
                />
            )}
        </AnimatePresence>
    );
};

export default DraggableTask;
