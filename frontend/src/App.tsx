import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard.tsx';
import {MainLayout} from './components/MainLayout';
// import Products from '@/pages/Products';
import Materials from '@/pages/Materials';
import Faq from '@/pages/Faq';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <MainLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* <Route path="/products" element={<Products />} /> */}
            <Route path="/materials" element={<Materials />} />
            <Route path="/faq" element={<Faq />} />
          </Routes>
        </MainLayout>
        <Toaster position='top-right'/>
      </div>
    </Router>
  );
}

export default App;