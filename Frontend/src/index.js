import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { OpenCvProvider } from 'opencv-react'; // Importa OpenCvProvider

// Configuración de OpenCV.js
const openCvConfig = {
  onLoad: () => console.log('OpenCV.js cargado correctamente'),
  onError: () => console.error('Error al cargar OpenCV.js'),
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Envuelve tu aplicación con OpenCvProvider */}
    <OpenCvProvider openCvConfig={openCvConfig}>
      <App />
    </OpenCvProvider>
  </React.StrictMode>
);

// Reporte de métricas opcional
reportWebVitals();
