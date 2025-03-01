import { LayoutDashboard, Folder } from "lucide-react";
import { motion } from "framer-motion";
import SidebarLink from "./SidebarLink";
import { SidebarProps } from "../../lib/interfaces";
import { sidebarVariants } from "../../lib/animations";
import UserButton from "./UserButton";
import { useStateContext } from "../../contexts/ContextProvider";

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const { currentUser } = useStateContext();
    return (
        <motion.aside
            className="fixed inset-0 md:relative bg-white shadow-lg border border-gray-200 rounded-lg flex flex-col justify-between p-2 overflow-hidden h-full z-40 md:z-0 w-20"
            variants={sidebarVariants}
            animate={isOpen ? "open" : "closed"}
            initial={false}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="space-y-2">
                <SidebarLink
                    to="/"
                    Icon={LayoutDashboard}
                    label="Dashboard"
                    isOpen={isOpen}
                />
                <SidebarLink
                    to="/premium/folders"
                    Icon={Folder}
                    label="Folders"
                    isOpen={isOpen}
                    disabled={!currentUser?.is_premium}
                />
            </div>
            <UserButton isOpen={isOpen} />
        </motion.aside>
    );
};

export default Sidebar;

