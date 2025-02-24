import toast, { Toaster } from "react-hot-toast";
import { CustomToastProps } from "../../lib/interfaces";

const CustomToast = ({ type, message }: CustomToastProps) => {
    const toastStyles = {
        success: {
            background: "#4CAF50",
            color: "#FFFFFF",
            icon: "✅",
        },
        error: {
            background: "#F44336",
            color: "#FFFFFF",
            icon: "❌",
        },
        loading: {
            background: "#2196F3",
            color: "#FFFFFF",
            icon: "⏳",
        },
        default: {
            background: "#333333",
            color: "#FFFFFF",
            icon: "ℹ️",
        },
    };

    const style = toastStyles[type] || toastStyles.default;

    return (
        <div
            style={{
                padding: "12px 16px",
                borderRadius: "8px",
                background: style.background,
                color: style.color,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
        >
            <span>{style.icon}</span>
            <span>{message}</span>
        </div>
    );
};

export const showToast = (type: 'success' | 'error' | 'loading' | 'default', message: string) => {
    toast.custom(<CustomToast type={type} message={message} />, {
        position: "top-right",
        duration: 3000,
    });
};

export const ToastContainer = () => (
    <Toaster
        position="bottom-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
            bottom: 24,
            right: 24,
        }}
    />
);
