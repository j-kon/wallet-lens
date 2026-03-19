import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import TransactionCard from './TransactionCard';
import EmptyState from './UI/EmptyState';
import Badge from './UI/Badge';
import Card from './UI/Card';
import { InlineSpinner, Loader } from './UI/Loader';

function TransactionList({
  transactions,
  onSelectTransaction,
  selectedTransactionId,
  loading,
}) {
  return (
    <Card className="p-6 lg:p-7">
      <div className="flex flex-col gap-4 border-b border-white/6 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Transaction History</p>
          <h2 className="mt-2 font-display text-2xl text-slate-50">Address activity timeline</h2>
          <p className="mt-2 text-sm text-slate-400">
            Net values are calculated relative to the searched address, including change outputs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loading ? <InlineSpinner /> : null}
          <Badge variant="accent">{transactions.length} entries</Badge>
        </div>
      </div>

      {loading && transactions.length === 0 ? (
        <Loader className="pt-6" label="Loading transactions..." />
      ) : transactions.length === 0 ? (
        <div className="pt-6">
          <EmptyState
            icon={Activity}
            title="No transaction history found"
            description="This address has no transaction history yet"
          />
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.06,
              },
            },
          }}
          className="mt-6 space-y-3"
        >
          {transactions.map((transaction) => (
            <motion.div
              key={transaction.txid}
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              <TransactionCard
                transaction={transaction}
                onSelect={onSelectTransaction}
                selected={selectedTransactionId === transaction.txid}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </Card>
  );
}

export default TransactionList;
