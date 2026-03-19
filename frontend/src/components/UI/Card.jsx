import { cn } from '../../utils/cn';

function Card({ children, className }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(19,25,35,0.96),rgba(9,13,20,0.9))] shadow-[0_18px_48px_rgba(3,7,18,0.42),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(142,178,198,0.05),transparent_28%)] before:opacity-90 after:pointer-events-none after:absolute after:inset-px after:rounded-[29px] after:border after:border-white/[0.035]',
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default Card;
