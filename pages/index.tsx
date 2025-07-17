import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { NextPage } from 'next';

interface VoteResults {
  reactionCounts: { [key: string]: number };
  voters: { [key: string]: string[] };
  timestamp: number;
}

interface NoVoteResults {
  reactionCounts: { [key: string]: number };
  voters: { [key: string]: string[] };
  timestamp: number;
}

const firebaseConfig = {
  // Replace with your Firebase config from Firebase Studio (if not using environment variables)
  apiKey: "AIzaSyD3FvJeVGcm_nXdfrnqbuKTPrR_7vZLxNg",
  authDomain: "reconnaissance-automation.firebaseapp.com",
  projectId: "reconnaissance-automation",
  storageBucket: "reconnaissance-automation.firebasestorage.app",
  messagingSenderId: "854844428975",
  appId: "1:854844428975:web:9f88578eeb930df553ba5a"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

const Home: NextPage = () => {
  const [data, setData] = useState<{ activeRoster: string[]; voteResults: VoteResults | { message: string } }>({ activeRoster: [], voteResults: { message: 'No recent vote results available.' } });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://us-central1-reconnaissance-automation.cloudfunctions.net/api');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Type guard to check if voteResults is of type VoteResults
  const isVoteResults = (results: VoteResults | { message: string }): results is VoteResults => {
    return (results as VoteResults).reactionCounts !== undefined && (results as VoteResults).voters !== undefined && (results as VoteResults).timestamp !== undefined;
  };
  return (
    <div className="min-h-screen bg-[#1B4D3E] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Reconnaissance Sniper Unit Dashboard</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Active Roster</h2>
          <div className="bg-[#2A3D33] p-4 rounded-lg shadow-lg">
            <ul className="list-disc pl-6">
              {data.activeRoster.map((user, index) => (
                <li key={index} className="mb-2">{user}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Event Voting Results</h2>
          <div className="bg-[#2A3D33] p-4 rounded-lg shadow-lg overflow-x-auto">
            {isVoteResults(data.voteResults) ? (
              <>
                <ul className="list-none mb-4">
                  {Object.entries(data.voteResults.reactionCounts || {}).map(([emoji, count]) => {

                    const event = EVENT_LIST.find(e => e.emoji === emoji);
                    return event && (
                      <li key={emoji} className="mb-2">
                        {event?.name}: {count} vote{count === 1 ? '' : 's'}
                      </li>
                    );
                  })}
                </ul>
                <p className="text-sm">
                  Voters: {Object.entries(data.voteResults.voters || {}) // Assuming voters is an object of emoji to list of voter names
                    .filter(([_, voters]: [string, string[]]) => voters.length)
                    .map(([emoji, voters]) => `${emoji}: ${voters.join(', ')}`)
                    .join(' | ') || 'No votes recorded.'}
                </p>
                <p className="text-sm mt-2">Last updated: {new Date(data.voteResults.timestamp).toLocaleString()}</p>
              </>
            ) : (
              <p>{data.voteResults.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EVENT_LIST = [
  { name: 'RT - Recon Riot', emoji: '🎯' },
  { name: 'RP - Recon Printing', emoji: '🖨️' },
  { name: 'CT - Combat Training', emoji: '⚔️' },
  { name: 'JCE - Joint City Event', emoji: '🏙️' },
  { name: 'JCT - Joint Combat Training', emoji: '🛡️' },
  { name: 'Gamenight', emoji: '🎮' }
];

export default Home;