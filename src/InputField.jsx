const InputField = ({ label, type, value, onChange, required, pattern, maxLength }) => {
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
        />
      </div>
    );
  };
  
  export default InputField;
  