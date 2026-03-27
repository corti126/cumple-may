import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";
import CustomModal from '../CustomModal/CustomModal';
import './ListaRegalos.css';

const PASS_MAESTRA = "mayra2026";

const ListaRegalos = () => {
  const [regalos, setRegalos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "regalos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRegalos(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return () => unsubscribe();
  }, []);

  const cerrarModal = () => {
    setModalOpen(false);
    setInputValue("");
    setHasError(false);
    setIsAnonymous(false);
  };

  const intentarConfirmar = async () => {
    if (!modalConfig.action) return;

    if (modalConfig.isPassword && inputValue !== PASS_MAESTRA) {
      setHasError(true);
      setTimeout(() => setHasError(false), 500);
      return;
    }

    const actualInput = inputValue;
    cerrarModal();
    modalConfig.action(actualInput);
  };

  const handleAddRequest = () => {
    if (!nuevoProducto.trim()) return;
    setModalConfig({
      title: "Seguridad",
      description: "Ingresá la clave para añadir este regalo.",
      isPassword: true,
      showInput: true,
      placeholder: "Contraseña maestra...",
      action: async () => {
        await addDoc(collection(db, "regalos"), {
          producto: nuevoProducto,
          completado: false,
          reservadoPor: "",
          createdAt: serverTimestamp()
        });
        setNuevoProducto("");
      }
    });
    setModalOpen(true);
  };

  const handleReserveRequest = (id) => {
    setModalConfig({
      title: "Reservar Regalo",
      description: "¿Quién lo regala?",
      showInput: true,
      showCheckbox: true,
      isPassword: false,
      placeholder: "Tu nombre...",
      action: async (val) => {
        const nombreFinal = isAnonymous ? "Anónimo 🥸" : (val.trim() || "Anónimo 🥸");
        await updateDoc(doc(db, "regalos", id), {
          completado: true,
          reservadoPor: nombreFinal
        });
      }
    });
    setModalOpen(true);
  };

  const handleUnreserveRequest = (id) => {
    setModalConfig({
      title: "Liberar Regalo",
      description: "¿Estás seguro que querés volver a poner este regalo como disponible?",
      showInput: false,
      action: async () => {
        await updateDoc(doc(db, "regalos", id), { completado: false, reservadoPor: "" });
      }
    });
    setModalOpen(true);
  };

  const handleDeleteRequest = (id) => {
    setModalConfig({
      title: "Eliminar",
      description: "Clave maestra para borrar de la lista.",
      isPassword: true,
      showInput: true,
      placeholder: "Contraseña maestra...",
      action: async () => {
        await deleteDoc(doc(db, "regalos", id));
      }
    });
    setModalOpen(true);
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Wishlist de May</h1>
        <div className="instructions-trigger" onClick={() => setShowInstructions(true)}>
          Instrucciones
        </div>
      </header>

      <div className="gift-form">
        <input
          className="input-gift"
          value={nuevoProducto}
          onChange={(e) => setNuevoProducto(e.target.value)}
          placeholder="Escribí un regalo..."
        />
        <button onClick={handleAddRequest} className="add-button">Añadir</button>
      </div>

      <div className="list-container">
        {regalos.map(regalo => (
          <div key={regalo.id} className="item-card">
            <div
              onClick={() => regalo.completado ? handleUnreserveRequest(regalo.id) : handleReserveRequest(regalo.id)}
              className={`checkbox ${regalo.completado ? 'checked' : ''}`}
            >
              {regalo.completado && "✓"}
            </div>

            <div className={`product-text ${regalo.completado ? 'completed' : ''}`}>
              {regalo.producto}
            </div>

            <div className="status-container">
              <span className={`status-label ${regalo.completado ? 'reserved' : 'pending'}`}>
                {regalo.completado ? regalo.reservadoPor : 'Sin asignar'}
              </span>
              <button onClick={() => handleDeleteRequest(regalo.id)} className="delete-btn">×</button>
            </div>
          </div>
        ))}
      </div>

      <CustomModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)}
        title="Instrucciones"
        showInput={false}
      >
        <ul className="instructions-list">
          <li>Solo <strong>Mayra</strong> puede agregar nuevos regalos a la lista.</li>
          <li>Si elegís un regalo, recordá <strong>reservarlo</strong> para que no se repita.</li>
          <li>Podés reservar como <strong>Anónimo 🥸</strong> si querés dar una sorpresa.</li>
          <li>Si no podés cumplir una reserva, por favor <strong>liberalo</strong> para otros.</li>
          <li>No se pueden eliminar regalos; esa función es exclusiva de <strong>Mayra</strong>.</li>
        </ul>
      </CustomModal>

      <CustomModal
        isOpen={modalOpen}
        onClose={cerrarModal}
        onConfirm={intentarConfirmar}
        title={modalConfig.title}
        description={modalConfig.description}
        value={inputValue}
        setValue={setInputValue}
        isPassword={modalConfig.isPassword}
        placeholder={modalConfig.placeholder}
        hasError={hasError}
        showInput={modalConfig.showInput}
        isAnonymous={isAnonymous}
        setIsAnonymous={setIsAnonymous}
        showCheckbox={modalConfig.showCheckbox}
      />
    </div>
  );
};

export default ListaRegalos;