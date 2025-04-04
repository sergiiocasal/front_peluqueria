import { useState, useEffect } from "react";

const AdminPanel = () => {
    const [clientes, setClientes] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (token) fetchClientes();
    }, [token]);

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",  // Cambié GET por POST
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, password }),  // Enviar los datos como JSON
            });
    
            if (!response.ok) throw new Error("Usuario o contraseña incorrectos");
    
            const data = await response.json();
            setToken(data.token);
            localStorage.setItem("token", data.token);
            setError("");
        } catch (error) {
            setError("Credenciales incorrectas");
        }
    };
    

    const fetchClientes = async () => {
        try {
            const response = await fetch("http://localhost:5000/clientes", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("No autorizado");

            const data = await response.json();

            // ✅ Asegurar que data es un array antes de actualizar el estado
            if (Array.isArray(data)) {
                setClientes(data);
            } else {
                setClientes([]);
            }
        } catch (error) {
            setToken("");
            localStorage.removeItem("token");
            setError("Sesión expirada, inicia sesión nuevamente.");
        }
    };

    const handleLogout = () => {
        setToken("");
        localStorage.removeItem("token");
        setClientes([]); // ✅ Limpiar clientes al cerrar sesión
    };

    if (!token) {
        return (
            <div>
                <h2>Iniciar Sesión</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <input
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Usuario"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                />
                <button onClick={handleLogin}>Entrar</button>
            </div>
        );
    }

    return (
        <div>
            <h2>Panel de Administración</h2>
            <button onClick={handleLogout}>Cerrar Sesión</button>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {clientes.length === 0 ? (
                <p>No hay clientes disponibles</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Teléfono</th>
                            <th>Nombre</th>
                            <th>Visitas</th>
                            <th>Premio</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr key={cliente._id}>
                                <td>{cliente.telefono}</td>
                                <td>{cliente.nombre}</td>
                                <td>{cliente.visitas}</td>
                                <td>{cliente.premio || "Ninguno"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminPanel;
