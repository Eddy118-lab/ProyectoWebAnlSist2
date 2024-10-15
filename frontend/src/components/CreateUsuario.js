import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className='container vh-100 d-flex justify-content-center align-items-center'>
            <div className="card" style={{ width: '400%', maxWidth: '800px', marginTop: '70px'}}>
                <div className="card-header text-center">
                    <h2>Crear Usuario</h2>
                </div>
                <div className="card-body">
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}

                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input
                                    type='text'
                                    className="form-control"
                                    value={nombcomp}
                                    onChange={(e) => setNombreComp(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Nickname</label>
                                <input
                                    type='text'
                                    className="form-control"
                                    value={nombusuar}
                                    onChange={(e) => setNombusuar(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type='email'
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Contraseña</label>
                                <input
                                    type='password'
                                    className="form-control"
                                    value={contrasenha}
                                    onChange={(e) => setContrasenha(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirmar Contraseña</label>
                                <input
                                    type='password'
                                    className="form-control"
                                    value={confContrasenha}
                                    onChange={(e) => setConfContrasenha(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Fecha de Nacimiento</label>
                                <input
                                    type='date'
                                    className="form-control"
                                    value={fechanaci}
                                    onChange={(e) => setFechaNaci(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>NIT</label>
                                <input
                                    type='text'
                                    className="form-control"
                                    value={nit}
                                    onChange={(e) => setNit(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>DPI</label>
                                <input
                                    type='text'
                                    className="form-control"
                                    value={dpi}
                                    onChange={(e) => setDpi(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Dirección</label>
                                <input
                                    type='text'
                                    className="form-control"
                                    value={direccion}
                                    onChange={(e) => setDireccion(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Teléfono</label>
                                <input
                                    type='text'
                                    className="form-control"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-12 d-flex justify-content-center">
                            <button type='submit' className="btn btn-primary me-2">Guardar</button>
                            <button type='button' className="btn btn-secondary" onClick={handleCancel}>Cancelar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompCreateUsuario;
