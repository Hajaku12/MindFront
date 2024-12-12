import React, { useState } from 'react';
import './UserNameInput.css';



const UserNameInput = ({ onSubmit }) => {
    const [name, setName] = useState('');

    const handleSubmit = () => {
        if (name.trim()) {
            onSubmit(name);
        }
    };

    return (
        <div className="contenedor">
            <div className="username-input-container">
                <h2 className="username-input-title">Ingresa tu Nombre</h2>
                <input
                    type="text"
                    placeholder="Ingresa tu Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="username-input-field"
                />
                <button onClick={handleSubmit} className="username-input-button">
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default UserNameInput;
