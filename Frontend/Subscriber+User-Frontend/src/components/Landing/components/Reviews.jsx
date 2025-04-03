import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import yassineImage from "../../../assets/43311630_2285080828186150_1923243834972569600_n.jpg";
import hatemImage from "../../../assets/398442211_10232899741464344_7593734908724097370_n.jpg";
import samarImage from "../../../assets/417518079_2432781833573848_6147792756573419702_n.jpg";
import clientImage from "../../../assets/417518079_2432781833573848_6147792756573419702_n.jpg";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, margin: "-10% 0px" });

  const testimonials = [
    {
      id: 1,
      name: "Yassine Ksontiny",
      role: "CEO, TechSolutions",
      image: yassineImage,
      stars: 5,
      text: "PlanyfyGo a révolutionné notre système de réservation. La plateforme est intuitive et nous a fait gagner un temps précieux dans la gestion de nos rendez-vous clients.",
      language: "fr",
      company: "TechSolutions Inc.",
    },
    {
      id: 2,
      name: "Samar Benbrahim",
      role: "Gérante, BeautyCare",
      image: samarImage,
      stars: 5,
      text: "Je recommande vivement PlanyfyGo ! Le système de rappels automatiques a réduit nos annulations de 30% et l'interface est très simple à utiliser pour mon équipe.",
      language: "fr",
      company: "BeautyCare Paris",
    },
    {
      id: 3,
      name: "Hatem Sassi",
      role: "Directeur, SpaZen",
      image: hatemImage,
      stars: 5,
      text: "الخدمة مُمتازة ومُريحة بزاف! خاصك تجربها باش تفهم قيمة الوقت اللي توفرها. الفريق دعمنا حتى بعد ما اشترينا الخدمة.",
      translation:
        "Le service est excellent et très pratique ! Il faut l'essayer pour comprendre le temps qu'il vous fait gagner. L'équipe nous a soutenu même après l'achat.",
      language: "ar-tn",
      company: "SpaZen Wellness",
    },
    {
      id: 4,
      name: "Emily Johnson",
      role: "Manager, CoWork Space",
      image: clientImage,
      stars: 5,
      text: "Perfect solution for our booking needs! The calendar sync and payment integration saved us countless hours of administrative work. Highly recommended!",
      language: "en",
      company: "Urban CoWork Space",
    },
  ];

  // Autoplay functionality
  useEffect(() => {
    let interval;
    if (autoplay && isInView) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [autoplay, testimonials.length, isInView]);

  const nextTestimonial = () => {
    setAutoplay(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setAutoplay(false);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToTestimonial = (index) => {
    setAutoplay(false);
    setCurrentIndex(index);
  };

  const progressPercentage = ((currentIndex + 1) / testimonials.length) * 100;

  return (
    <section
      className="py-32 overflow-hidden relative bg-gradient-to-b from-slate-50 via-blue-50 to-white"
      ref={containerRef}
    >
      {/* Enhanced decorative elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-purple-500/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-2/3 right-1/3 w-80 h-80 bg-gradient-to-tl from-purple-500/5 to-blue-500/10 rounded-full blur-3xl opacity-40"></div>

        <motion.div
          className="absolute top-20 left-20 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            opacity: [0.5, 0.8, 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-40 right-40 w-36 h-36 bg-indigo-400/10 rounded-full blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 40, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute top-1/2 left-1/3 w-20 h-20 bg-purple-400/10 rounded-full blur-xl"
          animate={{
            x: [0, 60, 0],
            y: [0, 30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Enhanced heading with 3D text effect */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-block relative">
            <motion.span
              className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-xl opacity-70"
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [0.98, 1.02, 0.98],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 relative inline-block">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 drop-shadow-sm">
                Témoignages Clients
              </span>

              <motion.span
                className="absolute -bottom-2 left-0 w-full h-1.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                initial={{ width: "0%" }}
                animate={isInView ? { width: "100%" } : {}}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
              />
            </h2>
          </div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Découvrez ce que nos clients disent de notre solution de réservation
            premium
          </p>
        </motion.div>

        {/* Enhanced testimonial showcase with glassmorphism */}
        <div className="relative max-w-6xl mx-auto">
          {/* Enhanced 3D progress bar */}
          <motion.div
            className="absolute -top-3 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent rounded-full overflow-hidden shadow-sm"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600"
              style={{
                backgroundSize: "200% 200%",
                boxShadow: "0 0 8px rgba(79, 70, 229, 0.4)",
              }}
              animate={{
                width: `${progressPercentage}%`,
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                width: { duration: 0.8, ease: "easeInOut" },
                backgroundPosition: {
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
          </motion.div>

          {/* Enhanced card container with advanced 3D effect */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="relative"
          >
            {/* Multiple layers for enhanced depth effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/10 rounded-3xl transform rotate-1 scale-[1.03] z-0 opacity-70"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent rounded-3xl transform -rotate-1 scale-[1.02] z-0 opacity-80"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-indigo-600/5 to-blue-600/5 rounded-3xl transform rotate-0.5 scale-[1.01] z-0 opacity-60"></div>

            {/* Enhanced glass card with subtle border glow */}
            <div className="bg-white/80 rounded-2xl shadow-2xl p-1 mt-8 backdrop-blur-sm relative z-10 border border-white/80 overflow-hidden">
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-1000"></div>

              {/* Glass effect layer */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/20 rounded-xl backdrop-blur-sm z-0"></div>

              {/* Main content container with enhanced glass effect */}
              <div className="bg-white/90 rounded-xl p-8 md:p-12 relative z-10 backdrop-blur-md">
                {/* Enhanced animated quotation mark */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.98, 1.02, 0.98],
                    rotate: [-1, 1, -1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -left-3 md:top-0 md:-left-6"
                >
                  <svg
                    className="w-20 h-20 md:w-28 md:h-28 text-blue-100"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                  >
                    <path d="M30.7,42c0,6.3,1.9,11.7,5.7,16.1c3.8,4.4,8.8,6.6,15,6.6c6,0,11-2.1,15-6.3c4-4.2,6-9.3,6-15.4  c0-4.4-0.9-8.5-2.6-12.4c-1.8-3.9-4.2-7.3-7.3-10.3c-3.1-3-6.7-5.4-11-7.3c-4.2-1.9-8.8-3-13.8-3.3l-1.8,9.2  c8.3,1.9,14.1,4.8,17.4,8.8c3.3,4,3.8,8.3,1.7,13c-2,0-3.7,0.1-4.9,0.4c-1.3,0.3-2.6,0.7-4,1.4C41.7,27.4,38.5,32.8,38.5,39  c-2.3,0-4.1-0.6-5.6-1.9c-1.5-1.3-2.2-3-2.2-5.1V42z M0,42c0,6.3,1.9,11.7,5.7,16.1c3.8,4.4,8.9,6.6,15.3,6.6  c6,0,11-2.1,15-6.3c4-4.2,6-9.3,6-15.4c0-4.4-0.9-8.5-2.6-12.4c-1.8-3.9-4.2-7.3-7.3-10.3c-3.1-3-6.7-5.4-11-7.3  C17,11,12.3,9.9,7.3,9.6L5.5,18.8c8.3,1.9,14.1,4.8,17.4,8.8c3.3,4,3.8,8.3,1.7,13c-2,0-3.7,0.1-4.9,0.4c-1.3,0.3-2.6,0.7-4,1.4  C11,27.4,7.8,32.8,7.8,39c-2.3,0-4.1-0.6-5.6-1.9C0.7,35.8,0,34.1,0,32V42z" />
                  </svg>
                </motion.div>

                {/* Enhanced content grid with improved layout */}
                <div className="grid md:grid-cols-12 gap-10 items-center">
                  {/* Enhanced profile column - 4 columns on md+ */}
                  <div className="md:col-span-4 flex flex-col items-center md:items-start">
                    {/* Enhanced profile image with advanced animations */}
                    <div className="group relative">
                      <motion.div
                        className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl mb-5 transform transition-all group-hover:scale-105 relative z-10"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/30 to-indigo-500/30 opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>

                        {/* Enhanced animated light reflection */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/80 to-white/0 opacity-0 group-hover:opacity-70"
                          animate={{
                            left: ["-100%", "200%"],
                            top: ["-100%", "200%"],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            repeatDelay: 2,
                            ease: "easeInOut",
                          }}
                        />

                        {/* Enhanced image with subtle filter */}
                        <img
                          src={testimonials[currentIndex].image}
                          alt={testimonials[currentIndex].name}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:saturate-110"
                          loading="lazy"
                        />
                      </motion.div>

                      {/* Enhanced shadow effect */}
                      <div className="absolute -bottom-2 left-0 right-0 h-6 bg-black/10 blur-md rounded-full z-0 transform scale-90"></div>

                      {/* Decorative circles */}
                      <motion.div
                        className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-80 z-0"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.8, 0.6, 0.8],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      <motion.div
                        className="absolute -left-2 -bottom-1 w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 opacity-70 z-0"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.7, 0.5, 0.7],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1,
                        }}
                      />
                    </div>

                    {/* Enhanced profile info with premium styling */}
                    <div className="text-center md:text-left mb-6">
                      <motion.h3
                        key={`name-${testimonials[currentIndex].id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
                      >
                        {testimonials[currentIndex].name}
                      </motion.h3>

                      <motion.p
                        key={`role-${testimonials[currentIndex].id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-blue-600 font-medium"
                      >
                        {testimonials[currentIndex].role}
                      </motion.p>

                      <motion.p
                        key={`company-${testimonials[currentIndex].id}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-gray-500 text-sm"
                      >
                        {testimonials[currentIndex].company}
                      </motion.p>

                      {/* Enhanced star rating with animated rays */}
                      <motion.div
                        className="mt-4 flex justify-center md:justify-start"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        {[...Array(testimonials[currentIndex].stars)].map(
                          (_, i) => (
                            <motion.div
                              key={i}
                              className="relative"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.3,
                                delay: 0.3 + i * 0.1,
                              }}
                            >
                              {/* Animated glow effect for stars */}
                              <motion.div
                                className="absolute inset-0 bg-amber-400 blur-md rounded-full opacity-0"
                                animate={{
                                  opacity: [0, 0.4, 0],
                                  scale: [0.8, 1.2, 0.8],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                  delay: i * 0.2,
                                }}
                              />
                              <svg
                                className="w-6 h-6 text-amber-400 drop-shadow-sm"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </motion.div>
                          )
                        )}
                      </motion.div>

                      {/* Enhanced language badge with glassmorphism */}
                      <motion.div
                        className="mt-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100/80 to-indigo-100/80 text-blue-700 text-xs font-medium backdrop-blur-sm border border-blue-200/30 shadow-sm">
                          {testimonials[currentIndex].language === "fr" ? (
                            <>
                              <span className="flex h-2.5 w-2.5 relative mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-30"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                              </span>
                              Français
                            </>
                          ) : testimonials[currentIndex].language ===
                            "ar-tn" ? (
                            <>
                              <span className="flex h-2.5 w-2.5 relative mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-30"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                              </span>
                              Arabe Tunisien
                            </>
                          ) : (
                            <>
                              <span className="flex h-2.5 w-2.5 relative mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-30"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                              </span>
                              English
                            </>
                          )}
                        </span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Testimonial content column with enhanced styling - 8 columns on md+ */}
                  <div className="md:col-span-8 relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={testimonials[currentIndex].id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                      >
                        {/* Enhanced testimonial text with decorative elements */}
                        <blockquote className="relative">
                          <div className="space-y-2">
                            {/* Decorative quote element */}
                            <svg
                              className="absolute -top-8 -left-8 text-blue-100 w-16 h-16 transform -scale-x-100"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                            </svg>

                            <div className="relative pl-10 pr-4">
                              {/* Enhanced vertical accent line */}
                              <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-blue-400 via-indigo-500 to-blue-600 rounded-full shadow-md"></div>

                              {/* Animated background highlight effect */}
                              <motion.div
                                className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50 to-transparent rounded-lg opacity-0"
                                animate={{
                                  opacity: [0, 0.6, 0],
                                }}
                                transition={{
                                  duration: 6,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />

                              {/* Enhanced text styling */}
                              <p className="text-2xl font-light leading-relaxed text-gray-700 italic">
                                {testimonials[currentIndex].text}
                              </p>
                            </div>
                          </div>
                        </blockquote>

                        {/* Enhanced translation box with ultra-modern glassmorphism */}
                        {testimonials[currentIndex].translation && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="mt-10 relative"
                          >
                            {/* Multi-layered background for depth */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-2xl blur-md transform rotate-1 scale-[1.02]"></div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/30 to-indigo-100/30 rounded-2xl backdrop-blur-sm"></div>

                            {/* Main translation container */}
                            <div className="p-8 bg-white/60 rounded-2xl border border-blue-100/50 shadow-lg backdrop-blur-md relative overflow-hidden">
                              {/* Animated glow effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-indigo-400/10 to-blue-400/5 opacity-0"
                                animate={{
                                  opacity: [0, 1, 0],
                                  backgroundPosition: [
                                    "0% 50%",
                                    "100% 50%",
                                    "0% 50%",
                                  ],
                                }}
                                transition={{
                                  opacity: {
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  },
                                  backgroundPosition: {
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  },
                                }}
                                style={{ backgroundSize: "200% 200%" }}
                              />

                              {/* Translation header */}
                              <div className="flex items-center mb-3">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 mr-3 shadow-md"></div>
                                <h4 className="text-sm uppercase tracking-wider text-gray-500 font-semibold">
                                  Traduction
                                </h4>
                              </div>

                              {/* Translation text with improved styling */}
                              <p className="text-gray-700 font-light relative z-10">
                                {testimonials[currentIndex].translation}
                              </p>

                              {/* Decorative corner elements */}
                              <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
                                <svg
                                  viewBox="0 0 100 100"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M0 0L100 0L100 100"
                                    stroke="url(#paint0_linear)"
                                    strokeWidth="2"
                                  />
                                  <defs>
                                    <linearGradient
                                      id="paint0_linear"
                                      x1="0"
                                      y1="0"
                                      x2="100"
                                      y2="100"
                                      gradientUnits="userSpaceOnUse"
                                    >
                                      <stop stopColor="#4F46E5" />
                                      <stop
                                        offset="1"
                                        stopColor="#3B82F6"
                                        stopOpacity="0"
                                      />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>

                              <div className="absolute bottom-0 left-0 w-16 h-16 opacity-20 transform rotate-180">
                                <svg
                                  viewBox="0 0 100 100"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M0 0L100 0L100 100"
                                    stroke="url(#paint0_linear)"
                                    strokeWidth="2"
                                  />
                                  <defs>
                                    <linearGradient
                                      id="paint0_linear"
                                      x1="0"
                                      y1="0"
                                      x2="100"
                                      y2="100"
                                      gradientUnits="userSpaceOnUse"
                                    >
                                      <stop stopColor="#4F46E5" />
                                      <stop
                                        offset="1"
                                        stopColor="#3B82F6"
                                        stopOpacity="0"
                                      />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced floating navigation controls with glow effects */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between pointer-events-none">
            <motion.button
              onClick={prevTestimonial}
              className="pointer-events-auto -ml-8 w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 backdrop-blur-sm border border-white/80 relative"
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(239, 246, 255, 0.9)",
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Témoignage précédent"
              initial={{ x: -20, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <svg
                className="w-6 h-6 text-blue-600 group-hover:text-blue-800 transition-colors relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>

              <div className="absolute w-full h-full rounded-full bg-blue-300/30 animate-ping opacity-75 group-hover:opacity-100"></div>
            </motion.button>

            <motion.button
              onClick={nextTestimonial}
              className="pointer-events-auto -mr-8 w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center transition-all group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 backdrop-blur-sm border border-white/80 relative"
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(239, 246, 255, 0.9)",
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Témoignage suivant"
              initial={{ x: 20, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{ scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <svg
                className="w-6 h-6 text-blue-600 group-hover:text-blue-800 transition-colors relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>

              <div className="absolute w-full h-full rounded-full bg-blue-300/30 animate-ping opacity-75 group-hover:opacity-100"></div>
            </motion.button>
          </div>
        </div>

        {/* Enhanced profile selector with modern indicators */}
        <motion.div
          className="flex flex-wrap justify-center mt-16 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.button
              key={index}
              onClick={() => goToTestimonial(index)}
              className="group flex flex-col items-center transition-all focus:outline-none"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Afficher le témoignage de ${testimonial.name}`}
            >
              <div className="relative">
                {/* Enhanced profile indicator with glassmorphism */}
                <div
                  className={`w-16 h-16 rounded-full overflow-hidden transition-all duration-500 mb-3 ${
                    currentIndex === index
                      ? "ring-4 ring-blue-500 ring-offset-4 shadow-lg scale-110"
                      : "ring-2 ring-gray-200 ring-offset-2 filter grayscale hover:grayscale-0 opacity-60 hover:opacity-100 hover:ring-blue-300"
                  }`}
                >
                  {/* Overlay for active item */}
                  {currentIndex === index && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}

                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Animated glow for active item */}
                  {currentIndex === index && (
                    <motion.div
                      className="absolute -inset-1 bg-blue-500/20 rounded-full blur-md z-0"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </div>

                {/* Enhanced active indicator dot */}
                {currentIndex === index && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                    layoutId="activeDot"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <motion.div
                      className="w-6 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-sm"
                      animate={{
                        width: ["24px", "16px", "24px"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {/* Enhanced name label with gradient effect for active item */}
              <span
                className={`text-sm font-medium transition-all ${
                  currentIndex === index
                    ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                {testimonial.name.split(" ")[0]}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
