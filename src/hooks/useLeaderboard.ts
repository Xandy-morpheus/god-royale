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
  { id: "1", fullName: "Alexandre Filipe Santos", abbreviation: "AFS", tableName: "Alexandre F. S.", chips: 30 },
  { id: "2", fullName: "Pedro Figueira", abbreviation: "PF", tableName: "Pedro F.", chips: 25 },
  { id: "3", fullName: "Beatriz Freire", abbreviation: "BF", tableName: "Beatriz F.", chips: 31 },
  { id: "4", fullName: "Daniel Santos", abbreviation: "DS-1", tableName: "Daniel S.", chips: 20 },
  { id: "5", fullName: "Dário Silva", abbreviation: "DS-2", tableName: "Dário S.", chips: 10 },
  { id: "6", fullName: "Daniel João Santos", abbreviation: "DJS", tableName: "Daniel J. S.", chips: 10 },
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
      
      // se não houver dados, inicializar com o mock data
      if (dbPlayers.length === 0) {
        mockInitialData.forEach(async (p) => {
          await setDoc(doc(db, 'players', p.id), p);
        });
      } else {
        setPlayers(dbPlayers);
      }
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
