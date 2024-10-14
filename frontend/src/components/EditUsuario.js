import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Styles/StyleEditUsuario.css';

const URI = 'http://localhost:8000/api/usuario/';

const EditUsuario = () => {
    const [nombcomp, setNombreComp] = useState('');
    const [nombusuar, setNombreUsuar] = useState('');
    const [email, setEmail] = useState('');
    const [contrasenha, setContrasenha] = useState('');
    const [confContrasenha, setConfContrasenha] = useState('');
    const [fechanaci, setFechaNaci] = useState('');
    const [nit, setNit] = useState('');
    const [dpi, setDpi] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${URI}${id}`);
                const user = response.data;

                setNombreComp(user.nombcomp);
                setNombreUsuar(user.nombusuar);
                setEmail(user.email);
                setFechaNaci(user.fechanaci);
                setNit(user.nit);
                setDpi(user.dpi);
                setDireccion(user.direccion);
                setTelefono(user.telefono);
                setContrasenha(''); 
                setConfContrasenha(''); 
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                alert("Error al cargar los datos del usuario, por favor intenta nuevamente.");
            }
        };

        fetchUserData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (contrasenha && contrasenha !== confContrasenha) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const updatedUser = {
            nombcomp,
            nombusuar,
            email,
            fechanaci,
            nit,
            dpi,
            direccion,
            telefono,
            ...(contrasenha && { contrasenha })
        };

        try {
            const response = await axios.put(`${URI}${id}`, updatedUser);
            setSuccessMessage("Usuario actualizado con éxito!");
            setErrorMessage('');
            setTimeout(() => {
                navigate('/usuario/gestion-usuarios');
            }, 2000);
        } catch (error) {
            console.error("Error al actualizar los datos del usuario:", error.response ? error.response.data : error);
            setErrorMessage("Error al actualizar el usuario, por favor intenta nuevamente.");
        }
    };

    const handleCancel = () => {
        navigate('/usuario/gestion-usuarios');
    };

    return (
        <div className='edit-usuario-form-container'>
            <h2 className='edit-usuario-form-title'>Editar Usuario</h2>

            <form onSubmit={handleSubmit} className="edit-usuario-form-grid">
                <div className='edit-usuario-form-group'>
                    <label>Nombre Completo</label>
                    <input
                        type='text'
                        value={nombcomp}
                        onChange={(e) => setNombreComp(e.target.value)}
                        required
                    />
                </div>

                <div className='edit-usuario-form-group'>
                    <label>Nombre de Usuario</label>
                    <input
                        type='text'
                        value={nombusuar}
                        onChange={(e) => setNombreUsuar(e.target.value)}
                        required
                    />
                </div>

                <div className='edit-usuario-form-group'>
                    <label>Email</label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className='edit-usuario-form-group'>
                    <label>Fecha de Nacimiento</label>
                    <input
                        type='date'
                        value={fechanaci}
                        onChange={(e) => setFechaNaci(e.target.value)}
                        required
                    />
                </div>

                <div className='edit-usuario-form-group'>
                    <label>NIT</label>
                    <input
                        type='text'
                        value={nit}
                        onChange={(e) => setNit(e.target.value)}
                        required
                    />
                </div>

                <div className='edit-usuario-form-group'>
                    <label>DPI</label>
                    <input
                        type='text'
                        value={dpi}
                        onChange={(e) => setDpi(e.target.value)}
                        required
                    />
                </div>

                <div className='edit-usuario-form-group'>
                    <label>Dirección</label>
                    <input
                        type='text'
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        required
                    />
                </div>

                <div className='edit-usuario-form-group'>
                    <label>Teléfono</label>
                    <input
                        type='text'
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                </div>

                <div className='edit-usuario-form-group'>
                    <label>Contraseña (Dejar en blanco si no deseas cambiarla)</label>
                    <input
                        type='password'
                        value={contrasenha}
                        onChange={(e) => setContrasenha(e.target.value)}
                    />
                </div>

                <div className='edit-usuario-form-group'>
                    <label>Confirmar Contraseña</label>
                    <input
                        type='password'
                        value={confContrasenha}
                        onChange={(e) => setConfContrasenha(e.target.value)}
                    />
                </div>

                <div className="edit-usuario-form-buttons">
                    <button type='submit' className='edit-usuario-btn edit-usuario-btn-primary'>Actualizar</button>
                    <button type='button' onClick={handleCancel} className='edit-usuario-btn edit-usuario-btn-secondary'>Cancelar</button>
                </div>
            </form>

            {successMessage && <div className="edit-usuario-alert-success">{successMessage}</div>}
            {errorMessage && <div className="edit-usuario-alert-danger">{errorMessage}</div>}
        </div>
    );
};

export default EditUsuario;