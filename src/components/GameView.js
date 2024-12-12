import React, { useState, useEffect } from 'react';
import { connect, subscribeToTopic, sendMessage } from '../services/WebSocketService';

const GameView = ({ gameName, userName }) => {
    const [currentTopic, setCurrentTopic] = useState('');
    const [question, setQuestion] = useState(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState('');

    useEffect(() => {
        connect(() => {
            subscribeToTopic(`/topic/startGame/${gameName}`, (message) => {
                const selectedPlayer = message.body;
                setCurrentPlayer(selectedPlayer);
                if (selectedPlayer === userName) {
                    setIsSpinning(true);
                } else {
                    alert(`${selectedPlayer} está girando la ruleta.`);
                }
            });

            subscribeToTopic(`/topic/topicSelected/${gameName}`, (message) => {
                setCurrentTopic(message.body);
                alert(`Tema seleccionado: ${message.body}`);
                sendMessage('/app/getQuestions', gameName);
            });

            subscribeToTopic(`/topic/questions/${gameName}`, (message) => {
                const questions = JSON.parse(message.body);
                setQuestion(questions[0]); // Selecciona la primera pregunta
            });

            subscribeToTopic(`/topic/pointAwarded/${gameName}`, (message) => {
                alert(message.body);
            });
        });
    }, [gameName, userName]);

    const handleAnswer = (selectedOption) => {
        sendMessage('/app/submitAnswer', JSON.stringify({
            gameName,
            userName,
            answer: selectedOption,
            correctAnswer: question.answer
        }));
    };

    return (
        <div>
            <h2>Juego de Trivia: {gameName}</h2>
            {isSpinning ? (
                <button onClick={() => sendMessage('/app/spinWheel', gameName)}>Girar Ruleta</button>
            ) : (
                <p>Esperando a que {currentPlayer} gire la ruleta...</p>
            )}
            {currentTopic && question && (
                <div>
                    <h3>{question.question}</h3>
                    {question.options.map((option, index) => (
                        <button key={index} onClick={() => handleAnswer(option)}>
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GameView;