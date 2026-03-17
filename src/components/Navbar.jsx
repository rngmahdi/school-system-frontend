import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, GraduationCap, School } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Courses', path: '/', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Students', path: '/students', icon: <Users className="w-5 h-5" /> },
    { name: 'Grades', path: '/grades', icon: <GraduationCap className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
            <School className="w-8 h-8 text-blue-500" />
            <span>EduSys</span>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
