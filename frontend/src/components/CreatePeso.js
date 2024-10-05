import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI_PESO = 'http://localhost:8000/api/peso/';

const CompCreatePeso = () => {
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPeso = { descripcion };

        try {
            const response = await axios.post(URI_PESO, newPeso);
            if (response.status === 201) {
                setSuccessMessage("Peso creado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/material/peso/gestion-pesos');
                }, 2000);
            } else {
                setErrorMessage("Error al crear el peso.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear el peso.");
        }
    };

    const handleCancel = () => {
        navigate('/material/peso/gestion-pesos');
    };

    return (
        <div className='form-container'>
            <h2 className='form-title'>Crear Peso</h2>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="form-grid">
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
                <div className="form-buttons">
                    <button type="submit" className="btn btn-primary">Guardar</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default CompCreatePeso;
