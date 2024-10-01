import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/StyleCliente.css';  // Importa el archivo CSS

const URI_TIPO_CLIENTE = 'http://localhost:8000/api/tipo-cliente/';

const CompCreateTipoCliente = () => {
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTipoCliente = {
            descripcion
        };

        try {
            const response = await axios.post(URI_TIPO_CLIENTE, newTipoCliente);
            if (response.status === 201) {
                setSuccessMessage("Tipo de cliente creado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/cliente/tipo-cliente/gestion-tipos-clientes');
                }, 2000);
            } else {
                setErrorMessage("Error al crear el tipo de cliente.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear el tipo de cliente.");
        }
    };

    const handleCancel = () => {
        navigate('/cliente/tipo-cliente/gestion-tipos-clientes');
    };

    return (
        <div className='form-container'>
            <h2 className='form-title'>Crear Tipo de Cliente</h2>
            
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-column">
                    <div className="form-group">
                        <label>Descripción</label>
                        <input
                            type="text"
                            className="form-control"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Botones en una fila separada */}
                <div className="form-buttons">
                    <button type="submit" className="btn btn-primary">
                        Guardar
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompCreateTipoCliente;
