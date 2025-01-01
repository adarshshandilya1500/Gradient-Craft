function generateGradient(gradientType: string, colorScheme: string) {
  const baseColor = getRandomColor();
  const stops = getColorStops(baseColor, colorScheme);

  const gradient = {
    type: gradientType,
    gradientStops: stops,
    gradientTransform: [
      [1, 0, 0],
      [0, 1, 0],
    ],
  };

  return gradient;
}

function getColorStops(baseColor, colorScheme) {
  switch (colorScheme) {
    case 'monochromatic':
      return [
        { position: 0, color: baseColor },
        { position: 1, color: adjustBrightness(baseColor, 0.5) },
      ];
    case 'complementary':
      return [
        { position: 0, color: baseColor },
        { position: 1, color: getComplementaryColor(baseColor) },
      ];
    case 'triadic':
      return [
        { position: 0, color: baseColor },
        { position: 0.5, color: getTriadicColor(baseColor, 1) },
        { position: 1, color: getTriadicColor(baseColor, 2) },
      ];
    case 'tetradic':
      return [
        { position: 0, color: baseColor },
        { position: 0.33, color: getTetradicColor(baseColor, 1) },
        { position: 0.66, color: getTetradicColor(baseColor, 2) },
        { position: 1, color: getTetradicColor(baseColor, 3) },
      ];
    default:
      return [
        { position: 0, color: baseColor },
        { position: 1, color: getRandomColor() },
      ];
  }
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'generate-gradient') {
    const gradientType = msg.gradientType || 'GRADIENT_LINEAR';
    const colorScheme = msg.colorScheme || 'monochromatic';
    const gradient = generateGradient(gradientType, colorScheme);
    figma.ui.postMessage({ type: 'update-gradient', gradient });
  }

  if (msg.type === 'apply-gradient') {
    const gradient = msg.gradient;
    if (gradient) {
      const rect = figma.createRectangle();
      rect.resize(300, 200);
      rect.fills = [gradient as Paint];
      figma.currentPage.appendChild(rect);
    }
  }
};

function adjustBrightness(color, factor) {
  return {
    r: Math.min(color.r * factor, 1),
    g: Math.min(color.g * factor, 1),
    b: Math.min(color.b * factor, 1),
    a: color.a,
  };
}

function getComplementaryColor(color) {
  return { r: 1 - color.r, g: 1 - color.g, b: 1 - color.b, a: color.a };
}

function getTriadicColor(color, index) {
  const angle = (120 * index * Math.PI) / 180;
  return rotateColor(color, angle);
}

function getTetradicColor(color, index) {
  const angle = (90 * index * Math.PI) / 180;
  return rotateColor(color, angle);
}

function rotateColor(color, angle) {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  return {
    r: Math.min(Math.abs(color.r * cosA - color.g * sinA), 1),
    g: Math.min(Math.abs(color.g * cosA - color.b * sinA), 1),
    b: Math.min(Math.abs(color.b * cosA - color.r * sinA), 1),
    a: color.a,
  };
}

function getRandomColor() {
  return {
    r: Math.random(),
    g: Math.random(),
    b: Math.random(),
    a: 1,
  };
}

figma.showUI(__html__, { width: 300, height: 600 });
