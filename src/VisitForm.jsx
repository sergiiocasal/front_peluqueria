import { useState } from "react";
import InputField from "./InputField";

const VisitForm = () => {
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [mensajeTipo, setMensajeTipo] = useState(""); // "error" | "success"
  const [requiereNombre, setRequiereNombre] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setMensajeTipo("");

    // Verificar si el teléfono ya está registrado
    const response = await fetch(`http://localhost:5000/comprobar-visitas?telefono=${telefono}`);
    const data = await response.json();

    if (!data.telefonoRegistrado) {
      if (!nombre) {
        setMensaje("Este teléfono no está registrado. Por favor, ingrese su nombre.");
        setMensajeTipo("error");
        setRequiereNombre(true);
        return;
      }

      // **Registrar nueva visita con nombre y teléfono**
      const registerResponse = await fetch("http://localhost:5000/registrar-visita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono, nombre }) // Registramos nombre + teléfono
      });

      const registerData = await registerResponse.json();
      setMensaje(registerData.mensaje);
      setMensajeTipo(registerResponse.ok ? "success" : "error");
      setRequiereNombre(false);
      setTelefono("");
      setNombre("");
      return;
    }

    if (nombre) {
      setMensaje("El nombre no debe ser ingresado después de la primera visita.");
      setMensajeTipo("error");
      return;
    }

    // **Registrar solo la visita si el teléfono ya existe**
    const visitaResponse = await fetch("http://localhost:5000/registrar-visita", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telefono }) // Solo el teléfono
    });

    const visitaData = await visitaResponse.json();
    setMensaje(visitaData.mensaje);
    setMensajeTipo(visitaResponse.ok ? "success" : "error");
    setTelefono("");
  };

  return (
    <form onSubmit={handleSubmit}>

      <InputField
        label="Teléfono (9 dígitos):"
        type="tel"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        required
        pattern="\d{9}"
        maxLength="9"
      />

      {requiereNombre && (
        <InputField
          label="Nombre y Apellidos:"
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      )}

      <button type="submit" className="submit-button">Registrar Visita</button>

      {mensaje && <p className={`message ${mensajeTipo}`}>{mensaje}</p>}
    </form>
  );
};

export default VisitForm;
