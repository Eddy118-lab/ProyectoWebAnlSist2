import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Styles/StyleCreateUsuario.css'

const URI = 'http://localhost:8000/api/usuario/';

const CompCreateUsuario = () => {
    const [nombcomp, setNombreComp] = useState('');
    const [nombusuar, setNombusuar] = useState('');
    const [email, setEmail] = useState('');
    const [contrasenha, setContrasenha] = useState('');
    const [confContrasenha, setConfContrasenha] = useState('');
    const [fechanaci, setFechaNaci] = useState('');
    const [nit, setNit] = useState('');
    const [dpi, setDpi] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (contrasenha !== confContrasenha) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const newUser = {
            nombcomp,
            nombusuar,
            email,
            contrasenha,
            fechanaci,
            nit,
            dpi,
            direccion,
            telefono,
        };

        try {
            await axios.post(URI, newUser);
            setSuccessMessage("Usuario creado con éxito!");
            setTimeout(() => {
                navigate('/usuario/gestion-usuarios');
            }, 2000);
        } catch (error) {
            console.error("Error al enviar datos:", error);
        }
    };

    const handleCancel = () => {
        navigate('/usuario/gestion-usuarios');
    };

    return (
        <div className='create-usuario-form-container'>
            <h2 className='create-usuario-form-title'>Crear Usuario</h2>

            {successMessage && <div className="create-usuario-alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="create-usuario-form-grid">
                <div className='create-usuario-form-group'>
                    <label>Nombre Completo</label>
                    <input
                        type='text'
                        value={nombcomp}
                        onChange={(e) => setNombreComp(e.target.value)}
                        required
                    />
                </div>

                <div className='create-usuario-form-group'>
                    <label>Nickname</label>
                    <input
                        type='text'
                        value={nombusuar}
                        onChange={(e) => setNombusuar(e.target.value)}
                        required
                    />
                </div>

                <div className='create-usuario-form-group'>
                    <label>Email</label>
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className='create-usuario-form-group'>
                    <label>Contraseña</label>
                    <input
                        type='password'
                        value={contrasenha}
                        onChange={(e) => setContrasenha(e.target.value)}
                        required
                    />
                </div>

                <div className='create-usuario-form-group'>
                    <label>Confirmar Contraseña</label>
                    <input
                        type='password'
                        value={confContrasenha}
                        onChange={(e) => setConfContrasenha(e.target.value)}
                        required
                    />
                </div>

                <div className='create-usuario-form-group'>
                    <label>Fecha de Nacimiento</label>
                    <input
                        type='date'
                        value={fechanaci}
                        onChange={(e) => setFechaNaci(e.target.value)}
                        required
                    />
                </div>

                <div className='create-usuario-form-group'>
                    <label>NIT</label>
                    <input
                        type='text'
                        value={nit}
                        onChange={(e) => setNit(e.target.value)}
                        required
                    />
                </div>

                <div className='create-usuario-form-group'>
                    <label>DPI</label>
                    <input
                        type='text'
                        value={dpi}
                        onChange={(e) => setDpi(e.target.value)}
                        required
                    />
                </div>

                <div className='create-usuario-form-group'>
                    <label>Dirección</label>
                    <input
                        type='text'
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        required
                    />
                </div>

                <div className='create-usuario-form-group'>
                    <label>Teléfono</label>
                    <input
                        type='text'
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                    />
                </div>

                <div className='create-usuario-form-buttons'>
                    <button type='submit' className='create-usuario-btn create-usuario-btn-primary'>Guardar</button>
                    <button type='button' className='create-usuario-btn create-usuario-btn-secondary' onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default CompCreateUsuario;