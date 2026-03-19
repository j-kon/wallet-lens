import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import TransactionPage from './pages/TransactionPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tx/:txid" element={<TransactionPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
