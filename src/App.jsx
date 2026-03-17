import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Courses from './pages/Courses';
import Students from './pages/Students';
import Grades from './pages/Grades';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <main className="container mx-auto px-4 pb-12">
          <Routes>
            <Route path="/" element={<Courses />} />
            <Route path="/students" element={<Students />} />
            <Route path="/grades" element={<Grades />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
