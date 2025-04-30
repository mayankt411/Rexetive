import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import CaseDetailsPage from './pages/CaseDetailsPage';
import ViewSubmissionsPage from './pages/ViewSubmissionsPage';
import MySubmissionsPage from './pages/MySubmissionsPage';
import CaseSynopsisPage from './pages/CaseSynopsisPage';
import CaseLogicPage from './pages/CaseLogicPage';
import CaseHypothesisPage from './pages/CaseHypothesisPage';
import CaseBiasPage from './pages/CaseBiasPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { Box } from '@radix-ui/themes';
import './App.css';
import SubmissionDetailsPage from './pages/SubmissionDetailsPage';
import ViewCasesPage from './pages/ViewCasesPage';

function App() {
  const walletAccount = useCurrentAccount(); // current wallet account from Mysten wallet
  const [currentAccount, setCurrentAccount] = useState(null);

  // Sync wallet state with our app state
  useEffect(() => {
    if (walletAccount) {
      setCurrentAccount(walletAccount);
    }
  }, [walletAccount]);

  // Logout handler: clear state
  const handleLogout = () => {
    setCurrentAccount(null);
  };

  return (
    <div className="App">
      <div>
        {currentAccount ? (
          <Router>
            <div className="app">
              <Navbar onLogout={handleLogout} />
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/case/:id" element={<ProtectedRoute><CaseDetailsPage /></ProtectedRoute>} />
                <Route path="/case/:id/synopsis-evaluation" element={<ProtectedRoute><CaseSynopsisPage /></ProtectedRoute>} />
                <Route path="/case/:id/logic-analysis" element={<ProtectedRoute><CaseLogicPage /></ProtectedRoute>} />
                <Route path="/case/:id/hypothesis-verification" element={<ProtectedRoute><CaseHypothesisPage /></ProtectedRoute>} />
                <Route path="/case/:id/bias-detection" element={<ProtectedRoute><CaseBiasPage /></ProtectedRoute>} />
                <Route path="/view-submissions" element={<ProtectedRoute><ViewSubmissionsPage /></ProtectedRoute>} />
                <Route path="/submission/:id" element={<ProtectedRoute><SubmissionDetailsPage /></ProtectedRoute>} />
                <Route path="/my-submissions/:author" element={<ProtectedRoute><MySubmissionsPage /></ProtectedRoute>} />
                <Route path="/all-cases" element={<ViewCasesPage/>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        ) : (
          <div className="login-message">
            <h2>Please connect your wallet to access the platform.</h2>
            <p>We use your wallet address for authentication.</p>
            <Box>
              <ConnectButton />
            </Box>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
