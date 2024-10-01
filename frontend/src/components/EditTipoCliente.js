import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Styles/StyleCliente.css';  // Importa el archivo CSS

const URI_TIPO_CLIENTE = 'http://localhost:8000/api/tipo-cliente/';

const CompEditTipoCliente = () => {
    const { id } = useParams();  // Obtener el ID del tipo de cliente de los parámetros de la URL
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTipoCliente = async () => {
            try {
                const res = await axios.get(`${URI_TIPO_CLIENTE}${id}`);
                const tipoCliente = res.data;
                setDescripcion(tipoCliente.descripcion);
            } catch (error) {
                console.error("Error al obtener el tipo de cliente:", error);
                setErrorMessage("Error al obtener el tipo de cliente.");
            }
        };

        fetchTipoCliente();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedTipoCliente = {
            descripcion
        };

        try {
            const response = await axios.put(`${URI_TIPO_CLIENTE}${id}`, updatedTipoCliente);
            if (response.status === 200) {
                setSuccessMessage("Tipo de cliente actualizado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/cliente/tipo-cliente/gestion-tipos-clientes');
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar el tipo de cliente.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al actualizar el tipo de cliente.");
        }
    };

    const handleCancel = () => {
        navigate('/cliente/tipo-cliente/gestion-tipos-clientes');
    };

    return (
        <div className='form-container'>
            <h2 className='form-title'>Editar Tipo de Cliente</h2>
            
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className='form-grid'>
                <div className='form-column'>
                    <div className='form-group'>
                        <label>Descripción</label>
                        <input
                            type='text'
                            className='form-control'
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
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

export default CompEditTipoCliente;
