import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

export interface Player {
  id: string;
  fullName: string;
  abbreviation: string;
  tableName: string;
  chips: number;
}

const mockInitialData: Player[] = [
  { id: "1", fullName: "Alexandre Santos", abbreviation: "AS", tableName: "Alexandre S.", chips: 15 },
  { id: "2", fullName: "Pedro Figueira", abbreviation: "PF", tableName: "Pedro F.", chips: 14 },
  { id: "3", fullName: "Beatriz Freire", abbreviation: "BF", tableName: "Beatriz F.", chips: 13 },
  { id: "4", fullName: "Daniel Santos", abbreviation: "DS", tableName: "Daniel S.", chips: 12 },
  { id: "5", fullName: "João Miranda", abbreviation: "JM", tableName: "João M.", chips: 11 },
  { id: "6", fullName: "Mariana Coelho", abbreviation: "MC", tableName: "Mariana C.", chips: 10 },
  { id: "7", fullName: "Daniela Lopes", abbreviation: "DL", tableName: "Daniela L.", chips: 10 },
  { id: "8", fullName: "Maria Belo", abbreviation: "MB", tableName: "Maria B.", chips: 10 },
  { id: "9", fullName: "Marta Ferreira", abbreviation: "MF", tableName: "Marta F.", chips: 10 },
  { id: "10", fullName: "André Camões", abbreviation: "AC", tableName: "André C.", chips: 10 },
];


export function useLeaderboard() {
  const [players, setPlayers] = useState<Player[]>(mockInitialData);
  const [loading, setLoading] = useState(!isFirebaseConfigured ? false : true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.log("Firebase not configured. Using local mock data.");
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'players'), (snapshot) => {
      const dbPlayers: Player[] = [];
      snapshot.forEach((doc) => {
        dbPlayers.push({ id: doc.id, ...doc.data() } as Player);
      });

      // Add any missing players from mockInitialData to Firestore
      const missingPlayers = mockInitialData.filter(
        mockPlayer => !dbPlayers.some(dbPlayer => dbPlayer.id === mockPlayer.id)
      );

      if (missingPlayers.length > 0) {
        missingPlayers.forEach(async (p) => {
          await setDoc(doc(db, 'players', p.id), p);
        });
      }

      setPlayers(dbPlayers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateChips = async (playerId: string, difference: number) => {
    if (!isFirebaseConfigured) {
      setPlayers((prev) =>
        prev.map(p => p.id === playerId ? { ...p, chips: Math.max(0, p.chips + difference) } : p)
      );
      return;
    }

    const player = players.find(p => p.id === playerId);
    if (!player) return;

    const newScore = Math.max(0, player.chips + difference); // previne fichas negativas se for a regra

    try {
      await updateDoc(doc(db, 'players', playerId), {
        chips: newScore
      });
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  return { players, loading, updateChips, isFirebaseConfigured };
}
