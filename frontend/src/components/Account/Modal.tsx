import React from 'react';

interface ModalProps {
    title: string;
    onClose: () => void;
    onSave: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, onSave, children }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h3 className="text-lg font-bold mb-4">{title}</h3>
                {children}
                <div className="flex justify-between mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
                        Cancel
                    </button>
                    <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
