import { motion } from 'framer-motion';
import { ArrowDownToLine, ArrowUpFromLine, Landmark, Rows3 } from 'lucide-react';
import { formatBTC, formatSats } from '../utils/formatBTC';
import Card from './UI/Card';

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.06,
      duration: 0.34,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function SummaryCards({ summary }) {
  const cards = [
    {
      title: 'Balance',
      value: formatBTC(summary.balance),
      helper: `Confirmed ${formatBTC(summary.confirmedBalance)} • Mempool ${formatBTC(summary.pendingBalance, { signed: true })}`,
      icon: Landmark,
      tone: 'text-brand-amber',
    },
    {
      title: 'Total Received',
      value: formatBTC(summary.totalReceived),
      helper: formatSats(summary.totalReceived),
      icon: ArrowDownToLine,
      tone: 'text-emerald-300',
    },
    {
      title: 'Total Sent',
      value: formatBTC(summary.totalSent),
      helper: formatSats(summary.totalSent),
      icon: ArrowUpFromLine,
      tone: 'text-rose-300',
    },
    {
      title: 'Transaction Count',
      value: new Intl.NumberFormat('en-US').format(summary.transactionCount),
      helper: `${summary.confirmedTransactions} confirmed • ${summary.pendingTransactions} pending`,
      icon: Rows3,
      tone: 'text-brand-sky',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ title, value, helper, icon: Icon, tone }, index) => (
        <motion.div
          key={title}
          custom={index}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
        >
          <Card className="h-full p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{title}</p>
                <p className="mt-4 font-display text-3xl tracking-tight text-slate-50">{value}</p>
              </div>
              <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-3 ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-400">{helper}</p>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export default SummaryCards;
