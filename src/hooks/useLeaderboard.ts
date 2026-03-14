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
 */
const parseCSV = (csv: string): Player[] => {
  if (!csv) return [];

  const lines = csv.trim().split(/\r?\n/).filter(line => line.trim() !== "");
  const dataLines = lines.slice(1); // Skip header row

  return dataLines.map((line, index) => {
    const [fullName, abbreviation, tableName, chips] = line.split(',');
    
    return {
      id: (index + 1).toString(), 
      fullName: fullName?.trim() || "",
      abbreviation: abbreviation?.trim() || "",
      tableName: tableName?.trim() || "",
      chips: parseInt(chips?.trim(), 10) || 0
    };
  });
};

const mockInitialData: Player[] = parseCSV(csvRaw);

export function useLeaderboard() {
  const [players, setPlayers] = useState<Player[]>(mockInitialData);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  // --- EFFECT 1: SYNC CSV TO FIRESTORE ---
  // This runs once on load and forces Firestore to match the CSV exactly
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const syncCsvToFirestore = async () => {
      try {
        const promises = mockInitialData.map((player) => 
          setDoc(doc(db, 'players', player.id), player)
        );
        await Promise.all(promises);
        console.log("Firestore successfully synced with CSV data.");
      } catch (error) {
        console.error("Error syncing CSV to Firestore:", error);
      }
    };

    syncCsvToFirestore();
  }, []); // Only runs once

  // --- EFFECT 2: REAL-TIME LISTENER ---
  // This listens for any changes (like manual chip updates) and updates the UI
  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.log("Firebase not configured. Using local CSV data.");
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'players'), (snapshot) => {
      const dbPlayers: Player[] = [];
      snapshot.forEach((doc) => {
        dbPlayers.push({ ...doc.data(), id: doc.id } as Player);
      });

      // Sort players by chips (Descending) so the leader is at the top
      const sortedPlayers = dbPlayers.sort((a, b) => b.chips - a.chips);
      
      setPlayers(sortedPlayers.length > 0 ? sortedPlayers : mockInitialData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateChips = async (playerId: string, difference: number) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const newScore = Math.max(0, player.chips + difference);

    // Local state fallback if Firebase isn't working
    if (!isFirebaseConfigured) {
      setPlayers((prev) =>
        prev.map(p => p.id === playerId ? { ...p, chips: newScore } : p)
            .sort((a, b) => b.chips - a.chips)
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
