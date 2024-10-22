import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de tener Bootstrap importado

const URI_TIPO_PAGO_CLIENTE = 'http://localhost:8000/api/tipo-pago-cliente';

const CompEditTipoPagoCliente = () => {
    const { id } = useParams();  // Obtener el ID del tipo de pago de los parámetros de la URL
    const [descripcion, setDescripcion] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTipoPago = async () => {
            try {
                const res = await axios.get(`${URI_TIPO_PAGO_CLIENTE}/${id}`);
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
            const response = await axios.put(`${URI_TIPO_PAGO_CLIENTE}/${id}`, updatedTipoPago);
            if (response.status === 200) {
                setSuccessMessage("Tipo de pago actualizado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/factura-cliente/tipo-pago-cliente/gestion-tipos-pagos-clientes'); // Cambia esta ruta si es necesario
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
        navigate('/factura-cliente/tipo-pago-cliente/gestion-tipos-pagos-clientes'); // Cambia esta ruta si es necesario
    };

    return (
        <div className='container d-flex justify-content-center align-items-center vh-100'>
            <div className="border rounded p-4 shadow" style={{ maxWidth: '900px', backgroundColor: '#f8f9fa' }}>
                <h2 className='text-center mb-4'>Editar Tipo de Pago</h2>
                
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <input
                            type='text'
                            className='form-control'
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>

                    {/* Botones en una fila separada y centrados */}
                    <div className="text-center">
                        <button type='submit' className='btn btn-primary me-2'>Actualizar</button>
                        <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompEditTipoPagoCliente;
