import React from 'react';

export const Canvas = ({ render }) => {
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const pixelRatio = window.devicePixelRatio || 1;
        const canvas = canvasRef.current;

        if (!canvas) {
            return; // TODO hack for redirect out
        }

        const rect = canvas.getBoundingClientRect();

        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        canvas.width = rect.width * pixelRatio;
        canvas.height = rect.height * pixelRatio;

        const context = canvas.getContext('2d');
        context.scale(pixelRatio, pixelRatio);

        render(context, rect);
    }, []);

    return (
        <canvas style={{ width: '100%', height: '100%' }} ref={canvasRef} />
    );
};
