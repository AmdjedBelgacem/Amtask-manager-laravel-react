import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SidebarLinkProps } from "../../lib/interfaces";
import { textVariants } from "../../lib/animations";
import Tooltip from "../ui/Tooltip";

const SidebarLink = ({
    to,
    Icon: IconComponent,
    label,
    isOpen,
disabled,
}: SidebarLinkProps & {
    Icon: React.ComponentType<{ className?: string }>;
}) => {
    const navigate = useNavigate();

    return (
        <Tooltip
            content={
            disabled ? "Become a premium member to unlock this feature" : ""
            }
        >
        {!disabled ? (
                <Link
                    to={to}
                    className={`flex items-center p-2 transition-colors duration-200 hover:bg-gray-100 rounded-md`}
                    style={{ textDecoration: "none", overflow: "hidden" }}
                >
                    <span className="flex items-center justify-center w-6 h-6">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                    </span>
                    {isOpen && (
                        <motion.span
                            variants={textVariants}
                            className="ml-2 font-medium text-gray-700 whitespace-nowrap"
                        >
                            {label}
                        </motion.span>
                    )}
                </Link>
            ) : (
                <div
                    className={`flex items-center p-2 transition-colors duration-200 cursor-pointer opacity-50 rounded-md`}
                    style={{ textDecoration: "none", overflow: "hidden" }}
                    onClick={() => navigate("/premium-presentation")}
                >
                    <span className="flex items-center justify-center w-6 h-6">
                        <IconComponent className="w-5 h-5 text-gray-600" />
                    </span>
                    {isOpen && (
                        <motion.span
                            variants={textVariants}
                            className="ml-2 font-medium text-gray-700 whitespace-nowrap"
                        >
                            {label}
                        </motion.span>
                    )}
                </div>
            )}
        </Tooltip>
    );
};

export default SidebarLink;
