import { Folder } from "lucide-react";

interface AddToFolderPopupProps {
    isOpen: boolean;
    onClose: () => void;
    folders: { id: string; name: string }[];
    onSelectFolder: (folderId: string) => void;
}

const AddToFolderPopup = ({
    isOpen,
    onClose,
    folders,
    onSelectFolder,
}: AddToFolderPopupProps) => {
    if (!isOpen) return null;

    const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center z-50"
            onClick={handleBackgroundClick}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Add Task to Folder</h2>
                <ul className="space-y-2">
                    {folders.map((folder) => (
                        <li
                            key={folder.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                            onClick={() => onSelectFolder(folder.id)}
                        >
                            <div className="flex items-center">
                                <Folder className="w-5 h-5 mr-2 text-gray-600" />
                                <span className="text-gray-800">
                                    {folder.name}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddToFolderPopup;
