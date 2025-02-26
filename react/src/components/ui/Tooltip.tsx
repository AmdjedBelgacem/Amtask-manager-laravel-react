import  { useState } from "react";
import { TooltipProps } from "../../lib/interfaces";

const Tooltip = ({ content, children }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className="relative z-50"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && content && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm px-2 py-1 rounded-md whitespace-nowrap z-50">
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
