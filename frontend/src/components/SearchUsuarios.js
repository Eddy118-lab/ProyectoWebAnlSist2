import React, { useState } from 'react';
import './Styles/StyleSearchUsuarios.css';

const SearchUsuario = ({ usuarios, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="search-container-Search-Usuario">
      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        value={query}
        onChange={handleChange}
        className="search-input-Search-Usuario"  // Aquí aplicamos la clase CSS
      />
    </div>
  );
};

export default SearchUsuario;