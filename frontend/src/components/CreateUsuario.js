import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/StyleUsuario.css';  // Importa el archivo CSS

const URI = 'http://localhost:8000/api/usuario/';

const CompCreateUsuario = () => {
    const [nombcomp, setNombreComp] = useState('');
    const [nombusuar, setNombusuar] = useState(''); // Agregado
    const [email, setEmail] = useState('');
    const [contrasenha, setContrasenha] = useState('');
    const [confContrasenha, setConfContrasenha] = useState('');
    const [fechanaci, setFechaNaci] = useState('');
    const [nit, setNit] = useState('');
    const [dpi, setDpi] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (contrasenha !== confContrasenha) {
            alert("Las contraseñas no coinciden");
            return;
        }

        const newUser = {
            nombcomp,
            nombusuar, // Agregado
            email,
            contrasenha,
            fechanaci,
            nit,
            dpi,
            direccion,
            telefono
        };

        try {
            await axios.post(URI, newUser);
            setSuccessMessage("Usuario creado con éxito!"); // Mostrar mensaje de éxito
            setTimeout(() => {
                navigate('/usuario/gestion-usuarios'); // Redirigir al módulo Gestión de Usuarios después de 2 segundos
            }, 2000);
        } catch (error) {
            console.error("Error al enviar datos:", error);
        }
    };

    const handleCancel = () => {
        navigate('/usuario/gestion-usuarios'); // Redirigir al módulo Gestión de Usuarios al cancelar
    };

    return (
        <div className='form-container'>
            <h2 className='form-title'>Crear Usuario</h2>

            {/* Mostrar mensaje de éxito si el usuario fue creado */}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="form-grid">
                <div className='form-column'>
                    <div className='form-group'>
                        <label>Nombre Completo</label>
                        <input
                            type='text'
                            className='form-control'
                            value={nombcomp}
                            onChange={(e) => setNombreComp(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label>Nickname</label>
                        <input
                            type='text'
                            className='form-control'
                            value={nombusuar} // Agregado
                            onChange={(e) => setNombusuar(e.target.value)} // Agregado
                            required
                        />
                    </div>

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
                        <label>Contraseña</label>
                        <input
                            type='password'
                            className='form-control'
                            value={contrasenha}
                            onChange={(e) => setContrasenha(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label>Confirmar Contraseña</label>
                        <input
                            type='password'
                            className='form-control'
                            value={confContrasenha}
                            onChange={(e) => setConfContrasenha(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='form-column'>
                    <div className='form-group'>
                        <label>Fecha de Nacimiento</label>
                        <input
                            type='date'
                            className='form-control date-picker'
                            value={fechanaci}
                            onChange={(e) => setFechaNaci(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label>NIT</label>
                        <input
                            type='text'
                            className='form-control'
                            value={nit}
                            onChange={(e) => setNit(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label>DPI</label>
                        <input
                            type='text'
                            className='form-control'
                            value={dpi}
                            onChange={(e) => setDpi(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label>Dirección</label>
                        <input
                            type='text'
                            className='form-control'
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
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

                <div className='form-buttons'>
                    <button type='submit' className='btn btn-primary'>Guardar</button>
                    <button type='button' className='btn btn-secondary' onClick={handleCancel}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default CompCreateUsuario;
