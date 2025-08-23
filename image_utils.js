export class Splitter {
    static async splitImage(imagePath, rows, cols) {
        // Wait for image to load
        const image = await Splitter.loadImage(imagePath);

        const pieceWidth = Math.floor(image.width / cols);
        const pieceHeight = Math.floor(image.height / rows);

        // Create source canvas
        const sourceCanvas = document.createElement('canvas');
        const sourceCtx = sourceCanvas.getContext('2d');
        sourceCanvas.width = image.width;
        sourceCanvas.height = image.height;
        sourceCtx.drawImage(image, 0, 0);

        const pieces = [];

        for (let row = 0; row < rows; row++) {
            const rowData = [];

            for (let col = 0; col < cols; col++) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = pieceWidth;
                canvas.height = pieceHeight;

                // Extract piece using getImageData
                const imageData = sourceCtx.getImageData(
                    col * pieceWidth,
                    row * pieceHeight,
                    pieceWidth,
                    pieceHeight
                );
                ctx.putImageData(imageData, 0, 0);

                rowData.push({
                    canvas: canvas,
                    row: row,
                    col: col,
                    dataURL: canvas.toDataURL()
                });
            }

            pieces.push(rowData);
        }
        return pieces;
    }

    // Helper method to load image and wait for it
    static loadImage(imagePath) {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.onload = () => {
                console.log(`Image loaded successfully: ${image.width}x${image.height}`);
                resolve(image);
            };

            image.onerror = (error) => {
                console.error('Failed to load image:', imagePath);
                reject(new Error(`Failed to load image: ${imagePath}`));
            };

            // Set crossOrigin for external images
            image.crossOrigin = 'anonymous';
            image.src = imagePath;
        });
    }
}