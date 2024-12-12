import React, { useState } from 'react';

const JoinGame = () => {
    const [playerName, setPlayerName] = useState('');

    const handleJoinGame = () => {
        alert(`Joining as ${playerName}`);
        setPlayerName('');
    };

    return (
        <div>
            <h2>Join a Game</h2>
            <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
            />
            <button onClick={handleJoinGame}>Join</button>
        </div>
    );
};

export default JoinGame;
