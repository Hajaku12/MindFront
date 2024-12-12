import React, { useState, useEffect } from 'react';
import './Wheel.css';

const Wheel = ({ onSpinComplete, rotation }) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const topics = ['Ciencia', 'Geografía', 'Cultura', 'Historia'];
    const [selectedTopic, setSelectedTopic] = useState('');

    useEffect(() => {
        if (rotation !== 0) {
            setIsSpinning(true); // Activa el estado de giro
            setTimeout(() => {
                setIsSpinning(false); // Desactiva el estado de giro después de 3 segundos
                const selectedTopicIndex = Math.floor((rotation % 360) / 90);
                const selected = topics[selectedTopicIndex];
                setSelectedTopic(selected);
                onSpinComplete(selected); // Notificar al Lobby sobre el tema seleccionado
            }, 3000); // La duración de la animación es de 3 segundos
        }
    }, [rotation]); // Esto se ejecuta cada vez que cambia la rotación


    return (
        <div className="wheel-container">
            <div
                className={`wheel ${isSpinning ? 'spinning' : ''}`}
                style={{ transform: `rotate(${rotation}deg)`, transition: isSpinning ? 'transform 3s ease' : 'none' }}
            >
                <div className="arrow">➤</div>
                {topics.map((topic, index) => (
                    <div key={index} className={`segment segment-${index}`}>
                        <span>{topic}</span>
                    </div>
                ))}
            </div>
            {!isSpinning && selectedTopic && <h3>Tema seleccionado: {selectedTopic}</h3>}
        </div>
    );
};

export default Wheel;