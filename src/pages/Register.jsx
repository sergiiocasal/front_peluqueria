import { useState } from "react";

const Register = () => {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }
    
        try {
            const response = await fetch("http://localhost:5000/registrar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, password }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();  // Captura el error del backend
                throw new Error(errorData.mensaje || "Error al registrar el usuario");
            }
    
            const data = await response.json();
            setSuccessMessage(data.mensaje);
            setError("");
        } catch (error) {
            setError(error.message);
            setSuccessMessage("");
        }
    };
    

    return (
        <div>
            <h2>Registro de Usuario</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            
            <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Nombre de usuario"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar contraseña"
            />
            <button onClick={handleRegister}>Registrar</button>
        </div>
    );
};

export default Register;
