import React from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { Search } from 'lucide-react';

export default function Admin() {
  const { players, loading, updateChips } = useLeaderboard();
  const [search, setSearch] = React.useState('');

  const filteredPlayers = players.filter(p => 
    p.abbreviation.toLowerCase().includes(search.toLowerCase()) || 
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0B1320] bg-stripes text-white p-4 sm:p-8 font-sans selection:bg-[#F4D03F] selection:text-black">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex flex-col animate-in slide-in-from-left-4 duration-500">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-gold-gradient tracking-widest leading-tight">
            CHIP COMMAND
          </h1>
          <div className="h-[2px] w-32 bg-gradient-to-r from-[#F4D03F] to-transparent mt-2"></div>
        </div>
        
        <div className="relative w-full md:w-80 animate-in slide-in-from-right-4 duration-500">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
          <input 
            placeholder="SEARCH PLAYER..." 
            className="w-full bg-[#0A0F1A] border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#F4D03F]/50 focus:ring-1 focus:ring-[#F4D03F]/50 rounded-lg py-3 pl-12 pr-4 text-xs font-bold tracking-widest uppercase transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-8 duration-700 fade-in">
        {filteredPlayers.map((player) => (
          <div 
            key={player.id} 
            className="bg-[#0A0F1A]/80 border border-white/5 rounded-xl p-5 md:p-6 flex flex-col gap-6 backdrop-blur-sm shadow-xl hover:border-white/10 transition-colors"
          >
            {/* Player Info Row */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center shrink-0 w-12 h-12 rounded-full border border-white/20 text-[#F4D03F] text-sm font-bold tracking-wider">
                  {player.abbreviation}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-white text-base tracking-wide uppercase">
                    {player.fullName}
                  </h3>
                  <span className="text-slate-500 text-[10px] font-bold tracking-widest uppercase mt-0.5">
                    UID: {(player.id || '0000').substring(0, 4).toUpperCase()}-ALPHA
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className="text-[#F4D03F] text-[9px] font-bold tracking-[0.2em] uppercase mb-1">
                  Balance
                </span>
                <span className="text-2xl md:text-3xl font-serif font-bold text-white tabular-nums leading-none">
                  {player.chips}
                </span>
              </div>
            </div>

            {/* Buttons Row 1 */}
            <div className="flex gap-3">
              <button 
                onClick={() => updateChips(player.id, -1)}
                className="flex-1 bg-[#1A2234] hover:bg-[#252F44] border border-white/10 text-white text-[10px] md:text-xs font-bold tracking-widest uppercase py-3 rounded-md transition-colors active:scale-95"
              >
                Subtract
              </button>
              <button 
                onClick={() => updateChips(player.id, 1)}
                className="flex-1 bg-[#F4D03F] hover:bg-[#FFE57F] text-black text-[10px] md:text-xs font-bold tracking-widest uppercase py-3 rounded-md shadow-[0_0_15px_rgba(244,208,63,0.2)] hover:shadow-[0_0_20px_rgba(244,208,63,0.4)] transition-all active:scale-95"
              >
                Add Chips
              </button>
            </div>

            {/* Buttons Row 2 */}
            <div className="flex gap-3">
              <button 
                onClick={() => updateChips(player.id, 2)}
                className="flex-1 bg-transparent hover:bg-[#F4D03F]/10 border border-[#F4D03F]/30 text-[#F4D03F] text-[10px] md:text-xs font-bold tracking-widest uppercase py-2.5 rounded-md transition-colors active:scale-95"
              >
                +2
              </button>
              <button 
                onClick={() => updateChips(player.id, -1)}
                className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white text-[10px] md:text-xs font-bold tracking-widest uppercase py-2.5 rounded-md transition-colors active:scale-95"
              >
                -1
              </button>
            </div>
            
          </div>
        ))}

        {filteredPlayers.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-500">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm font-bold tracking-widest uppercase">No players found</p>
          </div>
        )}
      </div>
      
      <div className="mt-16 text-center">
        <span className="inline-block bg-white text-black text-[9px] md:text-xs font-black tracking-[0.25em] px-8 py-3 rounded uppercase">
          Escoteiros de Mem Martins
        </span>
      </div>

    </div>
  );
}
