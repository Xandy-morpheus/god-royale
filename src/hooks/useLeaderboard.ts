import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';
// Importing the file as a raw string
import csvRaw from './Competidores - Sheet1.csv?raw';

export interface Player {
  id: string;
  fullName: string;
  abbreviation: string;
  tableName: string;
  chips: number;
}

/**
 * Helper to transform CSV string to Player array
 * Handles both \n and \r\n line endings
 */
const parseCSV = (csv: string): Player[] => {
  if (!csv) return [];

  // Split by newline, then filter out any empty lines
  const lines = csv.trim().split(/\r?\n/).filter(line => line.trim() !== "");
  const dataLines = lines.slice(1); // Skip header row

  return dataLines.map((line, index) => {
    const [fullName, abbreviation, tableName, chips] = line.split(',');
    
    return {
      // Using index + 1 as ID. Ensure this matches your Firestore document IDs!
      id: (index + 1).toString(), 
      fullName: fullName?.trim() || "",
      abbreviation: abbreviation?.trim() || "",
      tableName: tableName?.trim() || "",
      chips: parseInt(chips?.trim(), 10) || 0
    };
  });
};

// Now mockInitialData is derived directly from your actual .csv file
const mockInitialData: Player[] = parseCSV(csvRaw);

export function useLeaderboard() {
  const [players, setPlayers] = useState<Player[]>(mockInitialData);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.log("Firebase not configured. Using data from CSV file.");
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'players'), (snapshot) => {
      const dbPlayers: Player[] = [];
      snapshot.forEach((doc) => {
        dbPlayers.push({ ...doc.data(), id: doc.id } as Player);
      });

      // Sync Firestore: If a player from the CSV doesn't exist in DB, create them
      mockInitialData.forEach(async (mockPlayer) => {
        if (!dbPlayers.some(dbP => dbP.id === mockPlayer.id)) {
          await setDoc(doc(db, 'players', mockPlayer.id), mockPlayer);
        }
      });

      // Update state with DB data, falling back to CSV if DB is empty
      setPlayers(dbPlayers.length > 0 ? dbPlayers : mockInitialData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateChips = async (playerId: string, difference: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const newScore = Math.max(0, player.chips + difference);

    if (!isFirebaseConfigured) {
      setPlayers((prev) =>
        prev.map(p => p.id === playerId ? { ...p, chips: newScore } : p)
      );
      return;
    }

    try {
      await updateDoc(doc(db, 'players', playerId), { chips: newScore });
    } catch (error) {
      console.error("Error updating player in Firestore:", error);
    }
  };

  return { players, loading, updateChips, isFirebaseConfigured };
}
