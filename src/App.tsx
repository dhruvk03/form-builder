import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { BuilderPage } from './pages/BuilderPage';
import { FillPage } from './pages/FillPage';
import { Navbar } from './components/layout/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder" element={<BuilderPage />} />
        <Route path="/builder/:id" element={<BuilderPage />} />
        <Route path="/fill/:templateId/new" element={<FillPage />} />
        <Route path="/fill/:templateId/:responseId" element={<FillPage />} />
      </Routes>
    </Router>
  );
}

export default App;
