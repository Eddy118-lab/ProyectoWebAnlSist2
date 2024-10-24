import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const URI_DIMENSION = 'http://localhost:8000/api/dimension';

const CompCreateDimension = () => {
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newDimension = {
            descripcion
        };

        try {
            const response = await axios.post(URI_DIMENSION, newDimension);
            if (response.status === 201) {
                setSuccessMessage("Dimensión creada con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/material/dimension/gestion-dimensiones'); 
                }, 2000);
            } else {
                setErrorMessage("Error al crear la dimensión.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear la dimensión.");
        }
    };

    const handleCancel = () => {
        navigate('/material/dimension/gestion-dimensiones'); 
    };

    return (
        <div className='container mt-5 form-container'>
            <h2 className='container mt-5 form-title'>Crear Dimensión</h2>
            
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-column">
                    <div className="form-group">
                        <label>Nombre</label>
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

export default CompCreateDimension;
