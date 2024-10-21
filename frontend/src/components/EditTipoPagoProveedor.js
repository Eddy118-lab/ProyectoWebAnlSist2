import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de incluir Bootstrap

const URI_TIPO_PAGO_PROVEEDOR = 'http://localhost:8000/api/tipo-pago-proveedor';

const CompEditTipoPagoProveedor = () => {
    const { id } = useParams();  // Obtener el ID del tipo de pago de los parámetros de la URL
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTipoPago = async () => {
            try {
                const res = await axios.get(`${URI_TIPO_PAGO_PROVEEDOR}/${id}`);
                const tipoPago = res.data;
                setDescripcion(tipoPago.descripcion);
            } catch (error) {
                console.error("Error al obtener el tipo de pago:", error);
                setErrorMessage("Error al obtener el tipo de pago.");
            }
        };

        fetchTipoPago();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedTipoPago = {
            descripcion
        };

        try {
            const response = await axios.put(`${URI_TIPO_PAGO_PROVEEDOR}/${id}`, updatedTipoPago);
            if (response.status === 200) {
                setSuccessMessage("Tipo de pago actualizado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/factura-proveedor/tipo-pago-proveedor/gestion-tipos-pagos-proveedores'); // Cambia esta ruta si es necesario
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar el tipo de pago.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al actualizar el tipo de pago.");
        }
    };

    const handleCancel = () => {
        navigate('/factura-proveedor/tipo-pago-proveedor/gestion-tipos-pagos-proveedores'); // Cambia esta ruta si es necesario
    };

    return (
        <div className='container mt-5 d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            <div className='card shadow border-light' style={{ maxWidth: '600px', width: '100%' }}>
                <div className='card-body'>
                    <h2 className='form-title text-center mb-4'>Editar Tipo de Pago</h2>
                    
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label">Descripción</label>
                            <input
                                type='text'
                                className='form-control'
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </div>

                        <div className='d-flex justify-content-between mt-4'>
                            <button type='submit' className='btn btn-primary'>Actualizar</button>
                            <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompEditTipoPagoProveedor;
