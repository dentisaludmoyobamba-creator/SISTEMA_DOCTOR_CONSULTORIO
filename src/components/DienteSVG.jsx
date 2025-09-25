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
    // Determinar si es superior o inferior basado en el número
    const esSuperior = numero >= 11 && numero <= 28;
    
    switch (tipo) {
      case 'incisor':
        if (esSuperior) {
          return {
            // Incisivo superior - corona más ancha hacia el corte
            corona: "M8 2 L16 2 L15 12 L9 12 Z",
            raiz: "M9 12 L15 12 L13 20 L11 20 Z",
            divisionV: "M12 2 L12 12", // División vertical central
            divisionH: "M8 7 L16 7", // División horizontal
          };
        } else {
          return {
            // Incisivo inferior - corona más estrecha
            corona: "M9 2 L15 2 L14 12 L10 12 Z",
            raiz: "M10 12 L14 12 L13 18 L11 18 Z",
            divisionV: "M12 2 L12 12",
            divisionH: "M9 7 L15 7",
          };
        }
      case 'canino':
        if (esSuperior) {
          return {
            // Canino superior - punta más prominente
            corona: "M7 2 L17 2 L15 12 L9 12 Z",
            raiz: "M9 12 L15 12 L13 22 L11 22 Z",
            divisionV: "M12 2 L12 12",
            divisionH: "M7 7 L17 7",
          };
        } else {
          return {
            // Canino inferior
            corona: "M8 2 L16 2 L14 12 L10 12 Z",
            raiz: "M10 12 L14 12 L13 18 L11 18 Z",
            divisionV: "M12 2 L12 12",
            divisionH: "M8 7 L16 7",
          };
        }
      case 'premolar':
        return {
          // Premolar - forma rectangular con dos cúspides
          corona: "M6 2 L18 2 L18 12 L6 12 Z",
          raiz: esSuperior ? "M6 12 L18 12 L16 20 L8 20 Z" : "M6 12 L18 12 L16 18 L8 18 Z",
          divisionV: "M12 2 L12 12", // División vertical central
          divisionH: "M6 7 L18 7", // División horizontal
        };
      case 'molar':
      default:
        return {
          // Molar - forma cuadrada con múltiples divisiones
          corona: "M4 2 L20 2 L20 12 L4 12 Z",
          raiz: esSuperior ? "M4 12 L20 12 L18 20 L6 20 Z" : "M4 12 L20 12 L18 18 L6 18 Z",
          divisionV1: "M8 2 L8 12", // División vertical izquierda
          divisionV2: "M12 2 L12 12", // División vertical central
          divisionV3: "M16 2 L16 12", // División vertical derecha
          divisionH: "M4 7 L20 7", // División horizontal
        };
    }
  };

  const forma = getDienteForma();

  return (
    <div className="flex flex-col items-center">
      <div className="text-xs font-medium text-gray-700 mb-1">{numero}</div>
      <svg width="48" height="80" viewBox="0 0 24 24" className="cursor-pointer border border-gray-300">
        {/* Corona del diente */}
        <path
          d={forma.corona}
          fill={colores[estadoCaras.vestibular]}
          stroke="#000000"
          strokeWidth="0.5"
          onClick={() => handleCaraClick('vestibular')}
          className="hover:opacity-80"
        />
        
        {/* Raíz del diente */}
        <path
          d={forma.raiz}
          fill="#f9f9f9"
          stroke="#000000"
          strokeWidth="0.5"
        />

        {/* Divisiones anatómicas */}
        {forma.divisionV && (
          <path
            d={forma.divisionV}
            stroke="#333333"
            strokeWidth="0.3"
            fill="none"
          />
        )}
        {forma.divisionH && (
          <path
            d={forma.divisionH}
            stroke="#333333"
            strokeWidth="0.3"
            fill="none"
          />
        )}
        {forma.divisionV1 && (
          <path
            d={forma.divisionV1}
            stroke="#333333"
            strokeWidth="0.3"
            fill="none"
          />
        )}
        {forma.divisionV2 && (
          <path
            d={forma.divisionV2}
            stroke="#333333"
            strokeWidth="0.3"
            fill="none"
          />
        )}
        {forma.divisionV3 && (
          <path
            d={forma.divisionV3}
            stroke="#333333"
            strokeWidth="0.3"
            fill="none"
          />
        )}

        {/* Áreas clickeables para cada superficie */}
        {/* Superficie oclusal/incisal */}
        <rect
          x={tipo === 'molar' ? "4" : tipo === 'premolar' ? "6" : "8"}
          y="2"
          width={tipo === 'molar' ? "16" : tipo === 'premolar' ? "12" : "8"}
          height="5"
          fill={estadoCaras.oclusal !== 'sano' ? colores[estadoCaras.oclusal] : 'transparent'}
          stroke="transparent"
          onClick={() => handleCaraClick('oclusal')}
          className="hover:fill-gray-200 hover:opacity-50"
          opacity={estadoCaras.oclusal !== 'sano' ? "0.8" : "0"}
        />

        {/* Cara mesial */}
        <rect
          x={tipo === 'molar' ? "4" : tipo === 'premolar' ? "6" : "8"}
          y="2"
          width="2"
          height="10"
          fill={estadoCaras.mesial !== 'sano' ? colores[estadoCaras.mesial] : 'transparent'}
          onClick={() => handleCaraClick('mesial')}
          className="hover:fill-blue-200 hover:opacity-50"
          opacity={estadoCaras.mesial !== 'sano' ? "0.8" : "0"}
        />

        {/* Cara distal */}
        <rect
          x={tipo === 'molar' ? "18" : tipo === 'premolar' ? "16" : "14"}
          y="2"
          width="2"
          height="10"
          fill={estadoCaras.distal !== 'sano' ? colores[estadoCaras.distal] : 'transparent'}
          onClick={() => handleCaraClick('distal')}
          className="hover:fill-blue-200 hover:opacity-50"
          opacity={estadoCaras.distal !== 'sano' ? "0.8" : "0"}
        />

        {/* Cara lingual */}
        <rect
          x={tipo === 'molar' ? "4" : tipo === 'premolar' ? "6" : "8"}
          y="7"
          width={tipo === 'molar' ? "16" : tipo === 'premolar' ? "12" : "8"}
          height="5"
          fill={estadoCaras.lingual !== 'sano' ? colores[estadoCaras.lingual] : 'transparent'}
          onClick={() => handleCaraClick('lingual')}
          className="hover:fill-green-200 hover:opacity-50"
          opacity={estadoCaras.lingual !== 'sano' ? "0.8" : "0"}
        />
      </svg>
    </div>
  );
};

export default DienteSVG;