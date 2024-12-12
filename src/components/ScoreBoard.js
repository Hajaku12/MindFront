import React, { useState, useEffect } from 'react';
import { getScores } from '../services/ScoreService';

const ScoreBoard = ({ scores }) => {
    return (
        <div>
            <h1>Score Board</h1>
            <ul>
                {Object.entries(scores).map(([playerName, score]) => (
                    <li key={playerName}>{playerName}: {score}</li>
                ))}
            </ul>
        </div>
    );
};

export default ScoreBoard;