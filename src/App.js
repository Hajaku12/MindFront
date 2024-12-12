import React, { useState } from 'react';
import UserNameInput from './components/UserNameInput';
import CreateGame from './components/CreateGame';
import GameList from './components/GameList';
import Lobby from './components/Lobby';
import TriviaGame from './components/TriviaGame';

function App() {
    const [userName, setUserName] = useState('');
    const [isUserNameSet, setIsUserNameSet] = useState(false);
    const [selectedGame, setSelectedGame] = useState(null);
    const [gameStarted, setGameStarted] = useState(false);

    const handleUserNameSubmit = (name) => {
        setUserName(name);
        setIsUserNameSet(true);
    };

    const handleGameSelection = (gameName) => {
        setSelectedGame(gameName);
    };

    const handleStartGame = () => {
        setGameStarted(true);
    };

    return (
        <div>
            {!isUserNameSet ? (
                <UserNameInput onSubmit={handleUserNameSubmit} />
            ) : (
                <div>
                    {!selectedGame ? (
                        <>
                            <CreateGame userName={userName} />
                            <GameList userName={userName} onSelectGame={handleGameSelection} />
                        </>
                    ) : !gameStarted ? (
                        <Lobby gameName={selectedGame} userName={userName} onStartGame={handleStartGame} />
                    ) : (
                        <TriviaGame gameName={selectedGame} userName={userName} />
                    )}
                </div>
            )}
        </div>
    );
}

export default App;