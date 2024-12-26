import React, { useState } from "react";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
  const [inputValue, setInputValue] = useState("");
  const [hasSearched, setHasSearched] = useState(false); // Indica si se presionó "Buscar"

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (!e.target.value.trim()) {
      setHasSearched(false); // Reinicia si el texto está vacío
    }
  };

  const handleSearchClick = () => {
    if (inputValue.trim()) {
      onSearch(inputValue);
      setHasSearched(true); // Marca que se presionó "Buscar"
    }
  };

  const handleClearClick = () => {
    setInputValue("");
    onSearch(""); // Restablece la búsqueda
    setHasSearched(false); // Vuelve al estado inicial
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        className="search-input"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Buscar etiquetas..."
      />
      <button
        className={`search-btn ${hasSearched ? "clear-btn" : ""}`}
        onClick={hasSearched ? handleClearClick : handleSearchClick}
      >
        {hasSearched ? "✖" : "Buscar"}
      </button>
    </div>
  );
}

export default SearchBar;
