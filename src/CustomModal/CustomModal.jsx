import React from 'react';
import './CustomModal.css';

const CustomModal = ({ 
  title, 
  description, 
  isOpen, 
  onClose, 
  onConfirm, 
  value, 
  setValue, 
  isPassword, 
  placeholder,
  hasError,      
  showInput, 
  isAnonymous,
  setIsAnonymous,
  showCheckbox,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        {description && <p className="modal-description">{description}</p>}
        
        {children}

        {showInput && (
          <div className="input-container">
            <input 
              type={isPassword ? "password" : "text"}
              className={`modal-input ${hasError ? 'error-shake' : ''}`}
              value={isAnonymous ? "" : value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={isAnonymous ? "Modo Anónimo activo" : placeholder}
              disabled={isAnonymous}
              autoFocus
            />
            {hasError && <span className="error-message">Contraseña incorrecta</span>}

            {showCheckbox && (
              <div className="anonymous-option">
                <input 
                  type="checkbox" 
                  id="anon-check" 
                  checked={isAnonymous} 
                  onChange={(e) => setIsAnonymous(e.target.checked)} 
                />
                <label htmlFor="anon-check">Reservar como Anónimo 🥸</label>
              </div>
            )}
          </div>
        )}

        <div className="modal-actions">
          {showInput && <button className="btn-cancel" onClick={onClose}>Cancelar</button>}
          <button className="btn-confirm" onClick={onConfirm || onClose}>
            {showInput ? "Confirmar" : "Entendido"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;