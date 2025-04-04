import { useState } from "react";
import InputField from "./InputField";

const VisitForm = () => {
    const [telefono, setTelefono] = useState("");
    const [nombre, setNombre] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [mensajeTipo, setMensajeTipo] = useState("");
    const [requiereNombre, setRequiereNombre] = useState(false);
    const [premioPendiente, setPremioPendiente] = useState(false);
    const [premio, setPremio] = useState("");
    const [formularioVisible, setFormularioVisible] = useState(true);
    const [cargando, setCargando] = useState(false);
    const [telefonoDeshabilitado, setTelefonoDeshabilitado] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");
        setMensajeTipo("");
        setCargando(true);

        try {
            const response = await fetch(`http://localhost:5000/comprobar-visitas/${telefono}`);
            const data = await response.json();

            if (!data.telefonoRegistrado) {
                if (!nombre) {
                    setMensaje("Este teléfono no está registrado. Por favor, ingrese su nombre.");
                    setMensajeTipo("error");
                    setRequiereNombre(true);
                    setCargando(false);
                    return;
                }

                await fetch("http://localhost:5000/registrar-visita", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ telefono, nombre })
                });

                setMensaje("Primera visita registrada.");
                setMensajeTipo("success");
                setRequiereNombre(false);
            } else {
                const visitaResponse = await fetch("http://localhost:5000/registrar-visita", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ telefono })
                });

                const visitaData = await visitaResponse.json();
                setMensaje(visitaData.mensaje);
                setMensajeTipo(visitaResponse.ok ? "success" : "error");

                if (visitaData.premioPendiente) {
                    setPremioPendiente(true);
                    setTelefonoDeshabilitado(true);
                } else {
                    setTelefono("");
                }
            }
        } catch (error) {
            setMensaje("Error al procesar la solicitud.");
            setMensajeTipo("error");
        } finally {
            setCargando(false);
        }
    };

    const handlePremioSubmit = async () => {
        setCargando(true);
        try {
            const response = await fetch("http://localhost:5000/registrar-premio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ telefono, premio })
            });

            const data = await response.json();
            setMensaje(data.mensaje);
            setMensajeTipo(response.ok ? "success" : "error");
            setPremioPendiente(false);
            setFormularioVisible(false);
        } catch (error) {
            setMensaje("Error al registrar el premio.");
            setMensajeTipo("error");
        } finally {
            setCargando(false);
        }
    };

    return (
        <>
            {!formularioVisible && <p className="message success">{mensaje}</p>}

            {formularioVisible && (
                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Teléfono (9 dígitos):"
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        required
                        pattern="\d{9}"
                        maxLength="9"
                        disabled={telefonoDeshabilitado}
                    />

                    {requiereNombre && <InputField label="Nombre y Apellidos:" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />}

                    <button type="submit" className="submit-button" disabled={cargando || premioPendiente}>
                        {cargando ? "Cargando..." : "Registrar Visita"}
                    </button>

                    {mensaje && <p className={`message ${mensajeTipo}`}>{mensaje}</p>}

                    {premioPendiente && (
                        <div>
                            <select onChange={(e) => setPremio(e.target.value)}>
                                <option value="">Selecciona tu premio</option>
                                <option value="Corte y lavado">Corte y lavado</option>
                                <option value="Manicura">Manicura</option>
                            </select>
                            <button type="button" onClick={handlePremioSubmit} className="submit-button" disabled={cargando}>
                                {cargando ? "Cargando..." : "Confirmar Premio"}
                            </button>
                        </div>
                    )}
                </form>
            )}
        </>
    );
};

export default VisitForm;
