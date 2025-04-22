import React, { useState, useEffect } from "react";
// Import the logo image
import logoImage from "../../assets/LogoPlanifygoPNG.png"; // Adjust the path as necessary

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("accueil");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [subdomain, setSubdomain] = useState('');

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    // Function to get cookie value by name
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const accessToken = getCookie('accessToken');
    const tenantSubdomain = getCookie('subdomain');
    
    if (accessToken && tenantSubdomain) {
      setIsLoggedIn(true);
      setSubdomain(tenantSubdomain);
    }
  }, []);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Détection du défilement pour changer l'apparence
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Logique pour déterminer la section active basée sur le défilement
      const sections = [
        "accueil",
        "fonctionnalites",
        "tarification",
        "ressources",
      ];
      const currentPos = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (
          element &&
          element.offsetTop <= currentPos &&
          element.offsetTop + element.offsetHeight > currentPos
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gérer les dropdowns
  const handleDropdownToggle = (id) => {
    if (openDropdown === id) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(id);
    }
  };

  // Gérer le clic sur le bouton connexion/dashboard
  const handleConnectionClick = () => {
    if (isLoggedIn && subdomain) {
      window.location.href = `http://${subdomain}.127.0.0.1.nip.io:5173/dashboard`;
    } else {
      window.location.href = "/connexion";
    }
  };

  // Contenu des dropdowns
  const dropdownContent = {
    secteurs: [
      { label: "Beauté et bien-être", link: "/beaute-bien-etre" },
      { label: "Sports & Fitness", link: "/sports-fitness" },
      { label: "Santé", link: "/sante" },
      { label: "Services professionnels", link: "/services-professionnels" },
      { label: "Services publics", link: "/services-publics" },
      { label: "Éducation", link: "/education" },
      { label: "Photographes", link: "/photographes" },
      { label: "Commerce de détail", link: "/commerce-de-detail" },
      { label: "Événements & divertissement", link: "/evenements-divertissement",},
      { label: "Tous les secteurs", link: "/toutes-industries" },
    ],
    ressources: [
      { label: "Centre d'aide", link: "#support" },
      { label: "Documentation API", link: "#api" },
      { label: "Blog technique", link: "#blog" },
      { label: "Webinaires", link: "#webinaires" },
    ],
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "py-0 bg-white/95 backdrop-blur-md shadow-lg"
          : "py-2 bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex items-center justify-between">
          {/* Logo avec image et texte */}
          <div className="flex items-center space-x-2 group">
            <a href="/" className="flex items-center">
              <img 
                src={logoImage} 
                alt="PlanifyGo Logo" 
                className="h-20 w-auto scale-125 transition-transform duration-300 group-hover:scale-130"
              />
              <span className="ml-4 text-xl font-bold">
                <span className="text-blue-600">P</span>lanify<span className="text-blue-600">G</span>o
              </span>
            </a>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </div>

          {/* Navigation principale - Desktop */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1 relative">
              <NavItem
                id="accueil"
                label="Accueil"
                isActive={activeSection === "accueil"}
                scrolled={scrolled}
                redirectTo="/"
              />
              <NavItemWithDropdown
                id="secteurs"
                label="Secteurs"
                isActive={activeSection === "secteurs"}
                scrolled={scrolled}
                isOpen={openDropdown === "secteurs"}
                onToggle={handleDropdownToggle}
                items={dropdownContent.secteurs}
              />
              <NavItem
                id="fonctionnalites"
                label="Fonctionnalités"
                isActive={activeSection === "fonctionnalites"}
                scrolled={scrolled}
                redirectTo="/fonctionnalites"
                onClick={() => handleNavClick("fonctionnalites")}
              />
              <NavItem
                id="tarification"
                label="Tarification"
                isActive={activeSection === "tarification"}
                scrolled={scrolled}
                redirectTo="/tarification"
                onClick={() => handleNavClick("tarification")}
              />
              <NavItemWithDropdown
                id="ressources"
                label="Ressources"
                isActive={activeSection === "ressources"}
                scrolled={scrolled}
                isOpen={openDropdown === "ressources"}
                onToggle={handleDropdownToggle}
                items={dropdownContent.ressources}
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              className="relative overflow-hidden px-5 py-2 rounded-md bg-transparent group"
              onClick={handleConnectionClick}
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-y-full bg-gradient-to-t from-blue-50 to-blue-100 group-hover:translate-y-0"></span>
              <span
                className={`relative font-medium text-sm transition-colors duration-300 ${
                  scrolled ? "text-gray-700" : "text-gray-700"
                } group-hover:text-blue-600`}
              >
                {isLoggedIn ? "Tableau de bord" : "Connexion"}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 ease-out"></span>
              </span>
            </button>

            <button
              className="relative px-6 py-2.5 rounded-md overflow-hidden group"
              onClick={() => (window.location.href = "/paiement")}
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-500 ease-out transform -translate-x-full bg-gradient-to-r from-blue-500 to-blue-700 group-hover:translate-x-0"></span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-500"></span>
              <span className="relative text-white font-medium text-sm flex items-center">
                Démarrer
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                <span className="absolute top-0 left-0 w-64 h-64 -mt-12 transition-all duration-1000 transform -translate-x-64 -translate-y-12 bg-white opacity-5 group-hover:-translate-x-0 ease rounded-full"></span>
              </span>
            </button>
          </div>

          {/* Bouton du menu mobile */}
          <div className="lg:hidden">
            <button
              className={`p-2 rounded-md focus:outline-none transition-colors duration-300 ${
                scrolled
                  ? "text-gray-800 hover:bg-gray-100"
                  : "text-gray-800 hover:bg-white/20"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="w-6 h-6 relative">
                <span
                  className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    mobileMenuOpen
                      ? "rotate-45 translate-y-0 top-3"
                      : "rotate-0 top-1"
                  }`}
                ></span>
                <span
                  className={`absolute h-0.5 bg-current transition-all duration-300 ${
                    mobileMenuOpen ? "w-0 opacity-0" : "w-6 opacity-100 top-3"
                  }`}
                ></span>
                <span
                  className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    mobileMenuOpen
                      ? "-rotate-45 translate-y-0 top-3"
                      : "rotate-0 top-5"
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
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
        style={{ top: "60px" }}
      >
        <div className="py-6 px-6 h-full overflow-y-auto">
          <div className="mb-8 space-y-3">
            <MobileNavItem
              label="Accueil"
              isActive={activeSection === "accueil"}
              onClick={() => (window.location.href = "/")}
            />
            <MobileNavItem
              label="Secteurs"
              isActive={activeSection === "secteurs"}
              hasChildren={true}
              childrenItems={dropdownContent.secteurs}
            />
            <MobileNavItem
              label="Fonctionnalités"
              isActive={activeSection === "fonctionnalites"}
              onClick={() => (window.location.href = "/fonctionnalites")}
            />
            <MobileNavItem
              label="Tarification"
              isActive={activeSection === "tarification"}
              onClick={() => (window.location.href = "/tarification")}
            />
            <MobileNavItem
              label="Ressources"
              isActive={activeSection === "ressources"}
              hasChildren={true}
              childrenItems={dropdownContent.ressources}
            />
          </div>

          <div className="space-y-3">
            <button
              className="w-full py-3 px-4 bg-blue-50 text-blue-600 rounded-md font-medium text-sm"
              onClick={handleConnectionClick}
            >
              {isLoggedIn ? "Tableau de bord" : "Connexion"}
            </button>
            <button
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-md font-medium text-sm flex items-center justify-center"
              onClick={() => (window.location.href = "/paiement")}
            >
              <span>Démarrer</span>
              <svg
                className="w-4 h-4 ml-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Composant d'élément de navigation de bureau simple
const NavItem = ({ id, label, isActive, scrolled, redirectTo, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (onClick) {
      onClick();
    }
    if (redirectTo) {
      e.preventDefault();
      window.location.href = redirectTo;
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={redirectTo || `#${id}`}
        onClick={handleClick}
        className={`block py-2 px-6 rounded-md text-sm font-medium transition-all duration-300 relative ${
          isActive
            ? "text-blue-600"
            : scrolled
            ? "text-gray-700"
            : "text-gray-700"
        }`}
      >
        <span
          className={`absolute inset-0 rounded-md transition-opacity duration-200 ${
            isActive
              ? "bg-blue-100 opacity-100"
              : isHovered
              ? "bg-blue-50 opacity-100"
              : "opacity-0"
          }`}
        ></span>
        <span className="relative z-10">{label}</span>
      </a>
    </div>
  );
};

// Composant d'élément de navigation avec dropdown
const NavItemWithDropdown = ({
  id,
  label,
  isActive,
  scrolled,
  isOpen,
  onToggle,
  items,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={() => onToggle(id)}
        className={`py-2 px-6 rounded-md flex items-center text-sm font-medium transition-all duration-300 relative ${
          isActive
            ? "text-blue-600"
            : scrolled
            ? "text-gray-700"
            : "text-gray-700"
        }`}
      >
        <span
          className={`absolute inset-0 rounded-md transition-opacity duration-200 ${
            isActive
              ? "bg-blue-100 opacity-100"
              : isHovered || isOpen
              ? "bg-blue-50 opacity-100"
              : "opacity-0"
          }`}
        ></span>
        <span className="relative z-10 flex items-center">
          {label}
          <svg
            className={`ml-1.5 w-4 h-4 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-blue-600" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>

      <div
        className={`absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 z-50 ${
          isOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-2 invisible"
        }`}
      >
        <div className="py-1 overflow-hidden">
          {items.map((item, index) => (
            <a
              key={index}
              href={item.link}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = item.link;
              }}
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
const MobileNavItem = ({
  label,
  isActive = false,
  hasChildren = false,
  childrenItems = [],
  onClick,
}) => {
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
        className={`flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer ${
          isActive ? "bg-blue-50 text-blue-600" : "text-gray-800"
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center">
          <span className="font-medium px-3">{label}</span>
        </div>
        {hasChildren && (
          <svg
            className={`w-5 h-5 mr-3 transition-transform duration-300 ${
              isOpen
                ? "rotate-180 text-blue-600"
                : isActive
                ? "text-blue-600"
                : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </div>

      {hasChildren && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-2 pl-4 space-y-2">
            {childrenItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="block py-2 text-sm text-gray-600 hover:text-blue-600"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = item.link;
                }}
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