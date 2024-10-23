import React, { createContext, useState, useContext } from 'react';

// Contexto para almacenar las selecciones de fechas
const SeleccionContext = createContext();

// Proveedor del contexto
export const SeleccionProvider = ({ children }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  return (
    <SeleccionContext.Provider value={{ selectedDates, setSelectedDates }}>
      {children}
    </SeleccionContext.Provider>
  );
};

// Hook para usar el SeleccionContext
export const useSeleccion = () => {
  return useContext(SeleccionContext);
};
