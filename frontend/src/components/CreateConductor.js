import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/StyleConductor.css';  // Importa el archivo CSS

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

        // FormData para manejar la subida de archivos
        const formData = new FormData();
        formData.append('primer_nom', primerNombre);
        formData.append('segundo_nombre', segundoNombre);
        formData.append('primer_apell', primerApellido);
        formData.append('segundo_apell', segundoApellido);
        formData.append('no_licencia', noLicencia);
        formData.append('telefono', telefono);
        formData.append('email', email);
        formData.append('fecha_contratacion', fechaContratacion);
        formData.append('front_imagen_url', frontImagen);  // Archivo imagen
        formData.append('tras_imagen_url', trasImagen);    // Archivo imagen

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
        <div className='form-container'>
            <h2 className='form-title'>Crear Conductor</h2>
            
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-column">
                    <div className="form-group">
                        <label>Primer Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={primerNombre}
                            onChange={(e) => setPrimerNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Segundo Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={segundoNombre}
                            onChange={(e) => setSegundoNombre(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Primer Apellido</label>
                        <input
                            type="text"
                            className="form-control"
                            value={primerApellido}
                            onChange={(e) => setPrimerApellido(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Segundo Apellido</label>
                        <input
                            type="text"
                            className="form-control"
                            value={segundoApellido}
                            onChange={(e) => setSegundoApellido(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="form-column">
                    <div className="form-group">
                        <label>No. Licencia</label>
                        <input
                            type="text"
                            className="form-control"
                            value={noLicencia}
                            onChange={(e) => setNoLicencia(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Teléfono</label>
                        <input
                            type="text"
                            className="form-control"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Fecha de Contratación</label>
                        <input
                            type="date"
                            className="form-control"
                            value={fechaContratacion}
                            onChange={(e) => setFechaContratacion(e.target.value)}
                        />
                    </div>
                </div>

                {/* Subida de imágenes */}
                <div className="form-column">
                    <div className="form-group">
                        <label>Imagen Frontal de Licencia</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setFrontImagen(e.target.files[0])}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Imagen Trasera de Licencia</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setTrasImagen(e.target.files[0])}
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

export default CreateConductor;
