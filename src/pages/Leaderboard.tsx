import { useEffect, useRef } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';

export default function Leaderboard() {
  const { players, loading } = useLeaderboard();
  const prevRanks = useRef<Record<string, number>>({});

  // Sort players by chips descending
  const sortedPlayers = [...players].sort((a, b) => b.chips - a.chips);
  
  // Limiting the leaderboard to strictly the Top 10
  const top10Players = sortedPlayers.slice(0, 10);

  useEffect(() => {
    if (players.length === 0 || loading) return;
    
    let someoneClimbed = false;

    sortedPlayers.forEach((player, index) => {
      const prevRank = prevRanks.current[player.id];
      // If we already had a rank for this player, and their new rank index is lower (better rank)
      if (prevRank !== undefined && index < prevRank) {
        someoneClimbed = true;
      }
    });

    // Update their current rank in the ref for the next comparison
    sortedPlayers.forEach((player, index) => {
      prevRanks.current[player.id] = index;
    });

    if (someoneClimbed) {
      playAccomplishmentSound();
    }
  }, [players, loading]);

  const playAccomplishmentSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playFreq = (freq: number, startTime: number, duration: number) => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(freq, startTime);
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioCtx.currentTime;
      playFreq(440.00, now, 0.2);        // A4
      playFreq(554.37, now + 0.15, 0.2); // C#5
      playFreq(659.25, now + 0.3, 0.4);  // E5
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };


  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#16325B] bg-stripes text-white p-2 sm:p-4 flex flex-col items-center font-sans selection:bg-[#F4D03F] selection:text-black">
      
      {/* Reduced sizes and margins for header */}
      <div className="mt-4 mb-6 text-center flex flex-col items-center animate-in slide-in-from-top-4 duration-700 fade-in">
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-gold-gradient tracking-widest drop-shadow-xl mb-2 leading-none">
          G.O.D
        </h1>
        <h2 className="text-2xl md:text-3xl font-serif text-[#F4D03F] tracking-[0.4em] mb-4 text-shadow-sm">
          ROYALE
        </h2>
        
        <div className="flex items-center justify-center w-full max-w-sm mb-2">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#CD8500]/50 to-transparent w-full"></div>
          <p className="px-4 text-[#CD8500] font-semibold tracking-[0.4em] text-[10px] md:text-xs uppercase whitespace-nowrap">
            Top 10 Tabela
          </p>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#CD8500]/50 to-transparent w-full"></div>
        </div>
      </div>

      <div className="w-full max-w-5xl rounded-xl overflow-hidden bg-[#0A0F1A]/80 border border-white/5 backdrop-blur-sm shadow-2xl">
        <div className="grid grid-cols-[60px_1fr_100px] md:grid-cols-[80px_1fr_150px] gap-3 p-3 md:px-6 md:py-4 border-b border-white/10 text-[9px] md:text-xs font-black tracking-[0.2em] text-[#F4D03F] uppercase">
          <div className="text-center">Posição</div>
          <div>Jogador</div>
          <div className="text-right">Fichas</div>
        </div>

        <div className="flex flex-col">
          {top10Players.map((player, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;
            const isThird = index === 2;

            // Shiny styles mapping
            let rankColorClass = 'text-slate-400';
            let circleBorderClass = 'text-slate-300 border-white/20';
            let badgeText = '';

            if (isFirst) {
               rankColorClass = 'text-[#F4D03F]';
               circleBorderClass = 'text-[#F4D03F] border-[#F4D03F]';
               badgeText = '🥇';
            } else if (isSecond) {
               // Silver shiny
               rankColorClass = 'text-transparent bg-clip-text bg-gradient-to-br from-slate-200 via-slate-400 to-slate-300';
               circleBorderClass = 'text-slate-300 border-slate-300 shadow-[0_0_5px_rgba(148,163,184,0.3)]';
               badgeText = '🥈';
            } else if (isThird) {
               // Bronze shiny
               rankColorClass = 'text-transparent bg-clip-text bg-gradient-to-br from-[#CD7F32] via-[#b87333] to-[#8c5726]';
               circleBorderClass = 'text-[#CD7F32] border-[#CD7F32] shadow-[0_0_5px_rgba(205,127,50,0.3)]';
               badgeText = '🥉';
            }

            return (
              <div 
                key={player.id} 
                className={`grid grid-cols-[60px_1fr_100px] md:grid-cols-[80px_1fr_150px] gap-3 items-center p-3 md:px-6 md:py-4 border-b border-white/5 transition-colors duration-200 hover:bg-white/10 ${index % 2 === 0 ? 'bg-white/[0.015]' : 'bg-transparent'}`}
                style={{
                  animation: `slide-up 0.5s ease-out ${index * 0.05}s both`
                }}
              >
                <div className={`text-center text-xl md:text-3xl font-bold font-serif ${rankColorClass}`}>
                  {(index + 1).toString()}
                </div>
                
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`flex items-center justify-center shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full border text-[10px] md:text-xs font-bold ${circleBorderClass}`}>
                    {player.abbreviation}
                  </div>
                  <div className="flex items-center flex-wrap gap-2 md:gap-3">
                    <h2 className="text-base md:text-xl font-bold text-white tracking-wide">
                      {player.tableName || player.fullName}
                    </h2>
                    {(isFirst || isSecond || isThird) && (
                      <span className="text-xl md:text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] shrink-0 self-center leading-none" title={`${index + 1}º Lugar`}>
                        {badgeText}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`text-right text-lg md:text-2xl font-black tabular-nums tracking-wider ${isFirst ? 'text-[#F4D03F]' : (isSecond ? 'text-slate-300' : (isThird ? 'text-[#CD7F32]' : 'text-white'))}`}>
                  {player.chips.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 mb-4 bg-white text-black text-[8px] md:text-[10px] font-black tracking-[0.25em] px-6 py-2 rounded uppercase">
        Escoteiros de Mem Martins
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
