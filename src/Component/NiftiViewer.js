import React, { useState, useEffect, useRef } from 'react';
import { Box, Dialog, DialogContent } from '@mui/material';
import Canvas from '../Modals/Canvas';

const NiftiViewer = () => {
    const [niftiHeader, setNiftiHeader] = useState(null);
    const [niftiImage, setNiftiImage] = useState(null);
    const [currentSlice, setCurrentSlice] = useState(20);
    const [canvasElement, setCanvasElement] = useState(null);
    const [showCanvas, setShowCanvas] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const drawCanvas = (slice) => {
        const nifti = window.nifti;
        const ctx = canvasElement?.getContext('2d');

        if (!ctx) return;

        const cols = Math.floor(niftiHeader?.dims[1]);
        const rows = Math.floor(niftiHeader?.dims[2]);
        const sliceSize = cols * rows;
        const sliceOffset = sliceSize * slice;

        if (!cols || !rows) return;

        canvasElement.width = cols;
        canvasElement.height = rows;

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

            drawCanvas(currentSlice);
        };

        const makeSlice = (file, start, length) => {
            return file.slice(start, start + length);
        };

        const readFile = (file) => {
            const blob = makeSlice(file, 0, file.size);
            const reader = new FileReader();

            reader.onloadend = (evt) => {
                if (evt.target.readyState === FileReader.DONE) {
                    readNIFTI(file.name, evt.target.result);
                }
            };

            reader.readAsArrayBuffer(blob);
        };

        const handleFileSelect = (evt) => {
            const files = evt.target.files;
            readFile(files[0]);
            setShowCanvas(true);
        };

        document.getElementById('file').addEventListener('change', handleFileSelect, false);

        return () => {
            document.getElementById('file').removeEventListener('change', handleFileSelect);
        };
    }, []);

    useEffect(() => {
        if (showCanvas) {
            drawCanvas(currentSlice);
        }
    }, [currentSlice, showCanvas]);

    const handleModal = () => {
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setShowCanvas(true); // Re-enable canvas outside modal
    };

    return (
        <div>
            <div id="select" style={{ fontFamily: 'sans-serif' }}>
                <h3>Neuroimaging Informatics Technology Initiative</h3>
                <h4>NIfTI Reader</h4>
                <p>Select a file: <input type="file" id="file" name="files" /></p>
                <hr />
            </div>
            <div id="canvas-container">
                <canvas
                    className='canvas_class'
                    onClick={handleModal}
                    ref={(element) => setCanvasElement(element)}
                    width="256"
                    height="256"
                ></canvas><br />
                {
                    showCanvas &&
                    <input
                        type="range"
                        min="0"
                        max={niftiHeader ? niftiHeader.dims[3] - 1 : 0}
                        value={currentSlice}
                        onChange={(e) => setCurrentSlice(parseInt(e.target.value))}
                    />
                }
            </div>
            <Dialog open={openModal} onClose={handleClose}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            padding: "0px",
                            minHeight:'350px',
                            // backgroundColor:'transparent',
                            // boxShadow:'none'
                        },
                    },
                }}
            >
                <DialogContent>
                    <Canvas
                        canvasElement={canvasElement}
                        currentSlice={currentSlice}
                        setCurrentSlice={setCurrentSlice}
                        niftiImage={niftiImage}
                        niftiHeader={niftiHeader}
                        showCanvas={showCanvas}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NiftiViewer;



