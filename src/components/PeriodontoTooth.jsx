import React from 'react';

// Dibuja un diente estilizado (solo contorno) para el periodontograma.
// Es intencionalmente ligero y rápido, pero con curvas para verse más realista.
// Props:
// - x, y: punto de referencia superior-izquierdo de la corona
// - type: incisor | canino | premolar | molar
// - arch: 'upper' | 'lower' (para decidir orientación del texto y raíz)
// - number: número dental (para rotular)
const PeriodontoTooth = ({ x, y, type = 'molar', arch = 'upper', number }) => {
  const stroke = '#bdbdbd';
  const strokeWidth = 1;
  const crownHeight = 36;
  const crownWidthByType = {
    incisor: 26,
    canino: 28,
    premolar: 30,
    molar: 32,
  };
  const rootHeightByType = {
    incisor: 28,
    canino: 34,
    premolar: 30,
    molar: 26,
  };

  const width = crownWidthByType[type] || 30;
  const rootHeight = rootHeightByType[type] || 28;

  // Genera un contorno con curvas Bezier para la corona
  const crownPath = () => {
    const w = width;
    const h = crownHeight;
    const r = 6; // radio de esquinas/curvaturas
    // Diferenciar leve por tipo
    if (type === 'incisor') {
      // Rectángulo suavemente redondeado (bisel incisal sutil)
      return `M ${x + r} ${y} C ${x} ${y}, ${x} ${y}, ${x} ${y + r} L ${x} ${y + h - r}
              C ${x} ${y + h}, ${x} ${y + h}, ${x + r} ${y + h}
              L ${x + w - r} ${y + h}
              C ${x + w} ${y + h}, ${x + w} ${y + h}, ${x + w} ${y + h - r}
              L ${x + w} ${y + r}
              C ${x + w} ${y}, ${x + w} ${y}, ${x + w - r} ${y}
              L ${x + r} ${y} Z`;
    }
    if (type === 'canino') {
      // Corona con cúspide marcada (ligero pico)
      const peakX = x + w / 2;
      return `M ${x + r} ${y} C ${x} ${y}, ${x} ${y}, ${x} ${y + r}
              L ${x} ${y + h - r}
              C ${x} ${y + h}, ${x + w * 0.25} ${y + h}, ${peakX} ${y + h - 3}
              C ${x + w * 0.75} ${y + h}, ${x + w} ${y + h}, ${x + w} ${y + h - r}
              L ${x + w} ${y + r}
              C ${x + w} ${y}, ${x + w} ${y}, ${x + w - r} ${y}
              L ${x + r} ${y} Z`;
    }
    if (type === 'premolar') {
      // Ligero trapecio con bordes suavizados
      return `M ${x + 3} ${y}
              C ${x + 1} ${y + 6}, ${x + 1} ${y + 6}, ${x + 2} ${y + 10}
              L ${x + 2} ${y + h - 6}
              C ${x + 4} ${y + h - 1}, ${x + w - 4} ${y + h - 1}, ${x + w - 2} ${y + h - 6}
              L ${x + w - 2} ${y + 10}
              C ${x + w - 1} ${y + 6}, ${x + w - 1} ${y + 6}, ${x + w - 3} ${y}
              Z`;
    }
    // molar
    return `M ${x + 2} ${y}
            C ${x} ${y + 8}, ${x} ${y + 8}, ${x + 2} ${y + 12}
            L ${x + 2} ${y + crownHeight - 8}
            C ${x + 6} ${y + crownHeight + 1}, ${x + w - 6} ${y + crownHeight + 1}, ${x + w - 2} ${y + crownHeight - 8}
            L ${x + w - 2} ${y + 12}
            C ${x + w} ${y + 8}, ${x + w} ${y + 8}, ${x + w - 2} ${y}
            Z`;
  };

  // Raíz estilizada bajo la corona para arco superior; sobre la corona para arco inferior
  const rootPath = () => {
    const baseY = arch === 'upper' ? y + crownHeight : y; // si es inferior, invertiremos
    const topY = arch === 'upper' ? baseY : baseY + crownHeight; // referencia
    const h = rootHeight;
    const midX = x + width / 2;
    const spread = Math.max(8, width * 0.35);

    if (arch === 'upper') {
      // Raíces hacia abajo
      return `M ${x + 4} ${topY}
              C ${x + 6} ${topY + h * 0.35}, ${midX - spread / 2} ${topY + h * 0.55}, ${midX - 2} ${topY + h}
              L ${midX + 2} ${topY + h}
              C ${midX + spread / 2} ${topY + h * 0.55}, ${x + width - 6} ${topY + h * 0.35}, ${x + width - 4} ${topY}
              Z`;
    }

    // Raíces hacia arriba (arco inferior): dibujamos encima de la corona
    return `M ${x + 4} ${topY}
            C ${x + 6} ${topY - h * 0.35}, ${midX - spread / 2} ${topY - h * 0.55}, ${midX - 2} ${topY - h}
            L ${midX + 2} ${topY - h}
            C ${midX + spread / 2} ${topY - h * 0.55}, ${x + width - 6} ${topY - h * 0.35}, ${x + width - 4} ${topY}
            Z`;
  };

  // Posición del número dental
  const labelX = x + width / 2;
  const labelY = arch === 'upper' ? y - 8 : y + crownHeight + 14;

  return (
    <g>
      {/* Corona */}
      <path d={crownPath()} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
      {/* Raíz */}
      <path d={rootPath()} fill="none" stroke={stroke} strokeWidth={strokeWidth} />
      {/* Número */}
      <text x={labelX} y={labelY} textAnchor="middle" fontSize="10" fill="#888888">{number}</text>
    </g>
  );
};

export default PeriodontoTooth;


