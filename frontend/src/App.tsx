import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Datasets from './pages/Datasets';
import DatasetDetail from './pages/DatasetDetail';
import Upload from './pages/Upload';
import Statistics from './pages/Statistics';
import AdminUsers from './pages/AdminUsers';

function App() {
  const { loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/datasets/:id" element={<DatasetDetail />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
