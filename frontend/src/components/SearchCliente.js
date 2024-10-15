import { useState } from 'react';
import './Styles/StyleSearchCliente.css';

const SearchCliente = ({ clientes, onSearch }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setLoading(true);

        // Filtrar sugerencias basadas en el nombre o email del cliente
        const filteredSuggestions = clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(value.toLowerCase()) ||
            cliente.email.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);

        // Llamar a la función de búsqueda con la consulta actual
        onSearch(value);
        setLoading(false);
    };

    const clearSearch = () => {
        setQuery('');
        setSuggestions([]);
        onSearch('');
    };

    return (
        <div className='search-bar-Search-Cliente'>
            <div className='input-container-Search-Cliente'>
                <input
                    type='text'
                    className='form-control-Search-Cliente'
                    placeholder='Buscar por nombre o email...'
                    value={query}
                    onChange={handleChange}
                />
                {query && (
                    <button className='clear-btn-Search-Cliente' onClick={clearSearch}>
                        &#10006;
                    </button>
                )}
            </div>

            {loading ? (
                <div className="loading-spinner-Search-Cliente">Cargando...</div>
            ) : (
                suggestions.length > 0 && (
                    <ul className="suggestions-list-Search-Cliente">
                        {suggestions.map((cliente, index) => (
                            <li key={index} className="suggestion-item-Search-Cliente">
                                {cliente.nombre} ({cliente.email})
                            </li>
                        ))}
                    </ul>
                )
            )}
        </div>
    );
};

export default SearchCliente;
