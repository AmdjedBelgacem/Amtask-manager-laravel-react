export const sidebarVariants = {
    open: {
        width: "15rem",
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.1,
        },
    },
    closed: {
        width: "4rem",
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.1,
        },
    },
};

export const sidebarPhoneVariants = {
    open: {
        width: "15rem",
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.1,
        },
    },
    closed: {
        width: "4rem",
        opacity: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            duration: 0.1,
        },
    },
};

export const textVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.3, delay: 0.1 } },
    closed: { opacity: 0, x: -10, transition: { duration: 0.2 } },
};

export const taskVariants = {
    hidden: {
        opacity: 0,
        y: -30,
        scale: 0.9,
        transition: { duration: 0.3, ease: "easeOut" },
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        y: 30,
        scale: 0.9,
        transition: { duration: 0.3, ease: "easeIn" },
    },
};

export const descriptionVariants = {
    collapsed: { opacity: 1, height: "4rem" },
    expanded: { opacity: 1, height: "auto" },
};