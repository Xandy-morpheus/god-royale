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
  { id: "7", fullName: "Márcia Tavares", abbreviation: "MT", tableName: "Márcia T.", chips: 10 },
  { id: "8", fullName: "Flávia Sales", abbreviation: "FS", tableName: "Flávia S.", chips: 10 },
  { id: "9", fullName: "Edna Morais", abbreviation: "EM", tableName: "Edna M.", chips: 10 },
  { id: "10", fullName: "Emerson Amorim", abbreviation: "EA", tableName: "Emerson A.", chips: 10 },
  { id: "11", fullName: "Heitor da Silva", abbreviation: "HdS", tableName: "Heitor d. S.", chips: 10 },
  { id: "12", fullName: "Carla Macedo", abbreviation: "CM-1", tableName: "Carla M.", chips: 10 },
  { id: "13", fullName: "Camila de Matos", abbreviation: "CdM", tableName: "Camila d. M.", chips: 10 },
  { id: "14", fullName: "Davi da Fonseca", abbreviation: "DdF", tableName: "Davi d. F.", chips: 10 },
  { id: "15", fullName: "Valentina Duarte", abbreviation: "VD", tableName: "Valentina D.", chips: 10 },
  { id: "16", fullName: "Vera de Azevedo", abbreviation: "VdA", tableName: "Vera d. A.", chips: 10 },
  { id: "17", fullName: "Rafaela da Cruz", abbreviation: "RdC", tableName: "Rafaela d. C.", chips: 10 },
  { id: "18", fullName: "Guilherme Farias", abbreviation: "GF", tableName: "Guilherme F.", chips: 10 },
  { id: "19", fullName: "Natália Braga", abbreviation: "NB", tableName: "Natália B.", chips: 10 },
  { id: "20", fullName: "Luciana do Carmo", abbreviation: "LdC", tableName: "Luciana d. C.", chips: 10 },
  { id: "21", fullName: "Marcos Miranda", abbreviation: "MM", tableName: "Marcos M.", chips: 10 },
  { id: "22", fullName: "Caroline de Castro", abbreviation: "CdC", tableName: "Caroline d. C.", chips: 10 },
  { id: "23", fullName: "Pablo de Oliveira", abbreviation: "PdO", tableName: "Pablo d. O.", chips: 10 },
  { id: "24", fullName: "Cristiane Martins", abbreviation: "CM-2", tableName: "Cristiane M.", chips: 10 },
  { id: "25", fullName: "Janaína Lopes", abbreviation: "JL", tableName: "Janaína L.", chips: 10 },
  { id: "26", fullName: "José de Moura", abbreviation: "JdM", tableName: "José d. M.", chips: 10 },
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
