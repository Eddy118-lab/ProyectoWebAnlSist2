import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const URI_CONDUCTOR = 'http://localhost:8000/api/conductor/';

const CreateConductor = () => {
    const [primerNombre, setPrimerNombre] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [noLicencia, setNoLicencia] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [fechaContratacion, setFechaContratacion] = useState('');
    const [frontImagen, setFrontImagen] = useState(null); // Imagen frontal de licencia
    const [trasImagen, setTrasImagen] = useState(null);  // Imagen trasera de licencia
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('primer_nom', primerNombre);
        formData.append('segundo_nombre', segundoNombre);
        formData.append('primer_apell', primerApellido);
        formData.append('segundo_apell', segundoApellido);
        formData.append('no_licencia', noLicencia);
        formData.append('telefono', telefono);
        formData.append('email', email);
        formData.append('fecha_contratacion', fechaContratacion);
        formData.append('front_imagen_url', frontImagen);
        formData.append('tras_imagen_url', trasImagen);

        try {
            const response = await axios.post(URI_CONDUCTOR, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                setSuccessMessage("Conductor creado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/conductor/gestion-conductores');
                }, 2000);
            } else {
                setErrorMessage("Error al crear el conductor.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al crear el conductor.");
        }
    };

    const handleCancel = () => {
        navigate('/conductor/gestion-conductores');
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-lg mx-auto" style={{ marginTop: '60px', maxWidth: '900px' }}>
                <div className="card-header text-center">
                    <h3 className="mb-0">Crear Conductor</h3>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Primer Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={primerNombre}
                                        onChange={(e) => setPrimerNombre(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Segundo Nombre</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={segundoNombre}
                                        onChange={(e) => setSegundoNombre(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Primer Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={primerApellido}
                                        onChange={(e) => setPrimerApellido(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Segundo Apellido</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={segundoApellido}
                                        onChange={(e) => setSegundoApellido(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">No. Licencia</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={noLicencia}
                                        onChange={(e) => setNoLicencia(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha de Contratación</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={fechaContratacion}
                                        onChange={(e) => setFechaContratacion(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Imagen Frontal de Licencia</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => setFrontImagen(e.target.files[0])}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label className="form-label">Imagen Trasera de Licencia</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) => setTrasImagen(e.target.files[0])}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-center mt-4">
                            <button type="submit" className="btn btn-primary me-2">Guardar</button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateConductor;
