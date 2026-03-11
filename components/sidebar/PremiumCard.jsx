import { Sparkles } from 'lucide-react';

export default function PremiumCard() {
  return (
    <div className="mx-4 mb-4 p-4 rounded-2xl bg-gradient-to-br from-gradient-purple-start to-gradient-purple-end text-white">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} />
        <span className="text-xs font-medium opacity-90">Premium</span>
      </div>
      <p className="text-sm font-semibold mb-1">
        Get a Premium Account To Get More Privilege
      </p>
      <button
        className="mt-2 bg-white text-primary text-xs font-semibold py-2 px-4 rounded-lg
          hover:bg-white/90 transition-colors duration-150
          focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
      >
        Get Premium &rsaquo;
      </button>
    </div>
  );
}
