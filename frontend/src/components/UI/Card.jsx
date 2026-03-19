import { cn } from '../../utils/cn';

function Card({ children, className }) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-panel backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Card;
