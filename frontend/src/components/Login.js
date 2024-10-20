import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de haber instalado esta librería
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = ({ onLoginSuccess, onClose }) => {
    const [email, setEmail] = useState('');
    const [contrasenha, setContrasenha] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [isVisible, setIsVisible] = useState(false);

    const handleClick = () => {
        setIsVisible(!isVisible);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Muestra la pantalla de carga

        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, contrasenha });
            const { token } = response.data;

            // Decodificar el token para obtener el nombre del usuario
            const decodedToken = jwtDecode(token);
            const userName = decodedToken.nombreComp; // Extraer el nombre del usuario del token

            localStorage.setItem('token', token);
            localStorage.setItem('userName', userName); // Guardar el nombre del usuario en localStorage

            console.log('Token guardado y redirigiendo');

            setTimeout(() => {
                setLoading(false);
                navigate('/Home');
                onLoginSuccess();
            }, 1000);

        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Error de autenticación');
            } else {
                setError('Error de conexión con el servidor');
            }
            setLoading(false); // Oculta la pantalla de carga en caso de error
        }
    };

    // Función para navegar al inicio
    const handleGoHome = () => {
        navigate('/inicio');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            {loading && <div className="loading-message">Cargando...</div>}
            {!loading && (
                <form className="login-form shadow p-4 rounded bg-light-blue" onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>
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
                        <label className="form-label">Contraseña</label>
                        <div className="input-group">
                            <input
                                type={isVisible ? "text" : "password"}
                                className="form-control"
                                value={contrasenha}
                                onChange={(e) => setContrasenha(e.target.value)}
                                required
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={handleClick}
                            >
                                {isVisible ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>
                    {error && <div className="text-danger mb-3">{error}</div>}
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
                        <button type="button" className="btn btn-secondary" onClick={handleGoHome}>Regresar al Inicio</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Login;
