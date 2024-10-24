import axios from 'axios';
import { useState, useEffect, useCallback } from 'react'; // Usar useCallback para evitar advertencias de dependencias
import { useParams, useNavigate } from 'react-router-dom';

const URI_PESO = 'http://localhost:8000/api/peso/';

const CompEditPeso = () => {
    const { id } = useParams();  // Obtener el ID del peso de los parámetros de la URL
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Función para obtener el peso
    const getPeso = useCallback(async () => {
        try {
            const response = await axios.get(`${URI_PESO}${id}`);
            setDescripcion(response.data.descripcion); // Cambiado a 'descripcion'
        } catch (error) {
            console.error("Error al obtener el peso:", error);
            setErrorMessage("Error al obtener el peso.");
        }
    }, [id]); // Asegúrate de incluir 'id' como dependencia

    useEffect(() => {
        getPeso();
    }, [getPeso]); // Ahora puedes incluir 'getPeso' aquí

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedPeso = { descripcion }; // Cambiado a 'descripcion'

        try {
            const response = await axios.put(`${URI_PESO}${id}`, updatedPeso);
            if (response.status === 200) {
                setSuccessMessage("Peso actualizado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/material/peso/gestion-pesos'); // Reemplaza con la ruta correcta
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar el peso.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al actualizar el peso.");
        }
    };

    const handleCancel = () => {
        navigate('/material/peso/gestion-pesos'); // Reemplaza con la ruta correcta
    };

    return (
        <div className='container mt-5 form-container'>
            <h2 className='container mt-5 form-title'>Editar Peso</h2>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group">
                    <label>Descripción</label>
                    <input
                        type="text"
                        className="form-control"
                        value={descripcion} // Cambiado a 'descripcion'
                        onChange={(e) => setDescripcion(e.target.value)} // Cambiado a 'setDescripcion'
                        required
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit" className="btn btn-primary">Actualizar</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default CompEditPeso;
