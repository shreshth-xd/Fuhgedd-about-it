import { useState } from "react";

const PasswordModal = ({ isOpen, onClose, onSubmit, title = "Enter Master Password", error = "" }) => {
    const [password, setPassword] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.trim()) {
            onSubmit(password);
            setPassword(""); // Clear password after submission
        }
    };

    const handleClose = () => {
        setPassword(""); // Clear password on close
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#100f0f] text-white p-5 rounded-xl shadow-2xl w-2/4 max-w-md relative border-2 border-[#c3bebe]">
                <div className="DialogHeader w-full flex items-center justify-between mb-5">
                    <h1 className="text-2xl">{title}</h1>
                    <button 
                        onClick={handleClose} 
                        className="hover:font-semibold px-2.5 py-1 rounded-2xl bg-white text-black lg:text-white lg:bg-black/50 hover:bg-white hover:text-black"
                    >
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-y-4">
                    <div className="flex flex-col gap-y-2">
                        <label htmlFor="password" className="text-sm">Master Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-[#1a1919] px-3 py-2 rounded border border-gray-600 focus:outline-none focus:border-blue-500 text-white"
                            placeholder="Enter your master password"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}
                    </div>
                    <div className="flex gap-x-2 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordModal;

