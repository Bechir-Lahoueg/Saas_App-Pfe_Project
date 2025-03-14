import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../../public/LoadingSpinner'; // Assurez-vous que le chemin est correct

const DelayedLoadingWrapper = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Délai de 2 secondes

    return () => clearTimeout(timer); // Nettoyer le timer
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return children; // Afficher le contenu une fois le délai écoulé
};

export default DelayedLoadingWrapper;