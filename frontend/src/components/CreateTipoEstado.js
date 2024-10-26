import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const URI_TIPO_ESTADO = 'http://localhost:8000/api/tipo-estado';

const CompCreateTipoEstado = () => {
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTipoEstado = {
            descripcion // Solo se incluye la descripción
        };

        try {
            const response = await axios.post(URI_TIPO_ESTADO, newTipoEstado);
            if (response.status === 201) {
                setSuccessMessage("Tipo de estado creado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/asignacion/tipo-estado/gestion-tipos-estados');
                }, 2000);
            } else {
                setErrorMessage("Error al crear el tipo de estado.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear el tipo de estado.");
        }
    };

    const handleCancel = () => {
        navigate('/asignacion/tipo-estado/gestion-tipos-estados');
    };

    return (
        <div className='container mt-5' style={{ marginTop: '120px' }}> {/* Aumentar el margen superior */}
            <h2 className='container mt-5 text-center mb-4'>Crear Tipo de Estado</h2>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <input
                        type="text"
                        className="form-control"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                </div>

                {/* Botones en una fila separada */}
                <div className="d-flex justify-content-between">
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

export default CompCreateTipoEstado;
