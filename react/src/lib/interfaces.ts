export interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export interface SidebarLinkProps {
    to: string;
    Icon: React.ComponentType;
    label: string;
    isOpen: boolean;
    disabled?: boolean;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    due_date: string;
    order: number;
    priority: boolean;
    pivot?: {
        order: number;
    };
}

export interface DraggableTaskProps {
    id: string;
    index: number;
    title: string;
    description: string;
    status: string;
    due_date: string;
    priority: boolean;
    moveTask: (dragIndex: number, hoverIndex: number) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
    onAddToFolder?: (taskId: string, folderId: string) => void;
    folders?: { id: string; name: string }[];
    onSetPriority: (taskId: string, priority: boolean) => void;
}

export interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: {
        title: string;
        description: string;
        status: string;
        due_date: string;
        priority: boolean;
    }) => void;
    mode: "create" | "update";
    task?: {
        title: string;
        description: string;
        status: string;
        due_date: string;
        priority: boolean;
    };
}

export interface CustomToastProps {
    type: "success" | "error" | "loading" | "default";
    message: string;
}

export interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

export interface StateContextType {
    currentUser: { id: number; name: string; is_premium: boolean } | null;
    token: string | null;
    notification: string;
    setUser: React.Dispatch<
        React.SetStateAction<{ id: number; name: string; is_premium: boolean } | null>
    >;
    setToken: (token: string | null) => void;
    setNotification: (message: string) => void;
}
