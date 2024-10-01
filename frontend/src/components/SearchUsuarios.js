import React, { useState} from 'react';
import './Styles/StyleSearch.css';

const SearchUsuario = ({ usuarios, onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
  };

  return (
      <div className="search-container">
          <input
              type="text"
              placeholder='Buscar por nombre o email...'
              value={query}
              onChange={handleChange}
              className="search-input"
          />
      </div>
  );
};

export default SearchUsuario;