import axios from 'axios';
import { useState, useEffect, useCallback } from 'react'; // Usar useCallback para evitar advertencias de dependencias
import { useParams, useNavigate } from 'react-router-dom';

const URI_DIMENSION = 'http://localhost:8000/api/dimension/'; // Reemplaza con la URL correcta de tu API

const CompEditDimension = () => {
    const { id } = useParams();  // Obtener el ID de la dimensión de los parámetros de la URL
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Función para obtener la dimensión
    const getDimension = useCallback(async () => {
        try {
            const response = await axios.get(`${URI_DIMENSION}${id}`);
            setDescripcion(response.data.descripcion); // Cambiado a 'descripcion'
        } catch (error) {
            console.error("Error al obtener la dimensión:", error);
            setErrorMessage("Error al obtener la dimensión.");
        }
    }, [id]); // Asegúrate de incluir 'id' como dependencia

    useEffect(() => {
        getDimension();
    }, [getDimension]); // Ahora puedes incluir 'getDimension' aquí

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedDimension = {
            descripcion // Cambiado a 'descripcion'
        };

        try {
            const response = await axios.put(`${URI_DIMENSION}${id}`, updatedDimension);
            if (response.status === 200) {
                setSuccessMessage("Dimensión actualizada con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/material/dimension/gestion-dimensiones'); // Reemplaza con la ruta correcta
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar la dimensión.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al actualizar la dimensión.");
        }
    };

    const handleCancel = () => {
        navigate('/material/dimension/gestion-dimensiones'); // Reemplaza con la ruta correcta
    };

    return (
        <div className='container mt-5 form-container'>
            <h2 className='container mt-5 form-title'>Editar Dimensión</h2>
            
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className='form-grid'>
                <div className='form-column'>
                    <div className='form-group'>
                        <label>Descripción</label>
                        <input
                            type='text'
                            className='form-control'
                            value={descripcion} // Cambiado a 'descripcion'
                            onChange={(e) => setDescripcion(e.target.value)} // Cambiado a 'setDescripcion'
                            required
                        />
                    </div>
                </div>

                <div className='form-buttons'>
                    <button type='submit' className='btn btn-primary'>Actualizar</button>
                    <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default CompEditDimension;
