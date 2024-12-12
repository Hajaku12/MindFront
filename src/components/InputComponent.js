// src/components/InputComponent.js
import React from 'react';

const InputComponent = ({ placeholder, value, setValue }) => {
    const handleInputChange = (e) => {
        const value = e.target.value;
        // Regex to allow only alphanumeric characters
        const regex = /^[a-zA-Z0-9]*$/;
        if (regex.test(value)) {
            setValue(value);
        }
    };

    return (
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={handleInputChange}
        />
    );
};

export default InputComponent;