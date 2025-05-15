import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, ArrowDown, Sparkles, User, Clock, Package2, Image } from 'lucide-react';

// Importation des images depuis le dossier assets
import horaireImage from '../../assets/horraire.png';
import employeeImage from '../../assets/ajout employee.png';
import serviceImage from '../../assets/ajout service.png';
import mediaImage from '../../assets/media.png';

const EnhancedOnboardingCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('next');
  const [activePage, setActivePage] = useState(
    () => localStorage.getItem("activePage") || "dashboard"
  );
  const [linkCopied, setLinkCopied] = useState(false);
  const [tenant, setTenant] = useState(window.location.hostname.split(".")[0] || "demo");
  
  const slides = [
    {
      title: "Bienvenue sur PlanifyGo 👋",
      description: "Découvrez comment configurer votre espace de réservation en quelques étapes simples pour commencer à recevoir des rendez-vous rapidement.",
      imageSrc: null,
      isIntro: true,
      icon: <Sparkles className="text-amber-500" size={32} />,
      color: "from-amber-300 to-amber-500"
    },
    {
      title: "1. Configurez vos horaires",
      description: "Définissez vos jours de travail et vos heures de disponibilité pour permettre les réservations à ces moments précis.",
      imageSrc: horaireImage,
      alt: "Configuration des horaires de travail",
      icon: <Clock className="text-teal-600" size={32} />,
      features: [
        "Activez ou désactivez chaque jour de la semaine",
        "Définissez des plages horaires différentes selon les jours",
        "Appliquez les mêmes horaires à tous les jours en un clic"
      ],
      color: "from-teal-300 to-teal-500"
    },
    {
      title: "2. Gérez votre équipe",
      description: "Ajoutez vos collaborateurs et définissez leurs disponibilités pour proposer leurs services à la réservation.",
      imageSrc: employeeImage,
      alt: "Gestion des employés",
      icon: <User className="text-blue-600" size={32} />,
      features: [
        "Créez des comptes pour chaque membre de l'équipe",
        "Personnalisez leurs horaires et services",
        "Suivez leur activité et leur planning"
      ],
      color: "from-blue-300 to-blue-500"
    },
    {
      title: "3. Créez vos services",
      description: "Configurez les prestations que vous proposez avec leur durée, tarif et détails.",
      imageSrc: serviceImage,
      alt: "Configuration des services",
      icon: <Package2 className="text-violet-600" size={32} />,
      features: [
        "Définissez durée et prix pour chaque service",
        "Assignez les services aux membres de l'équipe qualifiés",
        "Ajoutez des descriptions détaillées pour vos clients"
      ],
      color: "from-violet-300 to-violet-500"
    },
    {
      title: "4. Personnalisez votre image",
      description: "Ajoutez votre identité visuelle avec logo, photos et éléments de marque pour vous démarquer.",
      imageSrc: mediaImage,
      alt: "Gestion des médias",
      icon: <Image className="text-rose-600" size={32} />,
      features: [
        "Téléchargez votre logo pour personnaliser votre espace",
        "Ajoutez des photos de qualité de votre établissement",
        "Créez une galerie attractive pour vos clients"
      ],
      color: "from-rose-300 to-rose-500"
    },
    {
      title: "🎉 Votre espace est prêt !",
      description: "Félicitations ! Votre espace de réservation est configuré et prêt à accueillir vos clients.",
      imageSrc: null,
      isOutro: true,
      icon: <Sparkles className="text-amber-500" size={32} />,
      color: "from-amber-300 to-amber-500",
      finalSteps: [
        "Partagez votre lien de réservation sur vos réseaux sociaux",
        "Intégrez le widget de réservation sur votre site web",
        "Commencez à recevoir vos premières réservations"
      ]
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1 && !animating) {
      setAnimating(true);
      setAnimationDirection('next');
      setCurrentSlide(currentSlide + 1);
      setTimeout(() => setAnimating(false), 600);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0 && !animating) {
      setAnimating(true);
      setAnimationDirection('prev');
      setCurrentSlide(currentSlide - 1);
      setTimeout(() => setAnimating(false), 600);
    }
  };

  const goToSlide = (index) => {
    if (!animating) {
      setAnimating(true);
      setAnimationDirection(index > currentSlide ? 'next' : 'prev');
      setCurrentSlide(index);
      setTimeout(() => setAnimating(false), 600);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, animating]);

  const currentSlideData = slides[currentSlide];
  const progress = ((currentSlide) / (slides.length - 1)) * 100;

  const copyToClipboard = (text) => {
    // Try using Clipboard API first
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setLinkCopied(true);
          setTimeout(() => setLinkCopied(false), 2000);
        })
        .catch(err => {
          fallbackCopyToClipboard(text);
        });
    } else {
      fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    // Create temporary element
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      setLinkCopied(successful);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-purple-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-20 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative z-10">
        {/* Progress bar */}
        <div className="h-3 bg-gray-100 w-full">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-violet-400 transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="p-8 md:p-12">
          {/* Main content area */}
          <div className="min-h-[640px] relative">
            {/* Slide title and description */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${currentSlideData.color} bg-opacity-20`}>
                  {currentSlideData.icon}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 transition-all duration-300 ease-in-out tracking-tight">
                  {currentSlideData.title}
                </h1>
              </div>
              <p className="text-gray-600 text-lg md:text-xl max-w-3xl">
                {currentSlideData.description}
              </p>
            </div>
            
            {/* Image display with features */}
            {currentSlideData.imageSrc && (
              <div className={`mt-8 flex flex-col md:flex-row items-center gap-8 transform transition-all duration-700 ease-out ${animating ? (animationDirection === 'next' ? 'translate-x-10 opacity-0' : '-translate-x-10 opacity-0') : 'translate-x-0 opacity-100'}`}>
                <div className="md:w-2/3 rounded-2xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-gray-50 to-gray-100 flex items-center px-4 border-b border-gray-200">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                      </div>
                      <div className="mx-auto text-gray-500 text-sm">
                        PlanifyGo - {currentSlideData.alt}
                      </div>
                    </div>
                    <img 
                      src={currentSlideData.imageSrc} 
                      alt={currentSlideData.alt} 
                      className="w-full h-auto object-cover mt-12"
                    />
                  </div>
                </div>
                
                {currentSlideData.features && (
                  <div className="md:w-1/3 transform transition-all duration-700 delay-100 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentSlideData.color} flex items-center justify-center mr-3`}>
                        {currentSlideData.icon}
                      </div>
                      Fonctionnalités clés
                    </h3>
                    <ul className="space-y-4">
                      {currentSlideData.features.map((feature, index) => (
                        <li key={index} className="flex items-start animate-fadeIn" style={{ animationDelay: `${index * 200}ms` }}>
                          <div className="mt-1 mr-3 flex-shrink-0 text-white p-0.5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full">
                            <CheckCircle size={18} className="text-white" strokeWidth={2.5} />
                          </div>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Intro content */}
            {currentSlideData.isIntro && (
              <div className="flex flex-col items-center justify-center mt-12 space-y-10">
                <div className="text-center max-w-2xl mx-auto">
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Suivez ce guide interactif pour configurer votre espace de réservation et commencer à recevoir vos clients en quelques minutes.
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
                    {slides.slice(1, 5).map((slide, index) => (
                      <div 
                        key={index} 
                        className={`bg-white p-5 rounded-xl border border-gray-100 flex flex-col items-center hover:shadow-lg transition-all duration-300 cursor-pointer animate-fadeIn`}
                        style={{ animationDelay: `${index * 150}ms` }}
                        onClick={() => goToSlide(index + 1)}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${slide.color} flex items-center justify-center mb-3 transform transition-transform hover:scale-110`}>
                          {slide.icon}
                        </div>
                        <p className="font-medium text-gray-700 text-center">{slide.title.split('.')[1]}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="animate-bounce bg-white p-4 rounded-full shadow-md border border-gray-100">
                  <ArrowDown size={32} className="text-gray-400" />
                </div>
              </div>
            )}
            
            {/* Outro content */}
            {currentSlideData.isOutro && (
              <div className="flex flex-col items-center justify-center mt-12 space-y-8">
                <div className="relative">
                  <div className="absolute -inset-12 bg-gradient-to-r from-amber-200 via-violet-200 to-rose-200 rounded-full opacity-40 blur-2xl animate-pulse"></div>
                  <div className="animate-bounce">
                    <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-6 rounded-full shadow-lg relative">
                      <CheckCircle size={80} className="text-white" />
                    </div>
                  </div>
                </div>
                
                {currentSlideData.finalSteps && (
                  <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-lg border border-gray-100">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Prochaines étapes</h3>
                    <ul className="space-y-5">
                      {currentSlideData.finalSteps.map((step, index) => (
                        <li key={index} className="flex items-center bg-gray-50 rounded-xl p-4 animate-fadeIn" style={{ animationDelay: `${index * 200}ms` }}>
                          <div className="mr-4 flex-shrink-0 bg-gradient-to-br from-blue-400 to-violet-500 p-3 rounded-xl">
                            <span className="font-bold text-white text-xl">{index + 1}</span>
                          </div>
                          <span className="text-gray-700 text-lg">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="bg-white rounded-2xl p-6 max-w-2xl mx-auto shadow-lg border border-gray-100">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    Lien de réservation
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    Voici le lien unique que vos clients peuvent utiliser pour effectuer des réservations:
                  </p>
                  
                  <div className="mt-4 relative">
                    <div 
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 break-all font-mono text-sm"
                    >
                      {`${tenant}.127.0.0.1.nip.io:5173/reservation`}
                    </div>
                    
                    <button 
                      onClick={() => copyToClipboard(`${tenant}.127.0.0.1.nip.io:5173/reservation`)}
                      className="absolute -right-3 -top-3 bg-gradient-to-r from-blue-400 to-violet-500 text-white p-2 rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {linkCopied ? (
                        <CheckCircle size={20} className="animate-appear" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                        </svg>
                      )}
                    </button>
                    
                    {/* Feedback message */}
                    <div className={`absolute left-0 right-0 -bottom-8 transition-all duration-300 text-center ${
                      linkCopied 
                        ? "opacity-100 transform translate-y-0" 
                        : "opacity-0 transform -translate-y-2"
                    }`}>
                      <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                        Lien copié!
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-center items-center space-x-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                    <p className="text-sm text-blue-500">
                      Pro Tip: Intégrez ce lien sur votre site web ou partagez-le directement avec vos clients
                    </p>
                  </div>
                </div>
                
                <p className="text-lg font-medium text-gray-700 mt-6">
                  Besoin d'aide ? Contactez notre support à <a href="/support" className="text-blue-500 hover:text-blue-600 transition-colors hover:underline">support@planifygo.com</a>
                </p>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <div className="mt-12 flex justify-between items-center">
            <button 
              onClick={prevSlide}
              disabled={currentSlide === 0 || animating}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 ${currentSlide === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <ChevronLeft size={24} />
              <span className="font-medium">Précédent</span>
            </button>
            
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    index === currentSlide 
                      ? 'bg-gradient-to-r from-blue-400 to-violet-500 w-8 shadow-md' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  aria-label={`Aller à la diapositive ${index + 1}`}
                ></button>
              ))}
            </div>
            
            {currentSlide < slides.length - 1 ? (
              <button 
                onClick={nextSlide}
                disabled={animating}
                className="group px-6 py-3 rounded-xl flex items-center gap-2 text-gray-600 hover:bg-gray-50 transition-all duration-300"
              >
                <span className="font-medium">Suivant</span>
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button 
                className="px-8 py-3 bg-gradient-to-r from-blue-400 to-violet-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:shadow-blue-200/50 hover:translate-y-[-2px] transition-all duration-300"
                onClick={() => {
                  // Stocker la page des horaires comme page active
                  localStorage.setItem('activePage', 'workinghours');
                  // Redirection vers le Dashboard qui ouvrira la page des horaires
                  window.location.href = window.location.pathname;
                }}
              >
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 17.5l-9.9 1.1-9.9-1.1"></path>
                    <path d="M12 2l3.5 10.5H20l-7 5 3 9.5-8-6.5-8 6.5 3-9.5-7-5h4.5L12 2z"></path>
                  </svg>
                  Commencer maintenant
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 30px) scale(0.95); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes appear {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-appear {
          animation: appear 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EnhancedOnboardingCarousel;