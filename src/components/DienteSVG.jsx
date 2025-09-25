import React, { useState } from 'react';

const DienteSVG = ({ numero, tipo = 'molar' }) => {
  const [estadoCaras, setEstadoCaras] = useState({
    oclusal: 'sano',    // blanco
    vestibular: 'sano', // blanco
    lingual: 'sano',    // blanco
    mesial: 'sano',     // blanco
    distal: 'sano'      // blanco
  });

  const colores = {
    sano: '#ffffff',
    caries: '#ef4444',    // rojo
    tratado: '#3b82f6',   // azul
    obturado: '#10b981',  // verde
    extraido: '#6b7280'   // gris
  };

  const handleCaraClick = (cara) => {
    const estados = ['sano', 'caries', 'tratado', 'obturado', 'extraido'];
    const estadoActual = estadoCaras[cara];
    const indiceActual = estados.indexOf(estadoActual);
    const siguienteEstado = estados[(indiceActual + 1) % estados.length];
    
    const nuevoEstado = {
      ...estadoCaras,
      [cara]: siguienteEstado
    };
    
    setEstadoCaras(nuevoEstado);
    
    // Console.log para futura integración con base de datos
    console.log(`Diente ${numero} - Cara ${cara}: ${siguienteEstado}`, nuevoEstado);
  };

  const getDienteForma = () => {
    switch (tipo) {
      case 'incisor':
        return {
          // Forma trapezoidal/triangular como incisivo
          oclusal: "M10 2 L14 2 L13 4 L11 4 Z",
          corona: "M10 2 L14 2 L13.5 10 L10.5 10 Z",
          raiz: "M10.5 10 L13.5 10 L12.5 16 L11.5 16 Z",
          lineas: ["M10 2 L14 10", "M14 2 L10 10"] // X interna
        };
      case 'canino':
        return {
          // Forma triangular más pronunciada para canino
          oclusal: "M9 2 L15 2 L14 4 L10 4 Z",
          corona: "M9 2 L15 2 L14 10 L10 10 Z",
          raiz: "M10 10 L14 10 L13 18 L11 18 Z",
          lineas: ["M9 2 L15 10", "M15 2 L9 10"] // X interna
        };
      case 'premolar':
        return {
          // Forma rectangular con división horizontal
          oclusal: "M8 2 L16 2 L16 5 L8 5 Z",
          corona: "M8 2 L16 2 L16 10 L8 10 Z",
          raiz: "M8 10 L16 10 L15 16 L9 16 Z",
          lineas: ["M8 6 L16 6"] // Línea horizontal
        };
      case 'molar':
      default:
        return {
          // Forma cuadrada grande con grid interno
          oclusal: "M6 2 L18 2 L18 6 L6 6 Z",
          corona: "M6 2 L18 2 L18 10 L6 10 Z",
          raiz: "M6 10 L18 10 L17 16 L7 16 Z",
          lineas: [
            "M6 4 L18 4",   // Línea horizontal superior
            "M12 2 L12 6"   // Línea vertical central
          ]
        };
    }
  };

  const forma = getDienteForma();

  return (
    <div className="flex flex-col items-center">
      <svg width="48" height="72" viewBox="0 0 32 48" className="cursor-pointer">
        {/* Corona del diente */}
        <path
          d={forma.corona}
          fill={colores[estadoCaras.vestibular]}
          stroke="#000000"
          strokeWidth="1"
          onClick={() => handleCaraClick('vestibular')}
          className="hover:opacity-80"
        />
        
        {/* Superficie oclusal/incisal */}
        <path
          d={forma.oclusal}
          fill={colores[estadoCaras.oclusal]}
          stroke="#000000"
          strokeWidth="1"
          onClick={() => handleCaraClick('oclusal')}
          className="hover:opacity-80"
        />
        
        {/* Raíz del diente */}
        <path
          d={forma.raiz}
          fill="#f3f4f6"
          stroke="#000000"
          strokeWidth="1"
        />

        {/* Caras laterales invisibles pero clickeables */}
        <rect
          x="4"
          y="2"
          width="2"
          height="8"
          fill="transparent"
          onClick={() => handleCaraClick('mesial')}
          className="hover:fill-gray-200 hover:opacity-50"
        />
        <rect
          x="18"
          y="2"
          width="2"
          height="8"
          fill="transparent"
          onClick={() => handleCaraClick('distal')}
          className="hover:fill-gray-200 hover:opacity-50"
        />
        <rect
          x="6"
          y="10"
          width="12"
          height="2"
          fill="transparent"
          onClick={() => handleCaraClick('lingual')}
          className="hover:fill-gray-200 hover:opacity-50"
        />

        {/* Líneas anatómicas internas */}
        {forma.lineas && forma.lineas.map((linea, index) => (
          <path
            key={index}
            d={linea}
            stroke="#666666"
            strokeWidth="0.5"
            fill="none"
          />
        ))}

        {/* Indicadores de estado en caras mesial y distal */}
        {estadoCaras.mesial !== 'sano' && (
          <rect
            x="4"
            y="2"
            width="2"
            height="8"
            fill={colores[estadoCaras.mesial]}
            opacity="0.7"
          />
        )}
        {estadoCaras.distal !== 'sano' && (
          <rect
            x="18"
            y="2"
            width="2"
            height="8"
            fill={colores[estadoCaras.distal]}
            opacity="0.7"
          />
        )}
        {estadoCaras.lingual !== 'sano' && (
          <rect
            x="6"
            y="10"
            width="12"
            height="2"
            fill={colores[estadoCaras.lingual]}
            opacity="0.7"
          />
        )}
      </svg>
      <span className="text-sm font-bold text-gray-800 mt-2">{numero}</span>
    </div>
  );
};

export default DienteSVG;