import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const URI_TIPO_PROVEEDOR = 'http://localhost:8000/api/tipo-proveedor/';

const CompCreateTipoProveedor = () => {
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTipoProveedor = {
            descripcion
        };

        try {
            const response = await axios.post(URI_TIPO_PROVEEDOR, newTipoProveedor);
            if (response.status === 201) {
                setSuccessMessage("Tipo de proveedor creado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/proveedor/tipo-proveedor/gestion-tipos-proveedores');
                }, 2000);
            } else {
                setErrorMessage("Error al crear el tipo de proveedor.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear el tipo de proveedor.");
        }
    };

    const handleCancel = () => {
        navigate('/proveedor/tipo-proveedor/gestion-tipos-proveedores');
    };

    return (
        <div className='form-container'>
            <h2 className='form-title'>Crear Tipo de Proveedor</h2>
            
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

export default CompCreateTipoProveedor;
