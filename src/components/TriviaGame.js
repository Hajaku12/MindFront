import React, { useEffect, useState } from 'react';
import { connect, subscribeToTopic, sendMessage } from '../services/WebSocketService';
import Wheel from './Wheel';

const Lobby = ({ gameName, userName }) => {
    const [users, setUsers] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showQuestion, setShowQuestion] = useState(false);
    const [scores, setScores] = useState({});
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [showTopicSelected, setShowTopicSelected] = useState(false);

    useEffect(() => {
        connect(() => {
            console.log(`Connected to lobby for game: ${gameName}`);
            sendMessage('/app/join', JSON.stringify({ gameName, userName }));

            subscribeToTopic(`/topic/lobby/${gameName}`, (message) => {
                const receivedUsers = JSON.parse(message.body);
                setUsers(receivedUsers);
            });

            subscribeToTopic(`/topic/gameStart/${gameName}`, (message) => {
                setIsGameStarted(true);
                console.log('Game started!');
            });

            subscribeToTopic(`/topic/turn/${gameName}`, (message) => {
                const player = message.body;
                setCurrentPlayer(player);
                setShowQuestion(false); // Reinicia showQuestion cuando es el turno de un nuevo jugador
                console.log(`${player} is spinning the wheel`);
                if (player !== userName) {
                    alert(`${player} está girando la ruleta.`);
                }
            });

            subscribeToTopic(`/topic/topicSelected/${gameName}`, (message) => {
                const topic = message.body;
                setSelectedTopic(topic);
                alert(`Tema seleccionado: ${topic}`);
                sendMessage('/app/getQuestion', JSON.stringify({ gameName, topic }));
                setShowTopicSelected(true);
            });

            subscribeToTopic(`/topic/question/${gameName}`, (message) => {
                const question = JSON.parse(message.body);
                setCurrentQuestion(question);
                // No activamos showQuestion aquí, lo haremos después de que la ruleta termine
                setShowTopicSelected(false);
            });

            subscribeToTopic(`/topic/scores/${gameName}`, (message) => {
                const updatedScores = JSON.parse(message.body);
                setScores(updatedScores);
            });

            subscribeToTopic(`/topic/pointWinner/${gameName}`, (message) => {
                const winner = message.body;
                alert(`${winner} ganó el punto!`);
            });

            subscribeToTopic(`/topic/winner/${gameName}`, (message) => {
                const winner = message.body;
                alert(`¡El juego ha terminado! El ganador es ${winner}`);
                setIsGameStarted(false);
            });
        });
    }, [gameName, userName]);

    const handleStartGame = () => {
        sendMessage('/app/startGame', gameName);
    };

    /*const handleSpinWheel = () => {
        if (userName === currentPlayer) {
            setShowQuestion(false);
            sendMessage('/app/spinWheel', gameName);
        } else {
            alert(`Esperando a que ${currentPlayer} gire la ruleta.`);
        }
    };*/

    const handleAnswerSubmit = (answer) => {
        if (showQuestion) {
            sendMessage('/app/submitAnswer', JSON.stringify({
                gameName,
                userName,
                answer
            }));
        }
    };

    return (
        <div>
            <h2>Lobby for {gameName}</h2>
            <p>Users in the lobby:</p>
            <ul>
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <li key={index}>{user}</li>
                    ))
                ) : (
                    <p>No users in the lobby yet.</p>
                )}
            </ul>

            {!isGameStarted && users.length >= 2 && (
                <button onClick={handleStartGame}>Comenzar Juego</button>
            )}

            {isGameStarted && (
                <div>
                    <h3>Current Player: {currentPlayer}</h3>
                    
                    {currentPlayer === userName ? (
                        <Wheel onSpinComplete={(topic) => {
                            setSelectedTopic(topic);
                            sendMessage('/app/topicSelected', JSON.stringify({ gameName, topic }));
                            // Esperamos 1 segundo después de que la ruleta se detenga para mostrar la pregunta
                            setTimeout(() => {
                                setShowQuestion(true);
                            }, 1000);
                        }} />
                    ) : (
                        <p>Esperando a que {currentPlayer} gire la ruleta...</p>
                    )}

                    {showTopicSelected && <p>Tema selecnado: {selectedTopic}</p>}

                    {showQuestion && currentQuestion && (
                        <div>
                            <h4>Categoría: {currentQuestion.category}</h4>
                            <p>{currentQuestion.text}</p>
                            {currentQuestion.options.map((option, idx) => (
                                <button key={idx} onClick={() => handleAnswerSubmit(option)}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div>
                <h3>Scoreboard</h3>
                <ul>
                    {Object.entries(scores).map(([player, score], index) => (
                        <li key={index}>{player}: {score} puntos</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Lobby;