import React, { useState } from 'react';
import { sendMessage } from '../services/WebSocketService';
import './CreateGame.css';

const CreateGame = ({ userName }) => {
    const [gameName, setGameName] = useState('');

    const handleCreateGame = () => {
        if (gameName.trim()) {
            const gameData = {
                name: gameName,
                createdBy: userName
            };
            sendMessage('/app/create', JSON.stringify(gameData));
            setGameName('');
        }
    };

     return (
         <div className="main-container">
             <div className="contenedor">
                    <div className="create-game-container">
                        <h2 className="create-game-title">Crear un Juego</h2>
                        <input
                            type="text"
                            placeholder="Ingresar Nombre del juego"
                            value={gameName}
                            onChange={(e) => setGameName(e.target.value)}
                            className="create-game-input"
                        />
                        <button onClick={handleCreateGame} className="create-game-button">
                            Crear Juego
                        </button>
                    </div>
             </div>
         </div>
    );
};

export default CreateGame;
