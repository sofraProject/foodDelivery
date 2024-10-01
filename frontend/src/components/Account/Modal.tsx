import React from 'react';

// Define props for the Modal component
interface ModalProps {
    title: string;           // Title of the modal
    onClose: () => void;    // Function to close the modal
    onSave: () => void;     // Function to save changes
    children: React.ReactNode; // Content to be rendered inside the modal
}

const Modal: React.FC<ModalProps> = ({ title, onClose, onSave, children }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-lg w-80">
                <h3 className="text-lg font-bold mb-4 text-[#101827]">{title}</h3>
                {children} {/* Render children content here */}
                <div className="flex justify-between mt-4">
                    {/* Cancel button */}
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-[#e0ffbc] text-[#101827] rounded-md hover:bg-[#BFF38A]"
                    >
                        Cancel
                    </button>
                    {/* Save button */}
                    <button 
                        onClick={onSave} 
                        className="px-4 py-2 bg-[#34C759] text-white rounded-md hover:bg-[#2b9c43]"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
