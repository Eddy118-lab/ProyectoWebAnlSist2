import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de incluir Bootstrap

const URI_TIPO_PROVEEDOR = 'http://localhost:8000/api/tipo-proveedor/';

const CompEditTipoProveedor = () => {
    const { id } = useParams();  // Obtener el ID del tipo de proveedor de los parámetros de la URL
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTipoProveedor = async () => {
            try {
                const res = await axios.get(`${URI_TIPO_PROVEEDOR}${id}`);
                const tipoProveedor = res.data;
                setDescripcion(tipoProveedor.descripcion);
            } catch (error) {
                console.error("Error al obtener el tipo de proveedor:", error);
                setErrorMessage("Error al obtener el tipo de proveedor.");
            }
        };

        fetchTipoProveedor();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedTipoProveedor = {
            descripcion
        };

        try {
            const response = await axios.put(`${URI_TIPO_PROVEEDOR}${id}`, updatedTipoProveedor);
            if (response.status === 200) {
                setSuccessMessage("Tipo de proveedor actualizado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/proveedor/tipo-proveedor/gestion-tipos-proveedores');
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar el tipo de proveedor.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al actualizar el tipo de proveedor.");
        }
    };

    const handleCancel = () => {
        navigate('/proveedor/tipo-proveedor/gestion-tipos-proveedores');
    };

    return (
        <div className='d-flex justify-content-center align-items-center min-vh-100'>
            <div className='card shadow-sm'>
                <div className='card-body' style={{ maxWidth: '200px' }}>
                    <h2 className='form-title text-center'>Editar Tipo de Proveedor</h2>
                    
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className='mb-3'>
                            <label className='form-label'>Descripción</label>
                            <input
                                type='text'
                                className='form-control'
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </div>

                        <div className='d-flex justify-content-between'>
                            <button type='submit' className='btn btn-primary'>Actualizar</button>
                            <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompEditTipoProveedor;
