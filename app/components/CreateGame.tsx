'use client';

import { useState } from 'react';

export default function CreateGame() {
  const [isCreating, setIsCreating] = useState(false);
  const [timeControl, setTimeControl] = useState('blitz');
  const [minutes, setMinutes] = useState(5);
  const [increment, setIncrement] = useState(0);
  const [color, setColor] = useState('random');
  const [error, setError] = useState<string | null>(null);

  async function handleCreateGame() {
    setIsCreating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/create-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time: minutes,
          increment: increment,
          color: color,
          variant: 'standard',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create game');
      }
      
      console.log('Game created:', data);
      
      // Redirect directly to Lichess
      if (data.url) {
        window.location.href = data.url;
      } else if (data.gameId) {
        window.location.href = `https://lichess.org/${data.gameId}`;
      } else {
        throw new Error('No game URL returned');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      setError(error instanceof Error ? error.message : 'Failed to create game');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create a New Game</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Time Control</label>
        <select
          className="w-full p-2 border rounded"
          value={timeControl}
          onChange={(e) => {
            setTimeControl(e.target.value);
            // Set default values based on time control
            if (e.target.value === 'bullet') {
              setMinutes(1);
              setIncrement(0);
            } else if (e.target.value === 'blitz') {
              setMinutes(5);
              setIncrement(0);
            } else if (e.target.value === 'rapid') {
              setMinutes(10);
              setIncrement(0);
            }
          }}
        >
          <option value="bullet">Bullet</option>
          <option value="blitz">Blitz</option>
          <option value="rapid">Rapid</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Minutes</label>
          <input
            type="number"
            min="1"
            max="180"
            className="w-full p-2 border rounded"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Increment (seconds)</label>
          <input
            type="number"
            min="0"
            max="60"
            className="w-full p-2 border rounded"
            value={increment}
            onChange={(e) => setIncrement(Number(e.target.value))}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Play as</label>
        <select
          className="w-full p-2 border rounded"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        >
          <option value="random">Random</option>
          <option value="white">White</option>
          <option value="black">Black</option>
        </select>
      </div>
      
      <button
        onClick={handleCreateGame}
        disabled={isCreating}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isCreating ? 'Creating game...' : 'Create Game'}
      </button>
    </div>
  );
}