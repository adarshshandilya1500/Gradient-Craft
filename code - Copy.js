"use strict";
function generateGradient(gradientType) {
    const stops = [
        { position: 0, color: getRandomColor() },
        { position: 1, color: getRandomColor() },
    ];
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
figma.ui.onmessage = (msg) => {
    if (msg.type === 'generate-gradient') {
        const gradientType = msg.gradientType || 'GRADIENT_LINEAR';
        const gradient = generateGradient(gradientType);
        figma.ui.postMessage({ type: 'update-gradient', gradient });
    }
    if (msg.type === 'apply-gradient') {
        const gradient = msg.gradient;
        if (gradient) {
            const rect = figma.createRectangle();
            rect.resize(300, 200);
            const fills = [
                {
                    type: gradient.type, // 'GRADIENT_LINEAR', 'GRADIENT_RADIAL', etc.
                    gradientStops: gradient.gradientStops,
                    gradientTransform: gradient.gradientTransform,
                },
            ];
            rect.fills = fills;
            figma.currentPage.appendChild(rect);
        }
    }
};
function getRandomColor() {
    return {
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
        a: 1,
    };
}
figma.showUI(__html__, { width: 300, height: 500 });
