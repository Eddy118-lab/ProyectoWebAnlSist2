import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI_TIPO_PAGO_CLIENTE = 'http://localhost:8000/api/tipo-pago-cliente/';

const CompCreateTipoPagoCliente = () => {
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
            const response = await axios.post(URI_TIPO_PAGO_CLIENTE, newTipoPago);
            if (response.status === 201) {
                setSuccessMessage("Tipo de pago creado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/factura-cliente/tipo-pago-cliente/gestion-tipos-pagos-clientes'); // Cambia esta ruta si es necesario
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
        navigate('/factura-cliente/tipo-pago-cliente/gestion-tipos-pagos-clientes'); // Cambia esta ruta si es necesario
    };

    return (
        <div className='container d-flex justify-content-center align-items-center vh-100'>
            <div className="border rounded p-4 shadow" style={{ maxWidth: '900px', backgroundColor: '#f8f9fa' }}>
                <h2 className='text-center mb-4'>Crear Tipo de Pago</h2>
                
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                
                <form onSubmit={handleSubmit}>
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

                    {/* Botones en una fila separada y centrados */}
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary me-2">
                            Guardar
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompCreateTipoPagoCliente;
