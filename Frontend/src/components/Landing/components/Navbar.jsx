import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Détection du défilement pour changer l'apparence
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      // Logique pour déterminer la section active basée sur le défilement
      const sections = ['accueil', 'fonctionnalites', 'tarifs', 'ressources'];
      const currentPos = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= currentPos && 
            element.offsetTop + element.offsetHeight > currentPos) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation de l'indicateur lumineux
  const glowPosition = {
    entreprise: 'left-[5%]',
    secteurs: 'left-[23%]',
    fonctionnalites: 'left-[41%]',
    tarifs: 'left-[59%]',
    ressources: 'left-[77%]'
  };

  // Gérer les dropdowns
  const handleDropdownToggle = (id) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(id);
    }
  };

  // Contenu des dropdowns
  const dropdownContent = {
    secteurs: [
      { label: 'Commerce de détail', link: '#retail' },
      { label: 'Finance', link: '#finance' },
      { label: 'Santé', link: '#sante' },
      { label: 'Services en ligne', link: '#services' }
    ],
    fonctionnalites: [
      { label: 'Paiements internationaux', link: '#intl' },
      { label: 'Gestion des abonnements', link: '#abonnements' },
      { label: 'Protection anti-fraude', link: '#securite' },
      { label: 'Tableau de bord analytique', link: '#analytics' }
    ],
    ressources: [
      { label: 'Centre d\'aide', link: '#support' },
      { label: 'Documentation API', link: '#api' },
      { label: 'Blog technique', link: '#blog' },
      { label: 'Webinaires', link: '#webinaires' }
    ]
  };

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-2 bg-white/95 backdrop-blur-md shadow-lg' 
          : 'py-4 bg-transparent backdrop-blur-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex items-center justify-between">
          {/* Logo avec animation */}
          <div className="flex items-center space-x-2 group">
            <div className={`relative w-10 h-10 rounded-xl overflow-hidden transition-all duration-300 ${
              scrolled ? 'shadow-md' : 'shadow-lg'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 group-hover:animate-gradient-xy"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">F</div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <span className="font-bold text-xl relative">
              <span className={`transition-colors duration-300 ${
                scrolled ? 'text-gray-800' : 'text-gray-800'
              }`}>Flow</span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Pay</span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </span>
          </div>

          {/* Navigation principale - Desktop */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Indicateur de lien actif/survolé */}
              <div 
                className={`absolute h-8 w-24 bg-blue-50 rounded-md transition-all duration-300 ease-in-out ${
                  hoveredItem ? glowPosition[hoveredItem] : 'opacity-0'
                }`}
              ></div>
              
              <div className="flex items-center space-x-1 relative">
                <NavItem 
                  id="entreprise" 
                  label="Entreprise" 
                  isActive={activeSection === 'entreprise'} 
                  onHover={setHoveredItem} 
                  scrolled={scrolled}
                  redirectTo="#entreprise"
                />
                <NavItemWithDropdown 
                  id="secteurs" 
                  label="Secteurs" 
                  isActive={activeSection === 'secteurs'} 
                  onHover={setHoveredItem}
                  scrolled={scrolled}
                  isOpen={openDropdown === 'secteurs'}
                  onToggle={handleDropdownToggle}
                  items={dropdownContent.secteurs}
                />
                <NavItemWithDropdown 
                  id="fonctionnalites" 
                  label="Fonctionnalités" 
                  isActive={activeSection === 'fonctionnalites'} 
                  onHover={setHoveredItem}
                  scrolled={scrolled}
                  isOpen={openDropdown === 'fonctionnalites'}
                  onToggle={handleDropdownToggle}
                  items={dropdownContent.fonctionnalites}
                />
                <NavItem 
                  id="tarifs" 
                  label="Tarifs" 
                  isActive={activeSection === 'tarifs'} 
                  onHover={setHoveredItem}
                  scrolled={scrolled}
                />
                <NavItemWithDropdown 
                  id="ressources" 
                  label="Ressources" 
                  isActive={activeSection === 'ressources'} 
                  onHover={setHoveredItem}
                  scrolled={scrolled}
                  isOpen={openDropdown === 'ressources'}
                  onToggle={handleDropdownToggle}
                  items={dropdownContent.ressources}
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="hidden lg:flex items-center space-x-3">
            <button 
              className="relative overflow-hidden px-5 py-2 rounded-md bg-transparent group"
              onClick={() => window.location.href='/dashbord'}
            >
              {/* Fond animé */}
              <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-y-full bg-gradient-to-t from-blue-50 to-blue-100 group-hover:translate-y-0"></span>
              
              {/* Texte */}
              <span className={`relative font-medium text-sm transition-colors duration-300 ${
                scrolled ? 'text-gray-700' : 'text-gray-700'
              } group-hover:text-blue-600`}>
                Admin (temp)
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </span>
            </button>

            <button 
              className="relative overflow-hidden px-5 py-2 rounded-md bg-transparent group"
              onClick={() => window.location.href='/gg'}
            >
              {/* Fond animé */}
              <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-y-full bg-gradient-to-t from-blue-50 to-blue-100 group-hover:translate-y-0"></span>
              
              {/* Texte */}
              <span className={`relative font-medium text-sm transition-colors duration-300 ${
                scrolled ? 'text-gray-700' : 'text-gray-700'
              } group-hover:text-blue-600`}>
                Connexion
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </span>
            </button>
            
            <button 
              className="relative px-6 py-2.5 rounded-md overflow-hidden group"
              onClick={() => window.location.href='#demarrer'}
            >
              {/* Fond avec animation */}
              <span className="absolute inset-0 w-full h-full transition-all duration-500 ease-out transform -translate-x-full bg-gradient-to-r from-blue-500 to-blue-700 group-hover:translate-x-0"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-500"></span>
              
              {/* Texte et effet de brillance */}
              <span className="relative text-white font-medium text-sm flex items-center">
                Démarrer
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                
                {/* Effet de brillance */}
                <span className="absolute top-0 left-0 w-64 h-64 -mt-12 transition-all duration-1000 transform -translate-x-64 -translate-y-12 bg-white opacity-5 group-hover:-translate-x-0 ease rounded-full"></span>
              </span>
            </button>
          </div>

          {/* Bouton du menu mobile */}
          <div className="lg:hidden">
            <button 
              className={`p-2 rounded-md focus:outline-none transition-colors duration-300 ${
                scrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-gray-800 hover:bg-white/20'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-6 relative">
                <span 
                  className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-0 top-3' : 'rotate-0 top-1'
                  }`}
                ></span>
                <span 
                  className={`absolute h-0.5 bg-current transition-all duration-300 ${
                    mobileMenuOpen ? 'w-0 opacity-0' : 'w-6 opacity-100 top-3'
                  }`}
                ></span>
                <span 
                  className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 translate-y-0 top-3' : 'rotate-0 top-5'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div 
        className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:hidden`}
        style={{ top: '60px' }}
      >
        <div className="py-6 px-6 h-full overflow-y-auto">
          <div className="mb-8 space-y-3">
            <MobileNavItem 
              label="Entreprise" 
              onClick={() => window.location.href='#entreprise'}
            />
            <MobileNavItem 
              label="Secteurs" 
              hasChildren={true} 
              childrenItems={dropdownContent.secteurs}
            />
            <MobileNavItem 
              label="Fonctionnalités" 
              hasChildren={true}
              childrenItems={dropdownContent.fonctionnalites}
            />
            <MobileNavItem label="Tarifs" />
            <MobileNavItem 
              label="Ressources" 
              hasChildren={true}
              childrenItems={dropdownContent.ressources}
            />
          </div>

          <div className="space-y-3">
            <button 
              className="w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-md font-medium text-sm"
              onClick={() => window.location.href='/connexionadmin'}
            >
              Connexion
            </button>
            <button 
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium text-sm"
              onClick={() => window.location.href='#demarrer'}
            >
              Démarrer
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Composant d'élément de navigation de bureau simple
const NavItem = ({ id, label, isActive, onHover, scrolled, redirectTo }) => {
  const handleClick = (e) => {
    if (redirectTo) {
      e.preventDefault();
      window.location.href = redirectTo;
    }
  };

  return (
    <div 
      className="relative"
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <a 
        href={redirectTo || `#${id}`} 
        onClick={handleClick}
        className={`py-2 px-6 rounded-md flex items-center text-sm font-medium transition-all duration-300 ${
          isActive 
            ? 'text-blue-600'
            : scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-700 hover:text-blue-600'
        }`}
      >
        {label}
      </a>
      
      {/* Indicateur actif */}
      <span 
        className={`absolute bottom-0 left-1/2 w-1 h-1 rounded-full bg-blue-600 transform -translate-x-1/2 transition-all duration-300 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      ></span>
    </div>
  );
};

// Composant d'élément de navigation avec dropdown
const NavItemWithDropdown = ({ id, label, isActive, onHover, scrolled, isOpen, onToggle, items }) => {
  return (
    <div 
      className="relative"
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
    >
      <button 
        onClick={() => onToggle(id)}
        className={`py-2 px-6 rounded-md flex items-center text-sm font-medium transition-all duration-300 ${
          isActive 
            ? 'text-blue-600'
            : scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-gray-700 hover:text-blue-600'
        }`}
      >
        {label}
        <svg 
          className={`ml-1.5 w-4 h-4 transition-transform duration-300 ${
            isOpen ? 'text-blue-600 rotate-180' : isActive ? 'text-blue-600' : 'text-gray-400'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Indicateur actif */}
      <span 
        className={`absolute bottom-0 left-1/2 w-1 h-1 rounded-full bg-blue-600 transform -translate-x-1/2 transition-all duration-300 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      ></span>

      {/* Dropdown menu */}
      <div 
        className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 z-50 ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
        }`}
      >
        <div className="py-1">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// Composant d'élément de navigation mobile
const MobileNavItem = ({ label, hasChildren = false, childrenItems = [], onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };
  
  return (
    <div>
      <div 
        className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer"
        onClick={handleClick}
      >
        <span className="font-medium text-gray-800">{label}</span>
        {hasChildren && (
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      
      {/* Sous-menu */}
      {hasChildren && (
        <div 
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-2 pl-4 space-y-2">
            {childrenItems.map((item, index) => (
              <a 
                key={index} 
                href={item.link} 
                className="block py-2 text-sm text-gray-600 hover:text-blue-600"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;