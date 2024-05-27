import React, { useState, useEffect, useRef } from 'react';

const NiftiViewer = () => {
    const [niftiHeader, setNiftiHeader] = useState(null);
    const [niftiImage, setNiftiImage] = useState(null);
    const [currentSlice, setCurrentSlice] = useState(20);
    const canvasRef = useRef(null);
    const [showCanvas, setShowCanvas] = useState(false)

    const drawCanvas = (slice) => {
        const nifti = window.nifti;
        const ctx = canvasRef.current.getContext('2d');
    
        if (!ctx) {
            return;
        }
    
        const cols = Math.floor(niftiHeader?.dims[1]);
        const rows = Math.floor(niftiHeader?.dims[2]);
        const sliceSize = cols * rows;
        const sliceOffset = sliceSize * slice;
    
        if (!cols || !rows) {
            return;
        }
    
        canvasRef.current.width = cols;
        canvasRef.current.height = rows;
    
        const imageData = ctx.createImageData(cols, rows);
        const data = new Int16Array(niftiImage, sliceOffset * 2, sliceSize);
        const maxVal = Math.max(...data);
        const minVal = Math.min(...data);
        const range = maxVal - minVal;
    
        for (let i = 0; i < data.length; i++) {
            const value = ((data[i] - minVal) / range) * 255;
            imageData.data[i * 4] = value;
            imageData.data[i * 4 + 1] = value;
            imageData.data[i * 4 + 2] = value;
            imageData.data[i * 4 + 3] = 255;
        }
    
        ctx.putImageData(imageData, 0, 0); 
     
    };
    
    useEffect(() => {
        const nifti = window.nifti;
    
        const readNIFTI = (name, buf) => {
            const header = nifti.readHeader(buf);
            const image = nifti.readImage(header, buf);

            setNiftiHeader(header);
            setNiftiImage(image);

            const slices = header.dims[3];
            setCurrentSlice(Math.floor(slices / 2));

            drawCanvas(parseInt(currentSlice));
        };

        const makeSlice = (file, start, length) => {
            return file.slice(start, start + length);
        };

        const readFile = (file) => {
            const blob = makeSlice(file, 0, file.size);
            const reader = new FileReader();

            reader.onloadend = function (evt) {
                if (evt.target.readyState === FileReader.DONE) {
                    readNIFTI(file.name, evt.target.result);
                }
            };

            reader.readAsArrayBuffer(blob);
        };

        const handleFileSelect = (evt) => {
            const files = evt.target.files;
            readFile(files[0]);
            setShowCanvas(true) 
        };

        document.getElementById('file').addEventListener('change', handleFileSelect, false);

        return () => {
            document.getElementById('file').removeEventListener('change', handleFileSelect);
        };
    }, []);

    useEffect(() => {
        drawCanvas(parseInt(currentSlice));
        console.log('Current value of slider',currentSlice);
    }, [currentSlice]);

    return (
        <div>
            <div id="select" style={{ fontFamily: 'sans-serif' }}>
                <h3>Neuroimaging Informatics Technology Initiative </h3>
                <h4>NIfTI Reader</h4>
                <p>Select a file: <input type="file" id="file" name="files" /></p>
                <hr />
            </div>
            {/* <div id="results" style={{ fontFamily: 'sans-serif' }}>
                {niftiHeader && niftiHeader.toFormattedString()}
            </div> */}
            <div id="canvas-container">
                <canvas ref={canvasRef} width="256" height="256"></canvas><br />
                {showCanvas &&
                      <input
                      type="range"
                      min="0"
                      max={niftiHeader ? niftiHeader.dims[3] - 1 : 0}
                      value={currentSlice}
                      onChange={(e) => setCurrentSlice(parseInt(e.target.value))}
                  />
                }
              
            </div>
        </div>
    );
};

export default NiftiViewer;
