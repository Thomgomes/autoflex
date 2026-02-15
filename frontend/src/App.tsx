import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard.tsx';
import {MainLayout} from './components/MainLayout';
// import Products from '@/pages/Products';
// import Inventory from '@/pages/Inventory';
// import Faq from '@/pages/Faq';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Aqui entrará a Sidebar ou Navbar */}
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/products" element={<Products />} /> */}
            {/* <Route path="/inventory" element={<Inventory />} /> */}
            {/* <Route path="/faq" element={<Faq />} /> */}
          </Routes>
        </MainLayout>
      </div>
    </Router>
  );
}

export default App;