import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import BlockPage from './pages/BlockPage';
import TransactionPage from './pages/TransactionPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/address/:address" element={<Home />} />
      <Route path="/tx/:txid" element={<TransactionPage />} />
      <Route path="/block/:blockId" element={<BlockPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
