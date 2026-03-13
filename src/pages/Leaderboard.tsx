import { useLeaderboard } from '../hooks/useLeaderboard';

export default function Leaderboard() {
  const { players, loading } = useLeaderboard();

  // Sort players by chips descending
  const sortedPlayers = [...players].sort((a, b) => b.chips - a.chips);

  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0B1320] bg-stripes text-white p-4 sm:p-8 flex flex-col items-center font-sans selection:bg-[#F4D03F] selection:text-black">
      
      <div className="mt-8 mb-12 text-center flex flex-col items-center animate-in slide-in-from-top-4 duration-700 fade-in">
        <h1 className="text-7xl md:text-[8rem] font-serif font-bold text-gold-gradient tracking-widest drop-shadow-xl mb-4 leading-none">
          G.O.D
        </h1>
        <h2 className="text-3xl md:text-5xl font-serif text-[#F4D03F] tracking-[0.4em] mb-10 text-shadow-sm">
          ROYALE
        </h2>
        
        <div className="flex items-center justify-center w-full max-w-lg mb-4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#CD8500]/50 to-transparent w-full"></div>
          <p className="px-6 text-[#CD8500] font-semibold tracking-[0.4em] text-sm md:text-base uppercase whitespace-nowrap">
            Leaderboard
          </p>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#CD8500]/50 to-transparent w-full"></div>
        </div>
      </div>

      <div className="w-full max-w-5xl rounded-xl overflow-hidden bg-[#0A0F1A]/80 border border-white/5 backdrop-blur-sm shadow-2xl">
        <div className="grid grid-cols-[80px_1fr_120px] md:grid-cols-[100px_1fr_180px] gap-4 p-4 md:px-8 md:py-6 border-b border-white/10 text-[10px] md:text-xs font-black tracking-[0.2em] text-[#F4D03F] uppercase">
          <div className="text-center">Rank</div>
          <div>Player</div>
          <div className="text-right">Chip Count</div>
        </div>

        <div className="flex flex-col">
          {sortedPlayers.map((player, index) => {
            const isFirst = index === 0;
            return (
              <div 
                key={player.id} 
                className={`grid grid-cols-[80px_1fr_120px] md:grid-cols-[100px_1fr_180px] gap-4 items-center p-4 md:px-8 md:py-5 border-b border-white/5 transition-colors duration-200 hover:bg-white/10 ${index % 2 === 0 ? 'bg-white/[0.015]' : 'bg-transparent'}`}
                style={{
                  animation: `slide-up 0.5s ease-out ${index * 0.05}s both`
                }}
              >
                <div className={`text-center text-2xl md:text-4xl font-bold font-serif ${isFirst ? 'text-[#F4D03F]' : 'text-slate-400'}`}>
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                
                <div className="flex items-center gap-3 md:gap-5">
                  <div className={`flex items-center justify-center shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 text-xs md:text-sm font-bold ${isFirst ? 'text-[#F4D03F] border-[#F4D03F]' : 'text-slate-300'}`}>
                    {player.abbreviation}
                  </div>
                  <div className="flex items-center flex-wrap gap-2 md:gap-4">
                    <h2 className="text-lg md:text-2xl font-bold text-white tracking-wide">
                      {player.tableName || player.fullName}
                    </h2>
                    {isFirst && (
                      <span className="bg-[#F4D03F] text-black text-[9px] md:text-[10px] font-black px-2 py-1 md:px-2.5 md:py-1 rounded-[4px] tracking-widest leading-none shrink-0 self-center">
                        LEGENDARY
                      </span>
                    )}
                  </div>
                </div>

                <div className={`text-right text-xl md:text-3xl font-black tabular-nums tracking-wider ${isFirst ? 'text-[#F4D03F]' : 'text-white'}`}>
                  {player.chips.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-16 bg-white text-black text-[9px] md:text-xs font-black tracking-[0.25em] px-8 py-3 rounded uppercase">
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
