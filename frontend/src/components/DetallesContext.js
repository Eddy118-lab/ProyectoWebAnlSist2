import React, { createContext, useState, useContext } from 'react';

// Context to store the form data
const DetallesContext = createContext();

// Context Provider
export const DetallesProvider = ({ children }) => {
  const [detalles, setDetalles] = useState({});

  return (
    <DetallesContext.Provider value={{ detalles, setDetalles }}>
      {children}
    </DetallesContext.Provider>
  );
};

// Hook to use the DetallesContext
export const useDetalles = () => {
  return useContext(DetallesContext);
};
