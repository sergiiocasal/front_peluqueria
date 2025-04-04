const InputField = ({ label, type, value, onChange, required, pattern, maxLength, disabled }) => {
  return (
      <div className="input-group">
          <label>{label}</label>
          <input
              type={type}
              value={value}
              onChange={onChange}
              required={required}
              pattern={pattern}
              maxLength={maxLength}
              className="input-field"
              disabled={disabled} // Agrega la propiedad disabled aquí
          />
      </div>
  );
};

export default InputField;