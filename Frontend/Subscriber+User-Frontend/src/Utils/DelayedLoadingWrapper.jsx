import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const DelayedLoadingWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const location = useLocation();
  
  // Liste des chemins où le loading ne doit pas s'afficher
  const excludedPaths = ['/', '/connexion', '/inscription'];
  
  // Vérifier si le chemin actuel est exclu
  const shouldSkipLoading = excludedPaths.includes(location.pathname);
  
  // Durée de chargement personnalisée selon la page
  const getLoadingDuration = (path) => {
    // Pages qui nécessitent plus de temps de chargement
    if (path.includes('/dashbord')) return 3500;
    if (path.includes('/demo')) return 3000;
    if (path.includes('/paiement')) return 2500;
    if (path.includes('/tarification')) return 2500;

    // Durée par défaut
    return 2000;
  };
  
  useEffect(() => {
    // Si le chemin est exclu, ne pas afficher le loading
    if (shouldSkipLoading) {
      setIsLoading(false);
      return;
    }
    
    // Obtenir la durée de chargement pour cette page
    const duration = getLoadingDuration(location.pathname);
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    // Simuler une progression de chargement
    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setLoadingProgress(progress * 100);
      
      if (progress < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        setIsLoading(false);
      }
    };
    
    // Attendre un délai court avant de commencer l'animation
    // pour éviter des transitions trop rapides lors de la navigation
    const initialDelay = setTimeout(() => {
      requestAnimationFrame(updateProgress);
    }, 100);
    
    return () => {
      clearTimeout(initialDelay);
    };
  }, [location.pathname, shouldSkipLoading]);
  
  if (isLoading) {
    return <LoadingSpinner progress={loadingProgress} />;
  }
  
  return children;
};

export default DelayedLoadingWrapper;