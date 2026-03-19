import { Cpu, Radar } from 'lucide-react';
import Badge from './UI/Badge';

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[rgba(6,9,15,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-halo">
            <Radar className="h-5 w-5 text-brand-amber" />
          </div>
          <div>
            <p className="font-display text-lg tracking-tight text-slate-50">WalletLens</p>
            <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500">
              BDK Companion Explorer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300 md:flex">
            <Cpu className="h-3.5 w-3.5 text-brand-sky" />
            Esplora-driven wallet telemetry
          </div>
          <Badge variant="testnet">Testnet</Badge>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
