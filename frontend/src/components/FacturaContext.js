// src/context/FacturaContext.js
import React, { createContext, useState } from 'react';

// Crear el contexto
export const FacturaContext = createContext();

// Proveedor del contexto
export const FacturaProvider = ({ children }) => {
    const [facturaDetalle, setFacturaDetalle] = useState([]); // Detalle de la factura
    const [selectedCliente, setSelectedCliente] = useState(null); // Cliente seleccionado

    return (
        <FacturaContext.Provider value={{ facturaDetalle, setFacturaDetalle, selectedCliente, setSelectedCliente }}>
            {children}
        </FacturaContext.Provider>
    );
};
