import React, { useState, useEffect } from 'react';

const DienteSVG = ({ 
  numero, 
  tipo = 'molar', 
  estadoInicial = null,
  onUpdate = null,
  readonly = false,
  showTooltip = true
}) => {
  const [estadoCaras, setEstadoCaras] = useState({
    oclusal: 'sano',
    vestibular: 'sano',
    lingual: 'sano',
    mesial: 'sano',
    distal: 'sano'
  });

  const [estadoGeneral, setEstadoGeneral] = useState('sano');
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltipState, setShowTooltipState] = useState(false);

  // Cargar estado inicial si se proporciona
  useEffect(() => {
    if (estadoInicial) {
      if (estadoInicial.superficies) {
        setEstadoCaras(estadoInicial.superficies);
      }
      if (estadoInicial.estado_general) {
        setEstadoGeneral(estadoInicial.estado_general);
      }
    }
  }, [estadoInicial]);

  // Colores para diferentes estados
  const colores = {
    sano: '#ffffff',
    caries: '#ef4444',         // rojo - caries
    caries_activa: '#dc2626',  // rojo oscuro
    tratado: '#3b82f6',        // azul - tratado
    obturado: '#10b981',       // verde - obturado
    obturacion: '#10b981',     // verde - obturación
    extraido: '#6b7280',       // gris - extraído
    ausente: '#6b7280',        // gris - ausente
    endodoncia: '#3b82f6',     // azul - endodoncia
    corona: '#f59e0b',         // amarillo - corona
    implante: '#8b5cf6',       // morado - implante
    protesis: '#ec4899',       // rosa - prótesis
    fractura: '#dc2626',       // rojo - fractura
    sellante: '#06b6d4',       // cyan - sellante
    puente: '#f97316',         // naranja - puente
    pulpitis: '#ef4444',       // rojo - pulpitis
    absceso: '#991b1b',        // rojo oscuro - absceso
    movilidad: '#fb923c',      // naranja claro
    temporal: '#a3e635',       // verde lima - diente temporal
    erosion: '#fbbf24',        // amarillo
    recesion: '#fb7185'        // rosa claro
  };

  // Estados disponibles para cada superficie
  const estadosSuperficie = [
    'sano', 'caries', 'caries_activa', 'obturado', 'tratado', 
    'sellante', 'erosion', 'fractura'
  ];

  // Estados generales del diente
  const estadosGenerales = [
    { valor: 'sano', label: 'Sano', icon: '✓' },
    { valor: 'caries', label: 'Caries', icon: '⚠️' },
    { valor: 'obturado', label: 'Obturado', icon: '●' },
    { valor: 'endodoncia', label: 'Endodoncia', icon: '◐' },
    { valor: 'corona', label: 'Corona', icon: '▼' },
    { valor: 'implante', label: 'Implante', icon: '⬇' },
    { valor: 'protesis', label: 'Prótesis', icon: '▬' },
    { valor: 'extraido', label: 'Extraído', icon: '✕' },
    { valor: 'ausente', label: 'Ausente', icon: '○' },
    { valor: 'fractura', label: 'Fractura', icon: '⚡' },
    { valor: 'puente', label: 'Puente', icon: '═' },
    { valor: 'temporal', label: 'Temporal', icon: 'T' }
  ];

  const handleCaraClick = (cara) => {
    if (readonly) return;

    const estadoActual = estadoCaras[cara];
    const indiceActual = estadosSuperficie.indexOf(estadoActual);
    const siguienteEstado = estadosSuperficie[(indiceActual + 1) % estadosSuperficie.length];
    
    const nuevoEstado = {
      ...estadoCaras,
      [cara]: siguienteEstado
    };
    
    setEstadoCaras(nuevoEstado);
    
    // Callback para actualizar en el componente padre
    if (onUpdate) {
      onUpdate({
        numero: numero,
        superficies: nuevoEstado,
        estado_general: estadoGeneral,
        tiene_caries: Object.values(nuevoEstado).some(e => e.includes('caries')),
        tiene_obturacion: Object.values(nuevoEstado).some(e => e === 'obturado')
      });
    }
  };

  const handleEstadoGeneralChange = (nuevoEstado) => {
    setEstadoGeneral(nuevoEstado);
    setShowMenu(false);

    // Si el diente está extraído o ausente, marcar todas las caras
    if (nuevoEstado === 'extraido' || nuevoEstado === 'ausente') {
      const todasExtraidas = {
        oclusal: nuevoEstado,
        vestibular: nuevoEstado,
        lingual: nuevoEstado,
        mesial: nuevoEstado,
        distal: nuevoEstado
      };
      setEstadoCaras(todasExtraidas);
      
      if (onUpdate) {
        onUpdate({
          numero: numero,
          superficies: todasExtraidas,
          estado_general: nuevoEstado,
          tiene_caries: false,
          tiene_obturacion: false
        });
      }
    } else if (onUpdate) {
      onUpdate({
        numero: numero,
        superficies: estadoCaras,
        estado_general: nuevoEstado,
        tiene_caries: Object.values(estadoCaras).some(e => e.includes('caries')),
        tiene_obturacion: Object.values(estadoCaras).some(e => e === 'obturado'),
        tiene_corona: nuevoEstado === 'corona',
        necesita_extraccion: false
      });
    }
  };

  const getDienteForma = () => {
    // Determinar si es superior o inferior basado en el número
    const esSuperior = numero >= 11 && numero <= 28;
    
    switch (tipo) {
      case 'incisor':
        if (esSuperior) {
          return {
            corona: "M8 2 L16 2 L15 12 L9 12 Z",
            raiz: "M9 12 L15 12 L13 20 L11 20 Z",
            divisionV: "M12 2 L12 12",
            divisionH: "M8 7 L16 7",
          };
        } else {
          return {
            corona: "M9 2 L15 2 L14 12 L10 12 Z",
            raiz: "M10 12 L14 12 L13 18 L11 18 Z",
            divisionV: "M12 2 L12 12",
            divisionH: "M9 7 L15 7",
          };
        }
      case 'canino':
        if (esSuperior) {
          return {
            corona: "M7 2 L17 2 L15 12 L9 12 Z",
            raiz: "M9 12 L15 12 L13 22 L11 22 Z",
            divisionV: "M12 2 L12 12",
            divisionH: "M7 7 L17 7",
          };
        } else {
          return {
            corona: "M8 2 L16 2 L14 12 L10 12 Z",
            raiz: "M10 12 L14 12 L13 18 L11 18 Z",
            divisionV: "M12 2 L12 12",
            divisionH: "M8 7 L16 7",
          };
        }
      case 'premolar':
        return {
          corona: "M6 2 L18 2 L18 12 L6 12 Z",
          raiz: esSuperior ? "M6 12 L18 12 L16 20 L8 20 Z" : "M6 12 L18 12 L16 18 L8 18 Z",
          divisionV: "M12 2 L12 12",
          divisionH: "M6 7 L18 7",
        };
      case 'molar':
      default:
        return {
          corona: "M4 2 L20 2 L20 12 L4 12 Z",
          raiz: esSuperior ? "M4 12 L20 12 L18 20 L6 20 Z" : "M4 12 L20 12 L18 18 L6 18 Z",
          divisionV1: "M8 2 L8 12",
          divisionV2: "M12 2 L12 12",
          divisionV3: "M16 2 L16 12",
          divisionH: "M4 7 L20 7",
        };
    }
  };

  const forma = getDienteForma();

  // Determinar el color principal del diente basado en el estado general
  const colorPrincipal = estadoGeneral === 'sano' 
    ? colores[estadoCaras.vestibular] 
    : colores[estadoGeneral] || '#ffffff';

  // Mostrar símbolo para estados especiales
  const getSimboloEstado = () => {
    const estado = estadosGenerales.find(e => e.valor === estadoGeneral);
    return estado ? estado.icon : null;
  };

  const simbolo = getSimboloEstado();

  // Tooltip con información del diente
  const getTooltipInfo = () => {
    const problemas = [];
    if (Object.values(estadoCaras).some(e => e.includes('caries'))) {
      problemas.push('Caries');
    }
    if (Object.values(estadoCaras).some(e => e === 'obturado')) {
      problemas.push('Obturado');
    }
    if (estadoGeneral !== 'sano') {
      const estado = estadosGenerales.find(e => e.valor === estadoGeneral);
      if (estado) problemas.push(estado.label);
    }
    return problemas.length > 0 ? problemas.join(', ') : 'Sano';
  };

  return (
    <div className="flex flex-col items-center relative">
      <div className="text-xs font-medium text-gray-700 mb-1">{numero}</div>
      
      <div 
        className="relative"
        onMouseEnter={() => showTooltip && setShowTooltipState(true)}
        onMouseLeave={() => setShowTooltipState(false)}
      >
        <svg 
          width="48" 
          height="80" 
          viewBox="0 0 24 24" 
          className={`border border-gray-300 ${!readonly ? 'cursor-pointer' : ''}`}
          onContextMenu={(e) => {
            if (!readonly) {
              e.preventDefault();
              setShowMenu(!showMenu);
            }
          }}
        >
          {/* Corona del diente */}
          <path
            d={forma.corona}
            fill={colorPrincipal}
            stroke="#000000"
            strokeWidth="0.5"
            onClick={() => !readonly && handleCaraClick('vestibular')}
            className={!readonly ? "hover:opacity-80" : ""}
          />
          
          {/* Raíz del diente */}
          <path
            d={forma.raiz}
            fill={estadoGeneral === 'extraido' || estadoGeneral === 'ausente' ? '#e5e7eb' : '#f9f9f9'}
            stroke="#000000"
            strokeWidth="0.5"
          />

          {/* Divisiones anatómicas */}
          {forma.divisionV && (
            <path d={forma.divisionV} stroke="#333333" strokeWidth="0.3" fill="none" />
          )}
          {forma.divisionH && (
            <path d={forma.divisionH} stroke="#333333" strokeWidth="0.3" fill="none" />
          )}
          {forma.divisionV1 && (
            <path d={forma.divisionV1} stroke="#333333" strokeWidth="0.3" fill="none" />
          )}
          {forma.divisionV2 && (
            <path d={forma.divisionV2} stroke="#333333" strokeWidth="0.3" fill="none" />
          )}
          {forma.divisionV3 && (
            <path d={forma.divisionV3} stroke="#333333" strokeWidth="0.3" fill="none" />
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
            className={!readonly ? "hover:fill-gray-200 hover:opacity-50" : ""}
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
            className={!readonly ? "hover:fill-blue-200 hover:opacity-50" : ""}
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
            className={!readonly ? "hover:fill-blue-200 hover:opacity-50" : ""}
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
            className={!readonly ? "hover:fill-green-200 hover:opacity-50" : ""}
            opacity={estadoCaras.lingual !== 'sano' ? "0.8" : "0"}
          />

          {/* Símbolo del estado general */}
          {simbolo && estadoGeneral !== 'sano' && (
            <text
              x="12"
              y="17"
              textAnchor="middle"
              fontSize="8"
              fill="#000000"
              fontWeight="bold"
            >
              {simbolo}
            </text>
          )}
        </svg>

        {/* Tooltip */}
        {showTooltipState && (
          <div className="absolute z-50 bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            {getTooltipInfo()}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}

        {/* Menú contextual */}
        {showMenu && !readonly && (
          <div className="absolute z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-2 top-0 left-full ml-2 w-40">
            <div className="text-xs font-semibold text-gray-700 mb-2 pb-1 border-b">
              Diente {numero}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {estadosGenerales.map((estado) => (
                <button
                  key={estado.valor}
                  onClick={() => handleEstadoGeneralChange(estado.valor)}
                  className={`w-full text-left px-2 py-1 text-xs rounded hover:bg-gray-100 flex items-center space-x-2 ${
                    estadoGeneral === estado.valor ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span>{estado.icon}</span>
                  <span>{estado.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t">
              <button
                onClick={() => setShowMenu(false)}
                className="w-full text-xs text-gray-500 hover:text-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Indicador de problema */}
      {(estadoCaras.oclusal !== 'sano' || 
        estadoCaras.vestibular !== 'sano' || 
        estadoCaras.lingual !== 'sano' || 
        estadoCaras.mesial !== 'sano' || 
        estadoCaras.distal !== 'sano') && estadoGeneral === 'sano' && (
        <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
      )}
    </div>
  );
};

export default DienteSVG;
