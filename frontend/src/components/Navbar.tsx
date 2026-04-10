import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplets, Activity, Info, LayoutDashboard, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Droplets },
    { name: 'How It Works', path: '/how-it-works', icon: Info },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav className="glass-nav px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Activity className="text-blue-400 w-8 h-8" />
          <span className="text-2xl font-bold text-gradient">Jal Suraksha</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-blue-400 ${
                location.pathname === link.path ? 'text-blue-400' : 'text-slate-300'
              }`}
            >
              <link.icon size={18} />
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-slate-300" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pt-4 pb-2 space-y-2 border-t border-white/10 mt-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === link.path ? 'bg-blue-500/20 text-blue-400' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <link.icon size={20} />
                <span>{link.name}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
