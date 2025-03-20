'use client';

import { useState } from 'react';

export default function CreateTournament() {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [clockTime, setClockTime] = useState(5);
  const [clockIncrement, setClockIncrement] = useState(0);
  const [minutes, setMinutes] = useState(60);
  const [waitMinutes, setWaitMinutes] = useState(5);
  const [variant, setVariant] = useState('standard');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleCreateTournament() {
    if (!name) {
      setError('Tournament name is required');
      return;
    }

    setIsCreating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('/api/create-tournament', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          clockTime,
          clockIncrement,
          minutes,
          waitMinutes,
          variant
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create tournament');
      }
      
      console.log('Tournament created:', data);
      setSuccess(`Tournament created! It will start in ${waitMinutes} minutes.`);
      
      // Optionally redirect to the tournament
      if (data.url) {
        // Either redirect immediately or show a button
        // window.location.href = data.url;
        setSuccess(`Tournament created! <a href="${data.url}" target="_blank" class="text-blue-600 hover:underline">Open tournament →</a>`);
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
      setError(error instanceof Error ? error.message : 'Failed to create tournament');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create a Tournament</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded" 
             dangerouslySetInnerHTML={{ __html: success }}>
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tournament Name</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for your tournament"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Clock Time (minutes)</label>
          <input
            type="number"
            min="1"
            max="20"
            className="w-full p-2 border rounded"
            value={clockTime}
            onChange={(e) => setClockTime(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Increment (seconds)</label>
          <input
            type="number"
            min="0"
            max="60"
            className="w-full p-2 border rounded"
            value={clockIncrement}
            onChange={(e) => setClockIncrement(Number(e.target.value))}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
          <input
            type="number"
            min="20"
            max="360"
            className="w-full p-2 border rounded"
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start in (minutes)</label>
          <input
            type="number"
            min="5"
            max="60"
            className="w-full p-2 border rounded"
            value={waitMinutes}
            onChange={(e) => setWaitMinutes(Number(e.target.value))}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Variant</label>
        <select
          className="w-full p-2 border rounded"
          value={variant}
          onChange={(e) => setVariant(e.target.value)}
        >
          <option value="standard">Standard</option>
          <option value="chess960">Chess960</option>
          <option value="crazyhouse">Crazyhouse</option>
          <option value="antichess">Antichess</option>
          <option value="atomic">Atomic</option>
          <option value="horde">Horde</option>
          <option value="kingOfTheHill">King of the Hill</option>
          <option value="racingKings">Racing Kings</option>
          <option value="threeCheck">Three-check</option>
        </select>
      </div>
      
      <button
        onClick={handleCreateTournament}
        disabled={isCreating}
        className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isCreating ? 'Creating tournament...' : 'Create Tournament'}
      </button>
    </div>
  );
}