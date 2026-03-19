import { motion } from 'framer-motion';
import { ArrowDownToLine, ArrowUpFromLine, Landmark, Rows3 } from 'lucide-react';
import { formatBTC, formatSats } from '../utils/formatBTC';
import AnimatedValue from './UI/AnimatedValue';
import Card from './UI/Card';
import { hoverLift, listItemReveal, softStagger } from '../utils/motion';

function SummaryCards({ summary }) {
  const cards = [
    {
      title: 'Balance',
      rawValue: summary.balance,
      formatter: (value) => formatBTC(value),
      value: formatBTC(summary.balance),
      helper: `Chain balance ${formatBTC(summary.confirmedBalance)} • Mempool delta ${formatBTC(summary.pendingDelta, { signed: true })}`,
      icon: Landmark,
      tone: 'text-brand-amber',
    },
    {
      title: 'Total Received',
      rawValue: summary.totalReceived,
      formatter: (value) => formatBTC(value),
      value: formatBTC(summary.totalReceived),
      helper: formatSats(summary.totalReceived),
      icon: ArrowDownToLine,
      tone: 'text-emerald-300',
    },
    {
      title: 'Total Sent',
      rawValue: summary.totalSent,
      formatter: (value) => formatBTC(value),
      value: formatBTC(summary.totalSent),
      helper: formatSats(summary.totalSent),
      icon: ArrowUpFromLine,
      tone: 'text-rose-300',
    },
    {
      title: 'Transaction Count',
      rawValue: summary.transactionCount,
      formatter: (value) => new Intl.NumberFormat('en-US').format(value),
      value: new Intl.NumberFormat('en-US').format(summary.transactionCount),
      helper: `${summary.confirmedTransactions} confirmed • ${summary.pendingTransactions} pending`,
      icon: Rows3,
      tone: 'text-brand-sky',
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={softStagger}
      className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map(({ title, rawValue, formatter, helper, icon: Icon, tone }) => (
        <motion.div
          key={title}
          variants={listItemReveal}
          whileHover={hoverLift}
          className="h-full"
        >
          <Card className="h-full p-5 lg:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{title}</p>
                <AnimatedValue
                  value={rawValue}
                  formatter={formatter}
                  className="mt-4 block font-display text-[2rem] tracking-[-0.04em] text-slate-50 lg:text-[2.2rem]"
                />
              </div>
              <div className={`rounded-[20px] border border-white/10 bg-white/[0.05] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">{helper}</p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default SummaryCards;
