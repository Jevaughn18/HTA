import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-modal-overlay" onClick={onCancel}>
            <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-modal-header">
                    <h3>{title}</h3>
                    <button className="confirm-modal-close" onClick={onCancel}>&times;</button>
                </div>
                <div className="confirm-modal-body">
                    <p>{message}</p>
                </div>
                <div className="confirm-modal-actions">
                    <button className="btn-confirm-secondary" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className={`btn-confirm-primary btn-confirm-${type}`} onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
