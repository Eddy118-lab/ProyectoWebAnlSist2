import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Styles/StyleConductor.css';  // Asegúrate de tener un archivo de estilo si es necesario

const URI_CONDUCTOR = 'http://localhost:8000/api/conductor/';
const URI_IMG = 'http://localhost:8000/uploadsConductor/'; // Constante para la URL de las imágenes

const EditConductor = () => {
    const { id } = useParams();  // Obtener el ID del conductor de los parámetros de la URL
    const [primerNom, setPrimerNom] = useState('');
    const [segundoNombre, setSegundoNombre] = useState('');
    const [primerApell, setPrimerApell] = useState('');
    const [segundoApell, setSegundoApell] = useState('');
    const [noLicencia, setNoLicencia] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [fechaContratacion, setFechaContratacion] = useState('');
    const [frontImagen, setFrontImagen] = useState(null);
    const [trasImagen, setTrasImagen] = useState(null);
    const [currentFrontImage, setCurrentFrontImage] = useState('');
    const [currentTrasImage, setCurrentTrasImage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConductor = async () => {
            try {
                const res = await axios.get(`${URI_CONDUCTOR}${id}`);
                const conductor = res.data;
                setPrimerNom(conductor.primer_nom);
                setSegundoNombre(conductor.segundo_nombre);
                setPrimerApell(conductor.primer_apell);
                setSegundoApell(conductor.segundo_apell);
                setNoLicencia(conductor.no_licencia);
                setTelefono(conductor.telefono);
                setEmail(conductor.email);
                setFechaContratacion(conductor.fecha_contratacion);
                setCurrentFrontImage(conductor.front_imagen_url); // URL de la imagen actual frontal
                setCurrentTrasImage(conductor.tras_imagen_url);   // URL de la imagen actual trasera
            } catch (error) {
                console.error("Error al obtener el conductor:", error);
                setErrorMessage("Error al obtener el conductor.");
            }
        };

        fetchConductor();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que si se actualiza una imagen, ambas se deben actualizar
        if ((frontImagen && !trasImagen) || (!frontImagen && trasImagen)) {
            setErrorMessage("Debes actualizar ambas imágenes juntas.");
            return;
        }

        // Creamos un objeto FormData para manejar archivos
        const formData = new FormData();
        formData.append('primer_nom', primerNom);
        formData.append('segundo_nombre', segundoNombre);
        formData.append('primer_apell', primerApell);
        formData.append('segundo_apell', segundoApell);
        formData.append('no_licencia', noLicencia);
        formData.append('telefono', telefono);
        formData.append('email', email);
        formData.append('fecha_contratacion', fechaContratacion);

        // Si las imágenes se actualizaron, agregarlas al FormData
        if (frontImagen && trasImagen) {
            formData.append('front_imagen_url', frontImagen);
            formData.append('tras_imagen_url', trasImagen);
        }

        try {
            const response = await axios.put(`${URI_CONDUCTOR}${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                setSuccessMessage("Conductor actualizado con éxito!");
                setErrorMessage('');
                setTimeout(() => {
                    navigate('/conductor/gestion-conductores');
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar el conductor.");
            }
        } catch (error) {
            console.error("Error al enviar datos:", error);
            setErrorMessage("Error al actualizar el conductor.");
        }
    };

    const handleCancel = () => {
        navigate('/conductor/gestion-conductores');
    };

    return (
        <div className='form-container'>
            <h2 className='form-title'>Editar Conductor</h2>
            
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className='form-grid'>
                <div className='form-column'>
                    <div className='form-group'>
                        <label>Primer Nombre</label>
                        <input
                            type='text'
                            className='form-control'
                            value={primerNom}
                            onChange={(e) => setPrimerNom(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label>Segundo Nombre</label>
                        <input
                            type='text'
                            className='form-control'
                            value={segundoNombre}
                            onChange={(e) => setSegundoNombre(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Primer Apellido</label>
                        <input
                            type='text'
                            className='form-control'
                            value={primerApell}
                            onChange={(e) => setPrimerApell(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label>Segundo Apellido</label>
                        <input
                            type='text'
                            className='form-control'
                            value={segundoApell}
                            onChange={(e) => setSegundoApell(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Número de Licencia</label>
                        <input
                            type='text'
                            className='form-control'
                            value={noLicencia}
                            onChange={(e) => setNoLicencia(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label>Teléfono</label>
                        <input
                            type='text'
                            className='form-control'
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='form-column'>
                    <div className='form-group'>
                        <label>Email</label>
                        <input
                            type='email'
                            className='form-control'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label>Fecha de Contratación</label>
                        <input
                            type='date'
                            className='form-control'
                            value={fechaContratacion}
                            onChange={(e) => setFechaContratacion(e.target.value)}
                            required
                        />
                    </div>

                    {/* Mostrar la imagen frontal actual como miniatura */}
                    {currentFrontImage && (
                        <div className='form-group'>
                            <label>Imagen Frontal Actual</label>
                            <img 
                                src={`${URI_IMG}${currentFrontImage}`} 
                                alt="Imagen Frontal Actual" 
                                className="thumbnail" 
                            />
                        </div>
                    )}

                    <div className='form-group'>
                        <label>Imagen Frontal (Nueva)</label>
                        <input
                            type='file'
                            className='form-control'
                            onChange={(e) => setFrontImagen(e.target.files[0])}
                            accept="image/*"
                        />
                    </div>

                    {/* Mostrar la imagen trasera actual como miniatura */}
                    {currentTrasImage && (
                        <div className='form-group'>
                            <label>Imagen Trasera Actual</label>
                            <img 
                                src={`${URI_IMG}${currentTrasImage}`} 
                                alt="Imagen Trasera Actual" 
                                className="thumbnail" 
                            />
                        </div>
                    )}

                    <div className='form-group'>
                        <label>Imagen Trasera (Nueva)</label>
                        <input
                            type='file'
                            className='form-control'
                            onChange={(e) => setTrasImagen(e.target.files[0])}
                            accept="image/*"
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

export default EditConductor;
