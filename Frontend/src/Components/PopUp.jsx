import React from "react";

const PopUp = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed bottom-2 z-50 bg-black text-white px-6 py-3 rounded-xl shadow-lg flex items-center self-center justify-between gap-x-3 w-2/4 mx-[39vw] backdrop-blur-sm">
            {children}
            <button
                onClick={onClose}
                className="text-white px-2.5 py-1 rounded-2xl bg-red-500 lg:bg-black/50 hover:bg-red-500"
            >
                ✕
            </button>
        </div>
    );
};


export default PopUp;