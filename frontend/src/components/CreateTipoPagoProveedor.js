import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de incluir Bootstrap

const URI_TIPO_PAGO_PROVEEDOR = 'http://localhost:8000/api/tipo-pago-proveedor/';

const CompCreateTipoPagoProveedor = () => {
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newTipoPago = {
            descripcion
        };

        try {
            const response = await axios.post(URI_TIPO_PAGO_PROVEEDOR, newTipoPago);
            if (response.status === 201) {
                setSuccessMessage("Tipo de pago creado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/factura-proveedor/tipo-pago-proveedor/gestion-tipos-pagos-proveedores');
                }, 2000);
            } else {
                setErrorMessage("Error al crear el tipo de pago.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear el tipo de pago.");
        }
    };

    const handleCancel = () => {
        navigate('/factura-proveedor/tipo-pago-proveedor/gestion-tipos-pagos-proveedores');
    };

    return (
        <div className='container mt-5 d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            <div className='card shadow border-light' style={{ maxWidth: '600px', width: '100%' }}>
                <div className='card-body'>
                    <h2 className='form-title text-center mb-5'>Crear Tipo de Pago Proveedor</h2>
                    
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label">Descripción</label>
                            <input
                                type="text"
                                className="form-control" style={{maxWidth: '500px'}}
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                        </div>

                        <div className="d-flex justify-content-between mt-4">
                            <button type="submit" className="btn btn-primary">
                                Guardar
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompCreateTipoPagoProveedor;
