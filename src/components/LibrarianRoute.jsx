import React from 'react';
import { Navigate } from 'react-router-dom';

const LibrarianRoute = ({ children }) => {
  const isBibliotecario = localStorage.getItem('sgp-uci-is_bibliotecario') === 'true';

  if (!isBibliotecario) {
    // Si no es bibliotecario, redirige al home
    return <Navigate to="/home" replace />;
  }

  // Si es bibliotecario, muestra el contenido protegido
  return children;
};

export default LibrarianRoute;