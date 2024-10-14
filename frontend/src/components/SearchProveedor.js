import { useState } from 'react';
import './Styles/StyleSearchProveedor.css';


const SearchProveedor = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <div className='search-bar-Search-Proveedor'>
            <input
                type='text'
                className='form-control-Search-Proveedor'
                placeholder='Buscar por nombre o email...'
                value={query}
                onChange={handleChange}
            />
        </div>
    );
};

export default SearchProveedor;