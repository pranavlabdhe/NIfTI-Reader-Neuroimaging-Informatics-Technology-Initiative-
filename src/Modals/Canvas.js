// import React, { useEffect, useState } from 'react';

// const Canvas = ({ niftiHeader, niftiImage, currentSlice, canvasElement, showCanvas }) => {
//     const [zoomLevel, setZoomLevel] = useState(2);

//     const drawCanvas = (slice, zoom) => {
//         const nifti = window.nifti;
//         const ctx = canvasElement?.getContext('2d');

//         if (!ctx) return;

//         const cols = Math.floor(niftiHeader?.dims[1]);
//         const rows = Math.floor(niftiHeader?.dims[2]);
//         const sliceSize = cols * rows;
//         const sliceOffset = sliceSize * slice;

//         if (!cols || !rows) return;

//         canvasElement.width = cols * zoom;
//         canvasElement.height = rows * zoom;

//         const imageData = ctx.createImageData(cols, rows);
//         const data = new Int16Array(niftiImage, sliceOffset * 2, sliceSize);
//         const maxVal = Math.max(...data);
//         const minVal = Math.min(...data);
//         const range = maxVal - minVal;

//         for (let i = 0; i < data.length; i++) {
//             const value = ((data[i] - minVal) / range) * 255;
//             imageData.data[i * 4] = value;
//             imageData.data[i * 4 + 1] = value;
//             imageData.data[i * 4 + 2] = value;
//             imageData.data[i * 4 + 3] = 255;
//         }

//         ctx.putImageData(imageData, 0, 0);

//         if (zoom > 1) {
//             ctx.scale(zoom, zoom);
//             ctx.drawImage(canvasElement, 0, 0);
//         }
//     };

//     useEffect(() => {
//         if (niftiHeader && niftiImage && showCanvas) {
//             drawCanvas(currentSlice, zoomLevel);
//         }
//     }, [currentSlice, niftiHeader, niftiImage, showCanvas, zoomLevel]);

//     return (
//         <div style={{display:'flex', justifyContent:'center'}}>
//             <canvas ref={(el) => el ? canvasElement = el : null} width="256" height="256"></canvas>
//             <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px',position:'absolute', top:'-13px' }}>
//                 <input
//                     type="range"
//                     min="1"
//                     max="4"
//                     step="0.1"
//                     value={zoomLevel}
//                     onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
//                     style={{ flexGrow: 1 }}
//                 />
//                 <span style={{ marginLeft: '10px' }}>{Math.round(zoomLevel * 100)}%</span>
//             </div>
//         </div>
//     );
// };

// export default Canvas;



// import React, { useEffect, useState } from 'react';

// const Canvas = ({ niftiHeader, niftiImage, currentSlice, canvasElement, showCanvas }) => {
//     const [zoomLevel, setZoomLevel] = useState(1);
//     const [regionZoom, setRegionZoom] = useState({ x: 0, y: 0, width: 0, height: 0 });
//     const [isSelecting, setIsSelecting] = useState(false);

//     const drawCanvas = (slice, zoom, region = { x: 0, y: 0, width: 0, height: 0 }) => {
//         const nifti = window.nifti;
//         const ctx = canvasElement?.getContext('2d');

//         if (!ctx) return;

//         const cols = Math.floor(niftiHeader?.dims[1]);
//         const rows = Math.floor(niftiHeader?.dims[2]);
//         const sliceSize = cols * rows;
//         const sliceOffset = sliceSize * slice;

//         if (!cols || !rows) return;

//         canvasElement.width = cols * zoom;
//         canvasElement.height = rows * zoom;

//         const imageData = ctx.createImageData(cols, rows);
//         const data = new Int16Array(niftiImage, sliceOffset * 2, sliceSize);
//         const maxVal = Math.max(...data);
//         const minVal = Math.min(...data);
//         const range = maxVal - minVal;

//         for (let i = 0; i < data.length; i++) {
//             const value = ((data[i] - minVal) / range) * 255;
//             imageData.data[i * 4] = value;
//             imageData.data[i * 4 + 1] = value;
//             imageData.data[i * 4 + 2] = value;
//             imageData.data[i * 4 + 3] = 255;
//         }

//         ctx.putImageData(imageData, 0, 0);

//         if (zoom > 1) {
//             ctx.scale(zoom, zoom);
//             ctx.drawImage(canvasElement, 0, 0);
//         }

//         if (region.width > 0 && region.height > 0) {
//             ctx.strokeStyle = 'red';
//             ctx.lineWidth = 2;
//             ctx.strokeRect(region.x, region.y, region.width, region.height);
//         }
//     };

//     useEffect(() => {
//         if (niftiHeader && niftiImage && showCanvas) {
//             drawCanvas(currentSlice, zoomLevel, regionZoom);
//         }
//     }, [currentSlice, niftiHeader, niftiImage, showCanvas, zoomLevel, regionZoom]);

//     const handleMouseDown = (e) => {
//         const rect = canvasElement.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         setRegionZoom({ x, y, width: 0, height: 0 });
//         setIsSelecting(true);
//     };

//     const handleMouseMove = (e) => {
//         if (!isSelecting) return;

//         const rect = canvasElement.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         setRegionZoom((prevRegion) => ({
//             ...prevRegion,
//             width: x - prevRegion.x,
//             height: y - prevRegion.y,
//         }));
//     };

//     const handleMouseUp = () => {
//         setIsSelecting(false);
//         setZoomLevel(2); // Zoom in after selection
//     };

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
//             <canvas
//                 ref={(el) => el ? canvasElement = el : null}
//                 width="256"
//                 height="256"
//                 onMouseDown={handleMouseDown}
//                 onMouseMove={handleMouseMove}
//                 onMouseUp={handleMouseUp}
//                 style={{ cursor: isSelecting ? 'crosshair' : 'default' }}
//             ></canvas>

//             <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', position: 'absolute', top: '0', right: '0' }}>
//                 {/* <input
//                     type="range"
//                     min="1"
//                     max="4"
//                     step="0.1"
//                     value={zoomLevel}
//                     onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
//                     style={{ flexGrow: 1 }}
//                 />
//                 <span style={{ marginLeft: '10px' }}>{Math.round(zoomLevel * 100)}%</span> */}
//             </div>
//         </div>
//     );
// };

// export default Canvas;


// import React, { useEffect, useState } from 'react';

// const Canvas = ({ niftiHeader, niftiImage, currentSlice, canvasElement, showCanvas }) => {
//     const [zoomLevel, setZoomLevel] = useState(1);
//     const [regionZoom, setRegionZoom] = useState({ x: 0, y: 0, width: 0, height: 0 });
//     const [isSelecting, setIsSelecting] = useState(false);

//     const drawCanvas = (slice, zoom, region = { x: 0, y: 0, width: 0, height: 0 }) => {
//         const nifti = window.nifti;
//         const ctx = canvasElement?.getContext('2d');

//         if (!ctx) return;

//         const cols = Math.floor(niftiHeader?.dims[1]);
//         const rows = Math.floor(niftiHeader?.dims[2]);
//         const sliceSize = cols * rows;
//         const sliceOffset = sliceSize * slice;

//         if (!cols || !rows) return;

//         canvasElement.width = cols * zoom;
//         canvasElement.height = rows * zoom;

//         const imageData = ctx.createImageData(cols, rows);
//         const data = new Int16Array(niftiImage, sliceOffset * 2, sliceSize);
//         const maxVal = Math.max(...data);
//         const minVal = Math.min(...data);
//         const range = maxVal - minVal;

//         for (let i = 0; i < data.length; i++) {
//             const value = ((data[i] - minVal) / range) * 255;
//             imageData.data[i * 4] = value;
//             imageData.data[i * 4 + 1] = value;
//             imageData.data[i * 4 + 2] = value;
//             imageData.data[i * 4 + 3] = 255;
//         }

//         ctx.putImageData(imageData, 0, 0);

//         if (zoom > 1) {
//             ctx.scale(zoom, zoom);
//             ctx.drawImage(canvasElement, 0, 0);
//         }

//         if (region.width > 0 && region.height > 0) {
//             ctx.strokeStyle = 'red';
//             ctx.lineWidth = 2;
//             ctx.strokeRect(region.x, region.y, region.width, region.height);
//         }
//     };

//     useEffect(() => {
//         if (niftiHeader && niftiImage && showCanvas) {
//             drawCanvas(currentSlice, zoomLevel, regionZoom);
//         }
//     }, [currentSlice, niftiHeader, niftiImage, showCanvas, zoomLevel, regionZoom]);

//     const handleMouseDown = (e) => {
//         const rect = canvasElement.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         setRegionZoom({ x, y, width: 0, height: 0 });
//         setIsSelecting(true);
//     };

//     const handleMouseMove = (e) => {
//         if (!isSelecting) return;

//         const rect = canvasElement.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         setRegionZoom((prevRegion) => ({
//             ...prevRegion,
//             width: x - prevRegion.x,
//             height: y - prevRegion.y,
//         }));
//     };

//     const handleMouseUp = () => {
//         setIsSelecting(false);
//         setZoomLevel(2); // Zoom in after selection
//     };

//     const handleRegionZoom = (zoomValue) => {
//         setZoomLevel(zoomValue / 100); // Convert percentage to zoom level
//     };

//     const handleResetZoom = () => {
//         setZoomLevel(1); // Reset zoom level to default
//     };

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
//             <canvas
//                 ref={(el) => el ? canvasElement = el : null}
//                 width="256"
//                 height="256"
//                 onMouseDown={handleMouseDown}
//                 onMouseMove={handleMouseMove}
//                 onMouseUp={handleMouseUp}
//                 style={{ cursor: isSelecting ? 'crosshair' : 'default' }}
//             ></canvas>
//             <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', position: 'absolute', top: '0', right: '0' }}>
//                 <input
//                     type="range"
//                     min="0"
//                     max="150"
//                     step="10"
//                     value={zoomLevel * 100}
//                     onChange={(e) => handleRegionZoom(parseFloat(e.target.value))}
//                     style={{ flexGrow: 1 }}
//                 />
//                 <button onClick={handleResetZoom}>Reset</button>
//             </div>
//         </div>
//     );
// };

// export default Canvas;





// import React, { useEffect, useState } from 'react';

// const Canvas = ({ niftiHeader, niftiImage, currentSlice, canvasElement, showCanvas }) => {
//     const [zoomLevel, setZoomLevel] = useState(1);
//     const [regionZoom, setRegionZoom] = useState({ x: 0, y: 0, width: 0, height: 0 });
//     const [isSelecting, setIsSelecting] = useState(false);

//     const drawCanvas = (slice, zoom, region = { x: 0, y: 0, width: 0, height: 0 }) => {
//         const nifti = window.nifti;
//         const ctx = canvasElement?.getContext('2d');

//         if (!ctx) return;

//         const cols = Math.floor(niftiHeader?.dims[1]);
//         const rows = Math.floor(niftiHeader?.dims[2]);
//         const sliceSize = cols * rows;
//         const sliceOffset = sliceSize * slice;

//         if (!cols || !rows) return;

//         canvasElement.width = cols * zoom;
//         canvasElement.height = rows * zoom;

//         const imageData = ctx.createImageData(cols, rows);
//         const data = new Int16Array(niftiImage, sliceOffset * 2, sliceSize);
//         const maxVal = Math.max(...data);
//         const minVal = Math.min(...data);
//         const range = maxVal - minVal;

//         for (let i = 0; i < data.length; i++) {
//             const value = ((data[i] - minVal) / range) * 255;
//             imageData.data[i * 4] = value;
//             imageData.data[i * 4 + 1] = value;
//             imageData.data[i * 4 + 2] = value;
//             imageData.data[i * 4 + 3] = 255;
//         }

//         ctx.putImageData(imageData, 0, 0);

//         if (zoom > 1) {
//             ctx.scale(zoom, zoom);
//             ctx.drawImage(canvasElement, 0, 0);
//         }

//         if (region.width > 0 && region.height > 0) {
//             ctx.strokeStyle = 'red';
//             ctx.lineWidth = 2;
//             ctx.strokeRect(region.x, region.y, region.width, region.height);
//         }
//     };

//     useEffect(() => {
//         if (niftiHeader && niftiImage && showCanvas) {
//             drawCanvas(currentSlice, zoomLevel, regionZoom);
//         }
//     }, [currentSlice, niftiHeader, niftiImage, showCanvas, zoomLevel, regionZoom]);

//     const handleMouseDown = (e) => {
//         const rect = canvasElement.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         setRegionZoom({ x, y, width: 0, height: 0 });
//         setIsSelecting(true);
//     };

//     const handleMouseMove = (e) => {
//         if (!isSelecting) return;

//         const rect = canvasElement.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         setRegionZoom((prevRegion) => ({
//             ...prevRegion,
//             width: x - prevRegion.x,
//             height: y - prevRegion.y,
//         }));
//     };

//     const handleMouseUp = () => {
//         setIsSelecting(false);
//         setZoomLevel(2); // Zoom in after selection
//     };

//     const handleRegionZoom = (zoomValue) => {
//         setZoomLevel(zoomValue / 100); // Convert percentage to zoom level
//     };

//     const handleResetZoom = () => {
//         setZoomLevel(1); // Reset zoom level to default
//     };

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
//             <canvas
//                 ref={(el) => el ? canvasElement = el : null}
//                 width="256"
//                 height="256"
//                 onMouseDown={handleMouseDown}
//                 onMouseMove={handleMouseMove}
//                 onMouseUp={handleMouseUp}
//                 style={{ cursor: isSelecting ? 'crosshair' : 'default' }}
//             ></canvas>
//             <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', position: 'absolute', top: '0', right: '0' }}>
//                 <button onClick={handleResetZoom}>Reset</button>
//             </div>
//         </div>
//     );
// };

// export default Canvas;



// import React, { useEffect, useState, useRef } from 'react';

// const Canvas = ({ niftiHeader, niftiImage, currentSlice, showCanvas }) => {
//     const [zoomLevel, setZoomLevel] = useState(1);
//     const [regionZoom, setRegionZoom] = useState({ x: 0, y: 0, width: 0, height: 0 });
//     const [isSelecting, setIsSelecting] = useState(false);
//     const canvasRef = useRef(null);
//     const selectedCanvasRef = useRef(null);

//     const drawCanvas = (slice, zoom, region = { x: 0, y: 0, width: 0, height: 0 }) => {
//         const nifti = window.nifti;
//         const ctx = canvasRef?.current?.getContext('2d');
//         const selectedCtx = selectedCanvasRef?.current?.getContext('2d');

//         if (!ctx || !selectedCtx) return;

//         const cols = Math.floor(niftiHeader?.dims[1]);
//         const rows = Math.floor(niftiHeader?.dims[2]);
//         const sliceSize = cols * rows;
//         const sliceOffset = sliceSize * slice;

//         if (!cols || !rows) return;

//         canvasRef.current.width = cols;
//         canvasRef.current.height = rows;

//         selectedCanvasRef.current.width = region.width;
//         selectedCanvasRef.current.height = region.height;

//         const imageData = ctx.createImageData(cols, rows);
//         const data = new Int16Array(niftiImage, sliceOffset * 2, sliceSize);
//         const maxVal = Math.max(...data);
//         const minVal = Math.min(...data);
//         const range = maxVal - minVal;

//         for (let i = 0; i < data.length; i++) {
//             const value = ((data[i] - minVal) / range) * 255;
//             imageData.data[i * 4] = value;
//             imageData.data[i * 4 + 1] = value;
//             imageData.data[i * 4 + 2] = value;
//             imageData.data[i * 4 + 3] = 255;
//         }

//         ctx.putImageData(imageData, 0, 0);

//         if (zoom > 1) {
//             ctx.scale(zoom, zoom);
//             ctx.drawImage(canvasRef.current, 0, 0);
//         }

//         if (region.width > 0 && region.height > 0) {
//             selectedCtx.drawImage(canvasRef.current, region.x, region.y, region.width, region.height, 0, 0, region.width, region.height);
//         }
//     };

//     useEffect(() => {
//         if (niftiHeader && niftiImage && showCanvas) {
//             drawCanvas(currentSlice, zoomLevel, regionZoom);
//         }
//     }, [currentSlice, niftiHeader, niftiImage, showCanvas, zoomLevel, regionZoom]);

//     const handleMouseDown = (e) => {
//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         setRegionZoom({ x, y, width: 0, height: 0 });
//         setIsSelecting(true);
//     };

//     const handleMouseMove = (e) => {
//         if (!isSelecting) return;

//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         setRegionZoom((prevRegion) => ({
//             ...prevRegion,
//             width: x - prevRegion.x,
//             height: y - prevRegion.y,
//         }));
//     };

//     const handleMouseUp = () => {
//         setIsSelecting(false);
//     };

//     const handleZoom = (zoomValue) => {
//         setZoomLevel(zoomValue);
//     };

//     const handleResetZoom = () => {
//         setZoomLevel(1);
//     };

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
//             <canvas
//                 ref={canvasRef}
//                 width="256"
//                 height="256"
//                 onMouseDown={handleMouseDown}
//                 onMouseMove={handleMouseMove}
//                 onMouseUp={handleMouseUp}
//                 style={{ cursor: isSelecting ? 'crosshair' : 'default' }}
//             ></canvas>
//             <canvas
//                 ref={selectedCanvasRef}
//                 style={{ border: '1px solid #000', width:'300px', marginLeft: '10px' }}
//             ></canvas>
//             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', position: 'absolute', top: '0', right: '0' }}>
//                 <input
//                     type="range"
//                     min="100"
//                     max="150"
//                     step="10"
//                     value={zoomLevel * 100}
//                     onChange={(e) => handleZoom(parseFloat(e.target.value) / 100)}
//                     style={{ width: '150px' }}
//                 />
//                 <button onClick={handleResetZoom}>Reset Zoom</button>
//             </div>
//         </div>
//     );
// };

// export default Canvas;


// import React, { useEffect, useState, useRef } from 'react';

// const Canvas = ({ niftiHeader, niftiImage, currentSlice, showCanvas }) => {
//     const [zoomLevel, setZoomLevel] = useState(1);
//     const [regionZoom, setRegionZoom] = useState({ x: 0, y: 0, width: 0, height: 0 });
//     const [isSelecting, setIsSelecting] = useState(false);
//     const canvasRef = useRef(null);
//     const selectedCanvasRef = useRef(null);

//     const drawCanvas = (slice, zoom, region = { x: 0, y: 0, width: 0, height: 0 }) => {
//         const nifti = window.nifti;
//         const ctx = canvasRef?.current?.getContext('2d');
//         const selectedCtx = selectedCanvasRef?.current?.getContext('2d');

//         if (!ctx || !selectedCtx) return;

//         const cols = Math.floor(niftiHeader?.dims[1]);
//         const rows = Math.floor(niftiHeader?.dims[2]);
//         const sliceSize = cols * rows;
//         const sliceOffset = sliceSize * slice;

//         if (!cols || !rows) return;

//         canvasRef.current.width = cols;
//         canvasRef.current.height = rows;

//         selectedCanvasRef.current.width = region.width;
//         selectedCanvasRef.current.height = region.height;

//         const imageData = ctx.createImageData(cols, rows);
//         const data = new Int16Array(niftiImage, sliceOffset * 2, sliceSize);
//         const maxVal = Math.max(...data);
//         const minVal = Math.min(...data);
//         const range = maxVal - minVal;

//         for (let i = 0; i < data.length; i++) {
//             const value = ((data[i] - minVal) / range) * 255;
//             imageData.data[i * 4] = value;
//             imageData.data[i * 4 + 1] = value;
//             imageData.data[i * 4 + 2] = value;
//             imageData.data[i * 4 + 3] = 255;
//         }

//         ctx.putImageData(imageData, 0, 0);

//         if (zoom > 1) {
//             ctx.scale(zoom, zoom);
//             ctx.drawImage(canvasRef.current, 0, 0);
//         }

//         if (region.width > 0 && region.height > 0) {
//             ctx.strokeStyle = 'red';
//             ctx.lineWidth = 2;
//             ctx.strokeRect(region.x, region.y, region.width, region.height);

//             selectedCtx.drawImage(canvasRef.current, region.x, region.y, region.width, region.height, 0, 0, region.width, region.height);
//         }
//     };

//     useEffect(() => {
//         if (niftiHeader && niftiImage && showCanvas) {
//             drawCanvas(currentSlice, zoomLevel, regionZoom);
//         }
//     }, [currentSlice, niftiHeader, niftiImage, showCanvas, zoomLevel, regionZoom]);

//     const handleMouseDown = (e) => {
//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         setRegionZoom({ x, y, width: 0, height: 0 });
//         setIsSelecting(true);
//     };

//     const handleMouseMove = (e) => {
//         if (!isSelecting) return;

//         const rect = canvasRef.current.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         setRegionZoom((prevRegion) => ({
//             ...prevRegion,
//             width: x - prevRegion.x,
//             height: y - prevRegion.y,
//         }));
//     };

//     const handleMouseUp = () => {
//         setIsSelecting(false);
//     };

//     const handleZoom = (zoomValue) => {
//         setZoomLevel(zoomValue);
//     };

//     const handleResetZoom = () => {
//         setZoomLevel(1);
//     };

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', padding: '38px' }}>
//             <canvas
//                 ref={canvasRef}
//                 width="256"
//                 height="256"
//                 onMouseDown={handleMouseDown}
//                 onMouseMove={handleMouseMove}
//                 onMouseUp={handleMouseUp}
//                 style={{ cursor: isSelecting ? 'crosshair' : 'default' }}
//             ></canvas>
//             <canvas
//                 ref={selectedCanvasRef}
//                 style={{ border: '1px solid #000', width:'256px', height: '256px', marginLeft: '10px' }}
//             ></canvas>
//             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px', position: 'absolute', top: '0', right: '0' }}>
//                 <input
//                     type="range"
//                     min="100"
//                     max="150"
//                     step="10"
//                     value={zoomLevel * 100}
//                     onChange={(e) => handleZoom(parseFloat(e.target.value) / 100)}
//                     style={{ width: '150px' }}
//                 />
//                 <button onClick={handleResetZoom}>Reset Zoom</button>
//             </div>
//         </div>
//     );
// };

// export default Canvas;


import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@mui/material';
const Canvas = ({ niftiHeader, niftiImage, currentSlice, showCanvas }) => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [regionZoom, setRegionZoom] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [isSelecting, setIsSelecting] = useState(false);
    const canvasRef = useRef(null);
    const selectedCanvasRef = useRef(null);

    // const drawCanvas = (slice, zoom, region = { x: 0, y: 0, width: 0, height: 0 }) => {
    //     const nifti = window.nifti;
    //     const ctx = canvasRef?.current?.getContext('2d');
    //     const selectedCtx = selectedCanvasRef?.current?.getContext('2d');

    //     if (!ctx || !selectedCtx) return;

    //     const cols = Math.floor(niftiHeader?.dims[1]);
    //     const rows = Math.floor(niftiHeader?.dims[2]);
    //     const sliceSize = cols * rows;
    //     const sliceOffset = sliceSize * slice;

    //     if (!cols || !rows) return;

    //     canvasRef.current.width = cols;
    //     canvasRef.current.height = rows;

    //     selectedCanvasRef.current.width = region.width;
    //     selectedCanvasRef.current.height = region.height;

    //     const imageData = ctx.createImageData(cols, rows);
    //     const data = new Int16Array(niftiImage, sliceOffset * 2, sliceSize);
    //     const maxVal = Math.max(...data);
    //     const minVal = Math.min(...data);
    //     const range = maxVal - minVal;

    //     for (let i = 0; i < data.length; i++) {
    //         const value = ((data[i] - minVal) / range) * 255;
    //         imageData.data[i * 4] = value;
    //         imageData.data[i * 4 + 1] = value;
    //         imageData.data[i * 4 + 2] = value;
    //         imageData.data[i * 4 + 3] = 255;
    //     }

    //     ctx.putImageData(imageData, 0, 0);

    //     if (zoom > 1) {
    //         ctx.scale(zoom, zoom);
    //         ctx.drawImage(canvasRef.current, 0, 0);
    //     }

    //     if (region.width > 0 && region.height > 0) {
    //         ctx.strokeStyle = 'red';
    //         ctx.lineWidth = 2;
    //         ctx.strokeRect(region.x, region.y, region.width, region.height);

    //         selectedCtx.drawImage(canvasRef.current, region.x, region.y, region.width, region.height, 0, 0, region.width, region.height);
    //     }
    // };
    const drawCanvas = (slice, zoom, region = { x: 0, y: 0, width: 0, height: 0 }) => {
        const nifti = window.nifti;
        const ctx = canvasRef?.current?.getContext('2d');
        const selectedCtx = selectedCanvasRef?.current?.getContext('2d');
    
        if (!ctx || !selectedCtx) return;
    
        const cols = Math.floor(niftiHeader?.dims[1]);
        const rows = Math.floor(niftiHeader?.dims[2]);
        const sliceSize = cols * rows;
        const sliceOffset = sliceSize * slice;
    
        if (!cols || !rows) return;
    
        canvasRef.current.width = cols;
        canvasRef.current.height = rows;
    
        selectedCanvasRef.current.width = region.width;
        selectedCanvasRef.current.height = region.height;
    
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
    
        if (zoom > 1) {
            const centerX = cols / 2;
            const centerY = rows / 2;
    
            ctx.translate(centerX, centerY); // Translate to the center of the canvas
            ctx.scale(zoom, zoom); // Scale the canvas
            ctx.drawImage(canvasRef.current, -centerX, -centerY); // Draw the image centered
            ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transformation
        }
    
        if (region.width > 0 && region.height > 0) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(region.x, region.y, region.width, region.height);
    
            selectedCtx.drawImage(canvasRef.current, region.x, region.y, region.width, region.height, 0, 0, region.width, region.height);
        }
    };
    
    useEffect(() => {
        if (niftiHeader && niftiImage && showCanvas) {
            drawCanvas(currentSlice, zoomLevel, regionZoom);
        }
    }, [currentSlice, niftiHeader, niftiImage, showCanvas, zoomLevel, regionZoom]);

    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setRegionZoom({ x, y, width: 0, height: 0 });
        setIsSelecting(true);
    };

    const handleMouseMove = (e) => {
        if (!isSelecting) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setRegionZoom((prevRegion) => ({
            ...prevRegion,
            width: x - prevRegion.x,
            height: y - prevRegion.y,
        }));
    };

    const handleMouseUp = () => {
        setIsSelecting(false);
        setZoomLevel(1); // Reset zoom to 0% when selection is unselected
    };

    const handleZoom = (zoomValue) => {
        setZoomLevel(zoomValue);
    };

    const handleResetZoom = () => {
        setZoomLevel(1);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <canvas
                ref={canvasRef}
                width="376"
                height="256"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                style={{ cursor: isSelecting ? 'crosshair' : 'default' }}
            ></canvas>
            <canvas
                ref={selectedCanvasRef}
                style={{ border: '1px solid #000', width:'376px', height: '256px', marginLeft: '10px' }}
            ></canvas>
            <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '25px',position:'absolute',height:'30px' }}>
                    <input
                        type="range"
                        min="100"
                        max="150"
                        step="10"
                        value={zoomLevel * 100}
                        onChange={(e) => handleZoom(parseFloat(e.target.value) / 100)}
                        style={{ width: '150px' }}
                    />
                    <Button variant="contained" onClick={handleResetZoom} >Reset Zoom</Button>
                </div>
            </div>
        </div>
    );
};

export default Canvas;