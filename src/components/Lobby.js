import React, { useEffect, useState } from 'react';
import { connect, subscribeToTopic, sendMessage } from '../services/WebSocketService';
import Wheel from './Wheel';
import ScoreBoard from './ScoreBoard';
import './Lobby.css';

const Lobby = ({ gameName, userName }) => {
    const [users, setUsers] = useState([]);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [showQuestion, setShowQuestion] = useState(false);
    const [scores, setScores] = useState({});
    const [currentPlayer, setCurrentPlayer] = useState('');
    const [showTopicSelected, setShowTopicSelected] = useState(false);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const connectWebSocket = () => {
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
                    console.log(`${player} is spinning the wheel`);
                    if (player !== userName) {
                        alert(`${player} está girando la ruleta.`);
                    }
                });

                subscribeToTopic(`/topic/topicSelected/${gameName}`, (message) => {
                    const topic = message.body;
                    setSelectedTopic(topic);
                    alert(`Tema seleccionado: ${topic}`);
                    setShowTopicSelected(true);
                });

                subscribeToTopic(`/topic/question/${gameName}`, (message) => {
                    const question = JSON.parse(message.body);
                    setCurrentQuestion(question);
                    setShowQuestion(true);
                    setShowTopicSelected(false);
                });

                subscribeToTopic(`/topic/scores/${gameName}`, (message) => {
                    const updatedScores = JSON.parse(message.body);
                    setScores(updatedScores);
                });

                subscribeToTopic(`/topic/pointWinner/${gameName}`, (message) => {
                    const winnerMessage = message.body;
                    alert(winnerMessage);
                });

                subscribeToTopic(`/topic/winner/${gameName}`, (message) => {
                    const winner = message.body;
                    alert(`¡El juego ha terminado! El ganador es ${winner}`);
                    setIsGameStarted(false);
                });

                subscribeToTopic(`/topic/spinWheel/${gameName}`, (message) => {
                    const { rotation } = JSON.parse(message.body);
                    setRotation(rotation);
                });
            });
        };

        connectWebSocket();

        return () => {
            // Cleanup logic if needed
        };
    }, [gameName, userName]);

    const handleStartGame = () => {
        sendMessage('/app/startGame', gameName);
    };

    const handleSpinWheel = () => {
        if (userName === currentPlayer) {
            const selectedTopicIndex = Math.floor(Math.random() * 4); // Selecciona un tema al azar
            const extraRotation = 720; // Agrega rotación adicional para dar la sensación de más giros
            const finalRotation = 360 + (selectedTopicIndex * 90) + extraRotation;


            // Enviar el mensaje con la rotación al backend para que todos los jugadores lo reciban
            sendMessage('/app/spinWheel', JSON.stringify({ gameName, rotation: finalRotation }));

            // También se debe actualizar el tema elegido en el servidor
            const topic = ['Ciencia', 'Geografía', 'Cultura', 'Historia'][selectedTopicIndex];
            sendMessage('/app/topicSelected', JSON.stringify({ gameName, topic }));
        } else {
            alert(`Esperando a que ${currentPlayer} gire la ruleta.`);
        }
    };


    const handleAnswerSubmit = (answer) => {
        if (showQuestion) {
            console.log(`Enviando respuesta: ${answer} para el jugador: ${userName}`);
            sendMessage('/app/submitAnswer', JSON.stringify({
                gameName,
                userName,
                answer
            }));
        }
    };

    return (
        <div className="main-container">
            <div className={`lobby-container ${isGameStarted ? 'lobby-started game-started lobbycontainer tablaLobby' : ''}`}>
                <div className="contlobby">
                    <div className="lobby-content">
                        <h2 className="lobby-title">Lobby para {gameName}</h2>
                        <p className="lobby-subtitle">Usuarios en el lobby:</p>
                        <ul className="user-list">
                            {users.length > 0 ? (
                                users.map((user, index) => (
                                    <li key={index} className="user-item">{user}</li>
                                ))
                            ) : (
                                <p className="no-users">No hay usuarios aún :(</p>
                            )}
                        </ul>

                        {!isGameStarted && users.length >= 2 && (
                            <button className="start-game-button" onClick={handleStartGame}>Comenzar Juego</button>
                        )}
                    </div>
                </div>

                {isGameStarted && (
                    <div className="game-info">
                        <div className="game-container">
                            <h3 className="current-player">Jugador Actual: {currentPlayer}</h3>
                            <Wheel onSpinComplete={(topic) => {
                                setSelectedTopic(topic);
                                sendMessage('/app/topicSelected', JSON.stringify({ gameName, topic }));
                            }} rotation={rotation} />
                            {currentPlayer === userName && (
                                <button onClick={handleSpinWheel}>Girar Ruleta</button>
                            )}
                        </div>
                        <div className="scoreboard-container">
                            <ScoreBoard scores={scores} />
                        </div>

                        {showTopicSelected && <p className="topic-selected">Tema seleccionado: {selectedTopic}</p>}

                        {showQuestion && currentQuestion && (
                            <div className="question-container">
                                <h4 className="category-title">Categoría: {currentQuestion.category}</h4>
                                <p className="question-text">{currentQuestion.questionText}</p>
                                {currentQuestion.options.map((option, idx) => (
                                    <button key={idx} className="option-button" onClick={() => handleAnswerSubmit(option)}>
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lobby;