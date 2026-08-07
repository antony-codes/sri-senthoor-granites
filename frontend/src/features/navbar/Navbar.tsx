import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Menu, X, Square } from 'lucide-react';
import { COMPANY_INFO } from '@/constants/company';

const NAV_LINKS = [
  { name: 'HOME', href: '#hero' },
  { name: 'PRODUCTS', href: '#products' },
  { name: 'ABOUT', href: '#about' },
  { name: 'WHY CHOOSE US', href: '#why-choose-us' },
  { name: 'GALLERY', href: '#gallery' },
  { name: 'TESTIMONIALS', href: '#testimonials' },
  { name: 'CONTACT', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = NAV_LINKS.map((link) => link.href.substring(1));
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-white/90 backdrop-blur-md border-b border-black/5 shadow-sm'
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo - Matching Reference Image */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2 group focus:outline-none"
          >
            <Square className="w-5 h-5 fill-current text-black stroke-none" />
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-black">
              SriSenthoor<span className="font-light italic text-gray-700">Granites</span>
            </span>
          </a>

          {/* Desktop Links - Bullet point indicator matching image */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.substring(1);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-xs font-bold tracking-widest transition-colors duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-black font-extrabold'
                      : 'text-gray-500 hover:text-black'
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-black inline-block" />}
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action Control */}
          <div className="hidden lg:flex items-center gap-3">
            {/* CALL NOW Black Pill Button - Exact Mockup Matching */}
            <a
              href={`tel:${COMPANY_INFO.rawPhones[1]}`}
              className="px-6 py-2.5 bg-black text-white font-semibold text-xs uppercase tracking-widest rounded-md hover:bg-gray-800 transition-all shadow-sm flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>CALL NOW</span>
            </a>
          </div>

          {/* Mobile Buttons */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-black"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white lg:hidden flex flex-col justify-between pt-24 pb-8 px-6"
          >
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="font-serif text-2xl font-bold text-black hover:text-gray-600 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-6 border-t border-gray-200">
              <a
                href={`tel:${COMPANY_INFO.rawPhones[1]}`}
                className="w-full py-3.5 bg-black text-white text-center font-bold text-xs uppercase tracking-widest rounded-md"
              >
                CALL NOW (+91 {COMPANY_INFO.rawPhones[1]})
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
