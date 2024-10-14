import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Styles/StyleEditConductor.css';

const URI_CONDUCTOR = 'http://localhost:8000/api/conductor/';
const URI_IMG = 'http://localhost:8000/uploadsConductor/';

const EditConductor = () => {
    const { id } = useParams();
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
                setCurrentFrontImage(conductor.front_imagen_url);
                setCurrentTrasImage(conductor.tras_imagen_url);
            } catch (error) {
                console.error("Error al obtener el conductor:", error);
                setErrorMessage("Error al obtener el conductor.");
            }
        };

        fetchConductor();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ((frontImagen && !trasImagen) || (!frontImagen && trasImagen)) {
            setErrorMessage("Debes actualizar ambas imágenes juntas.");
            return;
        }

        const formData = new FormData();
        formData.append('primer_nom', primerNom);
        formData.append('segundo_nombre', segundoNombre);
        formData.append('primer_apell', primerApell);
        formData.append('segundo_apell', segundoApell);
        formData.append('no_licencia', noLicencia);
        formData.append('telefono', telefono);
        formData.append('email', email);
        formData.append('fecha_contratacion', fechaContratacion);

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
        <div className='form-container-Edit-Conductor'>
            <h2 className='form-title-Edit-Conductor'>Editar Conductor</h2>
            
            {successMessage && <div className="alert alert-success-Edit-Conductor">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger-Edit-Conductor">{errorMessage}</div>}
            
            <form onSubmit={handleSubmit} className='form-grid-Edit-Conductor'>
                <div className='form-column-Edit-Conductor'>
                    <div className='form-group-Edit-Conductor'>
                        <label>Primer Nombre</label>
                        <input
                            type='text'
                            className='form-control-Edit-Conductor'
                            value={primerNom}
                            onChange={(e) => setPrimerNom(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group-Edit-Conductor'>
                        <label>Segundo Nombre</label>
                        <input
                            type='text'
                            className='form-control-Edit-Conductor'
                            value={segundoNombre}
                            onChange={(e) => setSegundoNombre(e.target.value)}
                        />
                    </div>
                    <div className='form-group-Edit-Conductor'>
                        <label>Primer Apellido</label>
                        <input
                            type='text'
                            className='form-control-Edit-Conductor'
                            value={primerApell}
                            onChange={(e) => setPrimerApell(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group-Edit-Conductor'>
                        <label>Segundo Apellido</label>
                        <input
                            type='text'
                            className='form-control-Edit-Conductor'
                            value={segundoApell}
                            onChange={(e) => setSegundoApell(e.target.value)}
                        />
                    </div>
                    <div className='form-group-Edit-Conductor'>
                        <label>Número de Licencia</label>
                        <input
                            type='text'
                            className='form-control-Edit-Conductor'
                            value={noLicencia}
                            onChange={(e) => setNoLicencia(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group-Edit-Conductor'>
                        <label>Teléfono</label>
                        <input
                            type='text'
                            className='form-control-Edit-Conductor'
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='form-column-Edit-Conductor'>
                    <div className='form-group-Edit-Conductor'>
                        <label>Email</label>
                        <input
                            type='email'
                            className='form-control-Edit-Conductor'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='form-group-Edit-Conductor'>
                        <label>Fecha de Contratación</label>
                        <input
                            type='date'
                            className='form-control-Edit-Conductor'
                            value={fechaContratacion}
                            onChange={(e) => setFechaContratacion(e.target.value)}
                            required
                        />
                    </div>

                    {currentFrontImage && (
                        <div className='form-group-Edit-Conductor'>
                            <label>Imagen Frontal Actual</label>
                            <img 
                                src={`${URI_IMG}${currentFrontImage}`} 
                                alt="Imagen Frontal Actual" 
                                className="thumbnail-Edit-Conductor" 
                            />
                        </div>
                    )}

                    <div className='form-group-Edit-Conductor'>
                        <label>Imagen Frontal (Nueva)</label>
                        <input
                            type='file'
                            className='form-control-Edit-Conductor'
                            onChange={(e) => setFrontImagen(e.target.files[0])}
                            accept="image/*"
                        />
                    </div>

                    {currentTrasImage && (
                        <div className='form-group-Edit-Conductor'>
                            <label>Imagen Trasera Actual</label>
                            <img 
                                src={`${URI_IMG}${currentTrasImage}`} 
                                alt="Imagen Trasera Actual" 
                                className="thumbnail-Edit-Conductor" 
                            />
                        </div>
                    )}

                    <div className='form-group-Edit-Conductor'>
                        <label>Imagen Trasera (Nueva)</label>
                        <input
                            type='file'
                            className='form-control-Edit-Conductor'
                            onChange={(e) => setTrasImagen(e.target.files[0])}
                            accept="image/*"
                        />
                    </div>
                </div>

                <div className='form-buttons-Edit-Conductor'>
                    <button type='submit' className='btn btn-primary-Edit-Conductor'>Actualizar</button>
                    <button type='button' className='btn btn-secondary-Edit-Conductor' onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default EditConductor;