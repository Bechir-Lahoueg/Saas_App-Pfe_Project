import React, { useState, useEffect, useRef } from "react";
import {
  Dumbbell,
  Sparkles,
  GraduationCap,
  Stethoscope,
  Briefcase,
  Calendar,
  Users,
  Car,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Composant personnalisé pour les icônes animées
const AnimatedIcon = ({ Icon, color, isActive }) => {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (isActive) {
      // Animation lors de l'activation
      setScale(1.1);
      const timer = setTimeout(() => {
        setScale(1);
      }, 500);

      // Animation continue pour l'icône active
      const interval = setInterval(() => {
        setRotation((prev) => (prev + 1) % 360);
      }, 50);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      setScale(1);
      setRotation(0);
    }
  }, [isActive]);

  return (
    <div
      className="relative transition-all duration-300"
      style={{ transform: `scale(${scale})` }}
    >
      <Icon size={54} className={color} />
      {isActive && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px dashed currentColor",
            opacity: 0.4,
            animation: "spin 8s linear infinite",
          }}
        />
      )}
    </div>
  );
};

const ServiceSolutionsPage = () => {
  const [activeTab, setActiveTab] = useState("sports");
  const [hoverTab, setHoverTab] = useState(null);
  const tabsContainerRef = useRef(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Données des services avec tous les détails (traduit en français)
  const services = [
    {
      id: "sports",
      icon: Dumbbell,
      title: "Sports & Fitness",
      shortDesc: "Planifiez efficacement votre entreprise de sport et fitness",
      description:
        "Planifiez efficacement votre entreprise de sport et fitness. Gardez vos cours, services et coachs organisés. Délivrez même des billets et scannez-les via l'application d'administration à l'arrivée des clients.",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-600",
      features: [
        "Programmation facile des cours de fitness et coaching sportif",
        "Création d'abonnements pour limiter l'accès ou offrir des extras",
      ],
      examples: [
        "Coachs personnels",
        "Salles de sport",
        "Cours de fitness",
        "Cours de yoga",
        "Cours de golf",
        "Location d'articles de sport",
      ],
    },
    {
      id: "beauty",
      icon: Sparkles,
      title: "Beauté & Bien-être",
      shortDesc: "Proposez des réservations en ligne sur plusieurs canaux",
      description:
        "Offrez des réservations en ligne via plusieurs canaux comme votre site web, un site de réservation, Booking.page, Facebook, Instagram ou Google pour tous vos soins embellissants. Acceptez des paiements et acomptes en ligne et hors ligne via notre système de caisse.",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      borderColor: "border-rose-600",
      features: [
        "Regroupez facilement les services en catégories pour une recherche simple",
        "Options vibrantes et élégantes pour la conception de votre site web",
      ],
      examples: [
        "Extensions de cils",
        "Salons de coiffure",
        "Spas",
        "Instituts de beauté",
        "Salons de manucure",
      ],
    },
    {
      id: "education",
      icon: GraduationCap,
      title: "Éducation",
      shortDesc: "Organisez vos étudiants et cours facilement",
      description:
        "Quel que soit leur âge, vous pouvez organiser vos étudiants et élèves parmi votre personnel enseignant. Planifiez des cours vidéo ou des cours normaux, des événements et des réunions parentales facilement et en ligne.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-600",
      features: [
        "Envoyez des notifications automatiques aux étudiants et enseignants",
        "Définissez la disponibilité des enseignants et autres membres du personnel éducatif",
      ],
      examples: [
        "Universités",
        "Collèges",
        "Écoles",
        "Bibliothèques",
        "Enseignement",
        "Cours particuliers",
        "Réunions parents",
        "Événements",
        "Garde d'enfants",
      ],
    },
    {
      id: "medical",
      icon: Stethoscope,
      title: "Services Médicaux & Santé",
      shortDesc:
        "Gardez du temps pour vos patients avec des réservations simplifiées",
      description:
        "Consacrez votre temps à vos patients et donnez-leur la possibilité de prendre rendez-vous selon leurs disponibilités avec des rappels automatiques. Gardez vos données sécurisées et conformes.",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      borderColor: "border-emerald-600",
      features: [
        "Sécurité conforme HIPAA pour les patients",
        "Notes SOAP cryptées pour vos données clients",
      ],
      examples: [
        "Cliniques médicales & Médecins",
        "Dentistes",
        "Chiropraticiens",
        "Acupuncture",
        "Massage",
        "Physiologues",
        "Psychologues",
      ],
    },
    {
      id: "professional",
      icon: Briefcase,
      title: "Services Publics & Professionnels",
      shortDesc: "Organisez vos horaires chargés entre départements et bureaux",
      description:
        "Gardez vos emplois du temps chargés organisés entre départements et bureaux grâce à la planification en ligne. Sécurisez les données sensibles et attribuez des niveaux d'accès utilisateur.",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-600",
      features: [
        "Sécurité de haut niveau",
        "Multi-utilisateurs avec niveaux d'accès limités ou étendus",
      ],
      examples: [
        "Conseils municipaux",
        "Ambassades et consulats",
        "Avocats",
        "Services juridiques",
        "Planification d'entretiens",
        "Centres d'appels",
        "Services financiers",
      ],
    },
    {
      id: "events",
      icon: Calendar,
      title: "Événements & Divertissement",
      shortDesc: "Planifiez des fêtes, des conférences et bien plus",
      description:
        "Planifiez des fêtes et des conférences, louez des équipements et des espaces de réunion, piégez des évadés dans une pièce pendant une heure ou tout autre événement que vous pouvez imaginer. La planification en ligne fonctionne pour vous.",
      bgColor: "bg-amber-50",
      iconColor: "text-amber-600",
      borderColor: "border-amber-600",
      features: [
        "Définissez la disponibilité entre services et prestataires",
        "Site web entièrement responsive sur mobile",
      ],
      examples: [
        "Escape Rooms",
        "Photographes",
        "Restaurants",
        "Événements & Conférences",
        "Salles de réunion",
        "Location d'équipement",
        "Cours d'art",
        "Événements (réguliers et récurrents)",
      ],
    },
    {
      id: "personal",
      icon: Users,
      title: "Rendez-vous & Services Personnels",
      shortDesc:
        "Laissez vos clients choisir quand cela correspond à leur emploi du temps",
      description:
        "Quel que soit le service personnel que vous fournissez, laissez vos clients choisir quand cela convient à leur emploi du temps. Intégrez des temps de déplacement ou des périodes tampons entre les clients et offrez le service le plus efficace.",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-600",
      features: [
        "Synchronisez vos calendriers professionnels et personnels avec Google ou Outlook",
        "Acceptez les paiements en ligne et configurez des frais récurrents",
      ],
      examples: [
        "Consultation",
        "Conseil",
        "Coaching",
        "Services spirituels",
        "Consultations design",
        "Nettoyage",
        "Services ménagers",
        "Services animaliers",
      ],
    },
    {
      id: "driving",
      icon: Car,
      title: "Auto-écoles",
      shortDesc:
        "Permettez à vos élèves conducteurs de choisir leur horaire d'apprentissage",
      description:
        "Laissez vos apprentis conducteurs décider du meilleur moment pour apprendre à conduire — planifiez les instructeurs dans différents lieux et cours de conduite. Surveillez vos réservations quotidiennes directement via l'application d'administration.",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-700",
      borderColor: "border-gray-700",
      features: [
        "Configurez des auto-écoles dans plusieurs emplacements",
        "Attribuez différents cours de conduite à des instructeurs individuels",
      ],
      examples: ["Auto-écoles", "Moniteurs de conduite"],
    },
  ];

  // Défilement automatique horizontal infini
  useEffect(() => {
    if (!autoScrollEnabled || !tabsContainerRef.current) return;

    const container = tabsContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    let scrollLeft = container.scrollLeft;

    // Cloner les éléments pour créer un effet infini
    if (scrollLeft >= scrollWidth - clientWidth) {
      container.scrollLeft = 0;
      scrollLeft = 0;
    }

    const scrollSpeed = 1; // Augmenté la vitesse de défilement
    const scrollInterval = 20; // Réduit l'intervalle pour un défilement plus fluide

    const intervalId = setInterval(() => {
      scrollLeft += scrollSpeed;
      container.scrollLeft = scrollLeft;
    }, scrollInterval);

    return () => clearInterval(intervalId);
  }, [autoScrollEnabled]);

  // Arrêter le défilement automatique au survol
  const handleMouseEnter = () => {
    setAutoScrollEnabled(false);
  };

  // Reprendre le défilement automatique en quittant
  const handleMouseLeave = () => {
    setAutoScrollEnabled(true);
  };

  // Contrôle manuel du défilement
  const scrollLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };

  // Obtenir le service actuellement actif
  const activeService = services.find((service) => service.id === activeTab);

  return (
    <div className="relative bg-gray-50">
      {/* Section Hero - Style Premium */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <div className="text-sm bg-blue-600/30 font-medium uppercase inline-block px-4 py-1 rounded-full mb-6 animate-pulse">
              NOS SOLUTIONS
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              La plateforme complète pour{" "}
              <span className="text-blue-300">chaque type</span> d'entreprise de
              services
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Découvrez notre solution tout-en-un qui simplifie la gestion des
              rendez-vous, des clients et des paiements pour tous les secteurs
              d'activité.
            </p>
            <button className="bg-white text-blue-800 font-medium text-lg py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors shadow-lg transform hover:scale-105 duration-300">
              Commencer gratuitement
            </button>
          </div>
        </div>
      </div>

      {/* Onglets de navigation fixes avec défilement automatique */}
      <div className="sticky top-0 bg-white shadow-md z-10">
        <div className="max-w-6xl mx-auto relative px-16"> {/* Augmenté le padding pour éloigner les flèches */}
          {/* Boutons de contrôle de défilement */}
          <button
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-3 shadow-md z-20 hover:bg-blue-100 transition-colors"
            aria-label="Défiler vers la gauche"
          >
            <ChevronLeft size={24} className="text-blue-800" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-3 shadow-md z-20 hover:bg-blue-100 transition-colors"
            aria-label="Défiler vers la droite"
          >
            <ChevronRight size={24} className="text-blue-800" />
          </button>

          {/* Conteneur de défilement */}
          <div
            ref={tabsContainerRef}
            className="flex overflow-x-auto py-2 scrollbar-hide transition-all duration-300"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Dupliquer les éléments pour un effet infini */}
            {[...services, ...services].map((service, index) => (
              <button
                key={`${service.id}-${index}`}
                onClick={() => setActiveTab(service.id)}
                onMouseEnter={() => setHoverTab(service.id)}
                onMouseLeave={() => setHoverTab(null)}
                className={`whitespace-nowrap px-5 py-3 mx-2 font-medium rounded-lg transition-all duration-300 flex-shrink-0 ${
                  activeTab === service.id
                    ? `${service.bgColor} ${service.iconColor} transform scale-105`
                    : `text-gray-500 hover:${service.bgColor} hover:${service.iconColor}`
                }`}
              >
                {service.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Grille des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => setActiveTab(service.id)}
              onMouseEnter={() => setHoverTab(service.id)}
              onMouseLeave={() => setHoverTab(null)}
              className={`${
                service.bgColor
              } rounded-xl p-6 flex flex-col items-center transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:scale-105 ${
                activeTab === service.id
                  ? `ring-2 ${service.borderColor} shadow-lg`
                  : ""
              }`}
            >
              <div className="h-24 flex items-center justify-center mb-4">
                <AnimatedIcon
                  Icon={service.icon}
                  color={service.iconColor}
                  isActive={activeTab === service.id || hoverTab === service.id}
                />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600">{service.shortDesc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Section détaillée pour le service actif */}
        {activeService && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-16 transform transition-all duration-500 hover:shadow-xl">
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div
                className={`p-4 rounded-full ${activeService.bgColor} mb-4 md:mb-0`}
              >
                <AnimatedIcon
                  Icon={activeService.icon}
                  color={activeService.iconColor}
                  isActive={true}
                />
              </div>
              <div className="md:ml-6 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {activeService.title}
                </h2>
                <p className="text-lg text-gray-600">
                  {activeService.shortDesc}
                </p>
              </div>
            </div>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              {activeService.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Fonctionnalités */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
                  Fonctionnalités clés
                </h3>
                <ul className="space-y-4">
                  {activeService.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start group">
                      <ChevronRight
                        className={`${activeService.iconColor} mt-1 mr-2 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1`}
                        size={18}
                      />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <button
                    className={`flex items-center ${activeService.iconColor} font-medium hover:underline transition-all duration-300 transform hover:translate-x-1`}
                  >
                    En savoir plus
                    <ChevronRight size={16} className="ml-1 animate-pulse" />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
                  Idéal pour
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeService.examples.map((example, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm ${activeService.bgColor} ${activeService.iconColor} transition-all duration-300 hover:shadow-md hover:scale-105 cursor-pointer`}
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-10 rounded-xl text-center transform transition-all duration-500 hover:shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à transformer votre entreprise de services ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des centaines d'entreprises qui utilisent notre plateforme
            pour optimiser leurs opérations quotidiennes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => (window.location.href = "/demo")}
              className="border-2 border-white text-white font-medium py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Demander une démo
            </button>
            <button
              onClick={() => (window.location.href = "/signup")}
              className="bg-white text-blue-800 font-medium py-3 px-8 rounded-lg hover:bg-blue-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Commencer gratuitement
            </button>
          </div>
        </div>
      </div>

      {/* CSS pour les animations */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ServiceSolutionsPage;