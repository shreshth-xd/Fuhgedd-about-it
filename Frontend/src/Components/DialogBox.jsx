import { useState } from "react";

const DialogBox = ({ isOpen, onClose, children, title = "Vault details" }) => {
    if (!isOpen) return null;

    return (
        <>

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                {/* Dialog box */}
            <div className="bg-[#100f0f] text-white p-5 rounded-xl shadow-2xl w-2/4 relative border-2 border-[#c3bebe]">
                <div className="DialogHeader w-full flex items-center justify-between mb-5">
                    <h1 className="text-2xl">{title}</h1>
                    <button onClick={onClose} className="hover:font-semibold px-2.5 py-1 rounded-2xl bg-white text-black lg:text-white lg:bg-black/50 hover:bg-white hover:text-black">
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
        </>
    );
}

export default DialogBox;