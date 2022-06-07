import Layer from "./Layer";

class Canvas{
    //Max dimensions of canvas on screen (not canvas resolution)
    #MAX_WIDTH = 1024;
    #MAX_HEIGHT = 512;

    #scaleDivisor = 1;

    #canvasBoundingRect;
    
    //Auxilary canvas is used for displaying information for user,
    //such as selected area, preview of drawn shapes etc.
    //It's not considered layer and therefore not construced as one.
    #auxilaryCanvas;
    #auxilaryCanvasCTX;

    //Holder for inputing text before actualy drawing it on canvas
    #textInputHolder;

    //Array that stores functions for cleaning up modes side effects
    //Some modes can use other modes therefore it have to be an array instead of function
    //clearMode() executes each function and clear this array
    #modeCleanups = [];
        
    canvasWrapper;

    //Index of currently selected layer
    currentLayerIndex;
    
    canvasResolution = {x: 0, y: 0};
    
    layers = [];

    //---Construct section---
    constructor(wrapperID){
        //---Setting wrapper---
        this.canvasWrapper = document.getElementById(wrapperID);
        this.canvasWrapper.innerHTML = "";
        //------

        //---Initialize input holder---
        this.#textInputHolder = document.createElement("textarea");
        this.#textInputHolder.style = `
            position: absolute;
            background-color: rgba(0, 0, 0, 0);
            border: 2px solid #141414;
            padding: 0px;
        `;
        //------

        //When the window resizes, previous bounding rect is invalid.
        //It have to be recalculated again
        window.addEventListener("resize", () => {
            this.#canvasBoundingRect = this.canvasWrapper.getBoundingClientRect();
        });
    }

    initNew(width, height){
        this.canvasResolution = {x: width, y: height};

        //---Creating auxilary canvas---
        this.#createAuxilaryCanvas(width, height);
        //------

        //---Creating main layer---
        this.addLayer();

        //changeLayers bases on currentLayerIndex property.
        //At the time of constructing currentLayer is not set
        //Instead of writing code in changeLayers for this specific case
        //I initialize layer here
        this.currentLayerIndex = 0;
        const currentLayer = this.layers[this.currentLayerIndex];
        currentLayer.canvasNode.style.pointerEvents = "auto";
        //------

        //Set wrapper dimensions
        this.setScale();
        
        //Get wrapper position on screen
        this.#canvasBoundingRect = this.canvasWrapper.getBoundingClientRect();
    }

    initFromJSON(jsonObject){
        const resolution = jsonObject.resolution;
        this.initNew(resolution.x, resolution.y);

        this.layers[0].canvasNode.remove();
        this.layers = [];
        
        //---Recreating layers---
        const canvasData = jsonObject.layers;

        for(let i = 0; i < canvasData.length; i++){
            this.addLayer();

            const image = new Image();
            image.onload = () => {
                this.layers[i].canvasCTX.clearRect(0, 0, this.canvasResolution.x, this.canvasResolution.y);
                this.layers[i].canvasCTX.drawImage(image, 0, 0);
            }

            image.src = canvasData[i];
        }
        //------

        this.layers[0].canvasNode.style.pointerEvents = "auto";
    }
    //------

    //---Private methods---
    #createAuxilaryCanvas(width, height){
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style = "position: absolute; pointer-events: none; width: 100%; z-index: 10";
        canvas.setAttribute("id", "auxilary-canvas");
        const ctx = canvas.getContext("2d");

        this.canvasWrapper.appendChild(canvas);

        this.#auxilaryCanvas = canvas;
        this.#auxilaryCanvasCTX = ctx;
    }

    //Extract clicked, relative to canvas, position from event
    #extractPosition(event){
        const currentPosition = {
            x: Math.floor((event.clientX - this.#canvasBoundingRect.left) * this.#scaleDivisor),
            y: Math.floor((event.clientY - this.#canvasBoundingRect.top) * this.#scaleDivisor)
        };

        return currentPosition;
    }

    #getPixel(imageData, x, y){
        if (x < 0 || y < 0 || x >= imageData.width || y >= imageData.height) return [-1, -1, -1, -1];

        const startIndex = (y * imageData.width + x) * 4

        return imageData.data.slice(startIndex, startIndex + 4);
    }

    #setPixel(imageData, x, y, value){
        const startIndex = (y * imageData.width + x) * 4

        imageData.data[startIndex + 0] = value[0];
        imageData.data[startIndex + 1] = value[1];
        imageData.data[startIndex + 2] = value[2];
        imageData.data[startIndex + 3] = value[3];
    }

    #moveSettings(prevLayer, newLayer){
        newLayer.canvasCTX.lineWidth = prevLayer.canvasCTX.lineWidth;
        newLayer.canvasCTX.strokeStyle = prevLayer.canvasCTX.strokeStyle;
        newLayer.canvasCTX.lineCap = prevLayer.canvasCTX.lineCap;
        newLayer.canvasCTX.globalCompositeOperation = prevLayer.canvasCTX.globalCompositeOperation;
        
        newLayer.canvasCTX.font = prevLayer.canvasCTX.font;
        newLayer.canvasCTX.fillColor = prevLayer.canvasCTX.fillColor;
    }
    //------

    //---Public getters---
    getCanvasJSON(){
        const canvasesData = [];

        for(let layer of this.layers){
            canvasesData.push(layer.canvasNode.toDataURL());
        }

        return JSON.stringify({
            resolution: this.canvasResolution,
            layers: canvasesData
        });
    }

    getColor(){
        return this.layers[this.currentLayerIndex].canvasCTX.strokeStyle;
    }

    //TODO read from input holder?
    getFontSize(scaled=false){
        const currentFont = this.layers[this.currentLayerIndex].canvasCTX.font;
        const pxIndex = currentFont.indexOf("px");

        const size = parseInt(currentFont.substr(pxIndex - 2, pxIndex));

        if(!scaled) return Math.round(size / this.#scaleDivisor);
        return size;
    }

    getFontFamily(){
        const currentFont = this.layers[this.currentLayerIndex].canvasCTX.font;

        return currentFont.substring(currentFont.indexOf("px") + 3);
    }

    getFillColor(){
        return this.layers[this.currentLayerIndex].canvasCTX.fillStyle;
    }

    //TODO better validation
    getColorRGBA(){
        var currentColor = this.layers[this.currentLayerIndex].canvasCTX.strokeStyle;

        //rgba(r, g, b, a) to [r, g, b, a]
        if(currentColor[0] === "r"){
            return currentColor.substr(5).slice(0, -1).split(",").map((str) => parseInt(str));
        }
        //#ff0044 to [255, 0, 44, 255]
        else{
            currentColor += "ff";
            return currentColor.slice(1).match(/.{1,2}/g).map((str) => parseInt("0x" + str));
        }
    }

    getDrawWidth(){
        return this.layers[this.currentLayerIndex].canvasCTX.lineWidth;
    }

    //Returns canvas combined from all layers
    getMergedLayers(startPosition = {x: 0, y: 0}, size = this.canvasResolution){
        const resultCanvas = document.createElement("canvas");
        resultCanvas.width = size.x;
        resultCanvas.height = size.y;

        const resultCanvasCTX = resultCanvas.getContext("2d");

        for(let layer of this.layers){
            resultCanvasCTX.drawImage(layer.canvasNode, startPosition.x, startPosition.y, size.x, size.y, 0, 0, size.x, size.y);
        }

        return resultCanvas;
    }
    //------

    //---Public setters---
    setColor(color){
        this.layers[this.currentLayerIndex].canvasCTX.strokeStyle = color;
        this.#auxilaryCanvasCTX.strokeStyle = color;

        //For text
        this.layers[this.currentLayerIndex].canvasCTX.fillStyle = color;
        this.#textInputHolder.style.color = color;
    }

    //Compute scale divisor so the canvas can properly fit on screen
    //while maintaining it's resolution
    setScale(){
        if(this.canvasResolution.x > this.#MAX_WIDTH && this.canvasResolution.x < this.canvasResolution.y){
            this.#scaleDivisor = this.canvasResolution.x / this.#MAX_WIDTH;
        }
        else if(this.canvasResolution.y > this.#MAX_HEIGHT){
            this.#scaleDivisor = this.canvasResolution.y / this.#MAX_HEIGHT;
        }

        this.canvasWrapper.style.width = `${this.canvasResolution.x / this.#scaleDivisor}px`;
        this.canvasWrapper.style.height = `${this.canvasResolution.y / this.#scaleDivisor}px`;
    }

    setFontSize(size){
        var scaledSize = Math.round(size * this.#scaleDivisor);
        
        const currentCTX = this.layers[this.currentLayerIndex].canvasCTX;
        currentCTX.font = currentCTX.font.replace(/\d+px/, `${scaledSize}px`);

        this.#textInputHolder.style.fontSize = size + "px";
    }

    setFontFamily(fontFamily){
        //Setting CTX
        const currentCTX = this.layers[this.currentLayerIndex].canvasCTX;
        currentCTX.font = currentCTX.font.replace(currentCTX.font.substr(currentCTX.font.indexOf("px") + 3), fontFamily);

        //Setting holder style
        this.#textInputHolder.style.fontFamily = fontFamily;
    }

    setFillColor(color){
        this.layers[this.currentLayerIndex].canvasCTX.fillStyle = color;
    }

    setDrawWidth(size){
        this.layers[this.currentLayerIndex].canvasCTX.lineWidth = size;
        this.#auxilaryCanvasCTX.lineWidth = size;
    }
    //------

    //---Layers methods---
    addLayer(){
        const layer = new Layer(this.canvasResolution.x, this.canvasResolution.y);
        this.layers.push(layer);
        this.canvasWrapper.appendChild(layer.canvasNode);
    }

    removeLayer(layerIndex){
        if(this.layers.length === 1) return;

        this.layers[layerIndex].canvasNode.remove();

        if(layerIndex === this.currentLayerIndex && this.layers.length > 1){
            const newIndex = layerIndex - 1 >= 0 ? layerIndex - 1 : layerIndex + 1
            
            this.changeLayer(newIndex);
        }

        //If layer under current active layer is being removed I have to decrement currentLayerIndex
        if(layerIndex <= this.currentLayerIndex) this.currentLayerIndex--;

        this.layers.splice(layerIndex, 1);
    }

    changeLayer(layerIndex){
        const prevLayer = this.layers[this.currentLayerIndex];
        const currentLayer = this.layers[layerIndex];
        this.currentLayerIndex = layerIndex;
                
        //---Moving settings and events from previous layer to current---
        this.#moveSettings(prevLayer, currentLayer);
        prevLayer.transferEvents(currentLayer);
        //------
        
        //Moving layer to the back
        prevLayer.canvasNode.style.pointerEvents = "none";
        currentLayer.canvasNode.style.pointerEvents = "auto";
    }

    hideLayer(layerIndex){
        this.layers[layerIndex].canvasNode.style.opacity = 0;
    }

    showLayer(layerIndex){
        this.layers[layerIndex].canvasNode.style.opacity = 1;
    }
    //------

    //---Modes---
    drawMode(mode){
        //---Proper settings---
        const prevSettings = {
            lineCap: this.layers[this.currentLayerIndex].canvasCTX.lineCap
        };

        this.layers[this.currentLayerIndex].canvasCTX.lineCap = "round";
        //------

        this.#modeCleanups.push(() => {
            this.layers[this.currentLayerIndex].canvasCTX.lineCap = prevSettings.lineCap;
        });

        var lastPosition;

        const brushDraw = (event) => {
            this.layers[this.currentLayerIndex].canvasCTX.beginPath();
            this.layers[this.currentLayerIndex].canvasCTX.moveTo(lastPosition.x, lastPosition.y);
    
            lastPosition = this.#extractPosition(event);
    
            this.layers[this.currentLayerIndex].canvasCTX.lineTo(lastPosition.x, lastPosition.y);
            this.layers[this.currentLayerIndex].canvasCTX.stroke();
        }

        const pencilDraw = (event) => {
            const nextPosition = this.#extractPosition(event);

            this.layers[this.currentLayerIndex].canvasCTX.beginPath();
            for(let i = 0; i < 10; i++){
                this.layers[this.currentLayerIndex].canvasCTX.moveTo(lastPosition.x, lastPosition.y);
                this.layers[this.currentLayerIndex].canvasCTX.lineTo(nextPosition.x, nextPosition.y);
                this.layers[this.currentLayerIndex].canvasCTX.stroke();
            }

            lastPosition = Object.assign({}, nextPosition);
        }

        var drawingMethod;

        if(mode === "brush") drawingMethod = brushDraw;
        else if(mode === "pencil") drawingMethod = pencilDraw;

        const handleMouseDown = (event) => {
            lastPosition = this.#extractPosition(event);

            this.layers[this.currentLayerIndex].canvasNode.addEventListener("mousemove", drawingMethod);
        }

        const handleMouseUp = () => {
            this.layers[this.currentLayerIndex].canvasNode.removeEventListener("mousemove", drawingMethod);
        }

        this.layers[this.currentLayerIndex].addModeEvent(
            this.layers[this.currentLayerIndex].canvasNode,
            "mousedown",
            handleMouseDown
        );

        this.layers[this.currentLayerIndex].addModeEvent(
            document,
            "mouseup",
            handleMouseUp
        );
    }

    eraserMode(){
        //---Proper settings---
        const prevSettings = {
            globalCompositeOperation: this.layers[this.currentLayerIndex].canvasCTX.globalCompositeOperation
        };

        this.layers[this.currentLayerIndex].canvasCTX.globalCompositeOperation = "destination-out";
        //------

        this.#modeCleanups.push(() => {
            this.layers[this.currentLayerIndex].canvasCTX.globalCompositeOperation = prevSettings.globalCompositeOperation;
        });

        this.drawMode("brush");
    }

    drawLineMode(){
        //---Proper settings---
        const prevSettings = {
            lineCap: this.#auxilaryCanvasCTX.lineCap
        };

        this.#auxilaryCanvasCTX.lineCap = "square";
        this.layers[this.currentLayerIndex].canvasCTX.lineCap = "square";
        //------

        this.#modeCleanups.push(() => {
            this.#auxilaryCanvasCTX.lineCap = prevSettings.lineCap;
            this.layers[this.currentLayerIndex].canvasCTX.lineCap = prevSettings.lineCap;
        });

        var lastPosition;

        //Drawing line from stored position to mouse position on
        //auxilary canvas
        const drawLinePrev = (event) => {
            const currentPosition = this.#extractPosition(event);

            this.#auxilaryCanvasCTX.clearRect(0, 0, this.canvasResolution.x, this.canvasResolution.y);
            this.#auxilaryCanvasCTX.beginPath();
            this.#auxilaryCanvasCTX.moveTo(lastPosition.x, lastPosition.y);
            this.#auxilaryCanvasCTX.lineTo(currentPosition.x, currentPosition.y);
            this.#auxilaryCanvasCTX.stroke();
        }

        //Storing initial position and drawing from there to current mouse position
        const handleMouseDown = (event) => {
            lastPosition = this.#extractPosition(event);

            this.layers[this.currentLayerIndex].canvasNode.addEventListener("mousemove", drawLinePrev);
        }

        //Drawing line in main canvas and removing drawing preview of the line
        //on the auxilary canvas
        const handleMouseUp = (event) => {
            this.#auxilaryCanvasCTX.clearRect(0, 0, this.canvasResolution.x, this.canvasResolution.y);

            const currentPosition = this.#extractPosition(event);

            this.layers[this.currentLayerIndex].canvasCTX.beginPath();
            this.layers[this.currentLayerIndex].canvasCTX.moveTo(lastPosition.x, lastPosition.y);
            this.layers[this.currentLayerIndex].canvasCTX.lineTo(currentPosition.x, currentPosition.y);
            this.layers[this.currentLayerIndex].canvasCTX.stroke();

            this.layers[this.currentLayerIndex].canvasNode.removeEventListener("mousemove", drawLinePrev);
        }

        this.layers[this.currentLayerIndex].addModeEvent(
            this.layers[this.currentLayerIndex].canvasNode,
            "mousedown",
            handleMouseDown
        );

        this.layers[this.currentLayerIndex].addModeEvent(
            this.layers[this.currentLayerIndex].canvasNode,
            "mouseup",
            handleMouseUp
        );
    }

    drawRectMode(){
        //---Proper settings---
        const prevSettings = {
            lineCap: this.layers[this.currentLayerIndex].canvasCTX.lineCap
        }

        this.layers[this.currentLayerIndex].canvasCTX.lineCap = "square";
        //------

        this.#modeCleanups.push(() => {
            this.layers[this.currentLayerIndex].canvasCTX.lineCap = prevSettings.lineCap;
        });

        var lastPosition;

        //Drawing rect from stored position to mouse position on
        //auxilary canvas
        const drawRectPrev = (event) => {
            const currentPosition = this.#extractPosition(event);
            const rectSize = {
                width: currentPosition.x - lastPosition.x,
                height: currentPosition.y - lastPosition.y
            }

            this.#auxilaryCanvasCTX.clearRect(0, 0, this.canvasResolution.x, this.canvasResolution.y);
            this.#auxilaryCanvasCTX.beginPath();
            this.#auxilaryCanvasCTX.rect(lastPosition.x, lastPosition.y, rectSize.width, rectSize.height);
            this.#auxilaryCanvasCTX.stroke();
        }

        //Storing initial position and drawing from there to current mouse position
        const handleMouseDown = (event) => {
            lastPosition = this.#extractPosition(event);

            this.layers[this.currentLayerIndex].canvasNode.addEventListener("mousemove", drawRectPrev);
        }

        //Drawing rect in main canvas and removing drawing preview of the rect
        //on the auxilary canvas
        const handleMouseUp = (event) => {
            this.#auxilaryCanvasCTX.clearRect(0, 0, this.canvasResolution.x, this.canvasResolution.y);

            const currentPosition = this.#extractPosition(event);
            const rectSize = {
                width: currentPosition.x - lastPosition.x,
                height: currentPosition.y - lastPosition.y
            }

            this.layers[this.currentLayerIndex].canvasCTX.beginPath();
            this.layers[this.currentLayerIndex].canvasCTX.rect(lastPosition.x, lastPosition.y, rectSize.width, rectSize.height);
            this.layers[this.currentLayerIndex].canvasCTX.stroke();

            this.layers[this.currentLayerIndex].canvasNode.removeEventListener("mousemove", drawRectPrev);
        }

        this.layers[this.currentLayerIndex].addModeEvent(
            this.layers[this.currentLayerIndex].canvasNode,
            "mousedown",
            handleMouseDown
        );

        this.layers[this.currentLayerIndex].addModeEvent(
            this.layers[this.currentLayerIndex].canvasNode,
            "mouseup",
            handleMouseUp
        );
    }

    drawCircleMode(){
        //---Proper settings---
        const prevSettings = {
            lineCap: this.layers[this.currentLayerIndex].canvasCTX.lineCap
        }

        this.layers[this.currentLayerIndex].canvasCTX.lineCap = "round";
        //------

        this.#modeCleanups.push(() => {
            this.layers[this.currentLayerIndex].canvasCTX.lineCap = prevSettings.lineCap;
        });

        var lastPosition;

        //Drawing rect from stored position to mouse position on
        //auxilary canvas
        const drawCirclePrev = (event) => {
            const currentPosition = this.#extractPosition(event);
            const radius = Math.floor(Math.sqrt(Math.pow(currentPosition.x - lastPosition.x, 2) + Math.pow(currentPosition.y - lastPosition.y, 2)));

            this.#auxilaryCanvasCTX.clearRect(0, 0, this.canvasResolution.x, this.canvasResolution.y);
            this.#auxilaryCanvasCTX.beginPath();
            this.#auxilaryCanvasCTX.arc(lastPosition.x, lastPosition.y, radius, 0, 2 * Math.PI);
            this.#auxilaryCanvasCTX.stroke();
        }

        //Storing initial position and drawing from there to current mouse position
        const handleMouseDown = (event) => {
            lastPosition = this.#extractPosition(event);

            this.layers[this.currentLayerIndex].canvasNode.addEventListener("mousemove", drawCirclePrev);
        }

        //Drawing rect in main canvas and removing drawing preview of the rect
        //on the auxilary canvas
        const handleMouseUp = (event) => {
            this.#auxilaryCanvasCTX.clearRect(0, 0, this.canvasResolution.x, this.canvasResolution.y);

            const currentPosition = this.#extractPosition(event);
            const radius = Math.floor(Math.sqrt(Math.pow(currentPosition.x - lastPosition.x, 2) + Math.pow(currentPosition.y - lastPosition.y, 2)));

            this.layers[this.currentLayerIndex].canvasCTX.beginPath();
            this.layers[this.currentLayerIndex].canvasCTX.arc(lastPosition.x, lastPosition.y, radius, 0, 2 * Math.PI);
            this.layers[this.currentLayerIndex].canvasCTX.stroke();

            this.layers[this.currentLayerIndex].canvasNode.removeEventListener("mousemove", drawCirclePrev);
        }

        this.layers[this.currentLayerIndex].addModeEvent(
            this.layers[this.currentLayerIndex].canvasNode,
            "mousedown",
            handleMouseDown
        );

        this.layers[this.currentLayerIndex].addModeEvent(
            this.layers[this.currentLayerIndex].canvasNode,
            "mouseup",
            handleMouseUp
        );
    }

    addImage(image){
        this.layers[this.currentLayerIndex].canvasCTX.drawImage(image, 0, 0);
    }

    //
    #createSelection(position, size){
        //---Translating points to the top-left origin---
        var startPoint = position;

        var endPoint = {
            x: position.x + size.x,
            y: position.y + size.y
        }

        if(startPoint.x > endPoint.x){
            [startPoint.x, endPoint.x] = [endPoint.x, startPoint.x];
            size.x *= -1;
        }
        if(startPoint.y > endPoint.y){
            [startPoint.y, endPoint.y] = [endPoint.y, startPoint.y];
            size.y *= -1;
        }
        //------

        //TODO work on single layer
        const selectionCanvas = this.getMergedLayers(startPoint, size);

        selectionCanvas.style = `
            position: absolute;
            left: ${startPoint.x - 2}px;
            top: ${startPoint.y - 2}px;

            border: 2px dashed black;
        `;

        this.canvasWrapper.appendChild(selectionCanvas);
        this.layers[this.currentLayerIndex].canvasCTX.clearRect(startPoint.x, startPoint.y, size.x, size.y);

        var grabOffset = {x: 0, y: 0};
        const move = (event) => {
            const currentPosition = this.#extractPosition(event);

            selectionCanvas.style.left = (currentPosition.x - grabOffset.x) + "px";
            selectionCanvas.style.top = (currentPosition.y - grabOffset.y) + "px";
        }

        const handleMouseDown = (event) => {
            const rect = event.target.getBoundingClientRect();

            grabOffset = {
                x: Math.floor((event.clientX - rect.left) * this.#scaleDivisor),
                y: Math.floor((event.clientY - rect.top) * this.#scaleDivisor)
            };
            
            this.canvasWrapper.addEventListener("mousemove", move);
        }

        const handleMouseUp = () => {
            this.canvasWrapper.removeEventListener("mousemove", move);

            const currentPosition = {
                x: parseInt(selectionCanvas.style.left),
                y: parseInt(selectionCanvas.style.top)
            }
            
            this.layers[this.currentLayerIndex].canvasCTX.drawImage(
                selectionCanvas,
                currentPosition.x + 2,
                currentPosition.y + 2
            );

            selectionCanvas.remove();
            document.body.removeEventListener("mouseup", handleMouseUp);
        }

        selectionCanvas.addEventListener("mousedown", handleMouseDown);
        setTimeout(() => {
            document.body.addEventListener("mouseup", handleMouseUp);
        }, 200);
    }

    selectMode(){
        const selectWidth = 2 * this.#scaleDivisor;

        //---Proper settings---
        const prevSettings = {
            lineCap: this.#auxilaryCanvasCTX.lineCap,
            lineWidth: this.#auxilaryCanvasCTX.lineWidth,
            strokeStyle: this.#auxilaryCanvasCTX.strokeStyle
        }

        this.#auxilaryCanvasCTX.lineCap = "square";
        this.#auxilaryCanvasCTX.lineWidth = selectWidth;
        this.#auxilaryCanvasCTX.strokeStyle = "#000000"
        //------

        this.#modeCleanups.push(() => {
            this.#auxilaryCanvasCTX.lineCap = prevSettings.lineCap;
            this.#auxilaryCanvasCTX.lineWidth = prevSettings.lineWidth;
            this.#auxilaryCanvasCTX.strokeStyle = prevSettings.strokeStyle;
        });

        var initialPosition;

        //TODO move it outside and merge with drawRectMode function
        const drawInitialSelection = (event) => {
            const currentPosition = this.#extractPosition(event);
            const rectSize = {
                width: currentPosition.x - initialPosition.x,
                height: currentPosition.y - initialPosition.y
            }

            this.#auxilaryCanvasCTX.clearRect(0, 0, this.canvasResolution.x, this.canvasResolution.y);
            this.#auxilaryCanvasCTX.beginPath();
            this.#auxilaryCanvasCTX.rect(initialPosition.x, initialPosition.y, rectSize.width, rectSize.height);
            this.#auxilaryCanvasCTX.stroke();
        }

        //Storing initial position and drawing from there to current mouse position
        const handleMouseDown = (event) => {
            this.#auxilaryCanvasCTX.clearRect(0, 0, this.canvasResolution.x, this.canvasResolution.y);

            initialPosition = this.#extractPosition(event);

            this.layers[this.currentLayerIndex].canvasNode.addEventListener("mousemove", drawInitialSelection);
        }

        const handleMouseUp = (event) => {
            const currentPosition = this.#extractPosition(event);
            const size = {
                x: currentPosition.x - initialPosition.x,
                y: currentPosition.y - initialPosition.y
            }

            this.layers[this.currentLayerIndex].canvasNode.removeEventListener("mousemove", drawInitialSelection);

            if(size.x === 0) return

            this.#auxilaryCanvasCTX.clearRect(0, 0, this.canvasResolution.x, this.canvasResolution.y);

            this.#createSelection(initialPosition, size);
        }

        this.layers[this.currentLayerIndex].addModeEvent(
            this.layers[this.currentLayerIndex].canvasNode,
            "mousedown",
            handleMouseDown
        );

        this.layers[this.currentLayerIndex].addModeEvent(
            this.layers[this.currentLayerIndex].canvasNode,
            "mouseup",
            handleMouseUp
        );
    }
    
    bucketFillMode(){        
        function pixelsSimilarity(p1, p2){
            return p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2] && p1[3] === p2[3];
        }

        const fill = (event) => {
            const fillColor = this.getColorRGBA();
            const imageData = this.layers[this.currentLayerIndex].canvasCTX.getImageData(0, 0, this.canvasResolution.x, this.canvasResolution.y);
            const clickedPosition = this.#extractPosition(event);
            const clickedColor = this.#getPixel(imageData, clickedPosition.x, clickedPosition.y);

            if(pixelsSimilarity(clickedColor, fillColor)) return; 

            var positionStack = [Object.assign({}, clickedPosition)];

            while(positionStack.length){
                //Getting position from the top of pixelStack
                const initialPosition = positionStack.pop();

                const nextPosition = Object.assign({}, initialPosition);
                while(pixelsSimilarity(clickedColor, this.#getPixel(imageData, nextPosition.x, nextPosition.y))){
                    //going up if possible
                    nextPosition.y--;
                }
                nextPosition.y++;
                
                var reachLeft = false;
                var reachRight = false;
                do{
                    if(pixelsSimilarity(clickedColor, this.#getPixel(imageData, nextPosition.x - 1, nextPosition.y))){
                        if(!reachLeft){
                            reachLeft = true;
                            positionStack.push({x: nextPosition.x - 1, y: nextPosition.y});
                        }
                    }
                    else{
                        reachLeft = false;
                    }

                    if(pixelsSimilarity(clickedColor, this.#getPixel(imageData, nextPosition.x + 1, nextPosition.y))){
                        if(!reachRight){
                            reachRight = true;
                            positionStack.push({x: nextPosition.x + 1, y: nextPosition.y});
                        }
                    }
                    else{
                        reachRight = false;
                    }

                    this.#setPixel(imageData, nextPosition.x, nextPosition.y, fillColor);
                    nextPosition.y++;
                }
                while(pixelsSimilarity(clickedColor, this.#getPixel(imageData, nextPosition.x, nextPosition.y)));
            }

            this.layers[this.currentLayerIndex].canvasCTX.putImageData(imageData, 0, 0);
        }

        this.layers[this.currentLayerIndex].addModeEvent(
            this.layers[this.currentLayerIndex].canvasNode,
            "click",
            fill
        );
    }

    eyedropperMode(mergedLayers=false){
        const eyedrop = (event) => {
            const clickedPosition = this.#extractPosition(event);

            var color;
            if(mergedLayers){
                const imageData = this.getMergedLayers(clickedPosition, {x: 1, y: 1}).getContext("2d").getImageData(0, 0, 1, 1);
                color = this.#getPixel(imageData, 0, 0);
            }
            else{
                const imageData = this.layers[this.currentLayerIndex].canvasCTX.getImageData(0, 0, this.canvasResolution.x, this.canvasResolution.y);
                color = this.#getPixel(imageData, clickedPosition.x, clickedPosition.y);
            }

            this.setColor(`rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]}`);
        }

        this.layers[this.currentLayerIndex].addModeEvent(
            this.layers[this.currentLayerIndex].canvasNode,
            "click",
            eyedrop
        );
    }

    //TODO better calculating text position based on textarea
    //TODO show always scaled values?
    textMode(){
        const startAddingText = (event) => {
            const clickedPosition = this.#extractPosition(event);

            this.#textInputHolder.style.left = (clickedPosition.x / this.#scaleDivisor) + "px";
            this.#textInputHolder.style.top = (clickedPosition.y / this.#scaleDivisor) + "px";

            //Accepting entered text
            this.canvasWrapper.addEventListener("mousedown", () => {
                const metrics = this.layers[this.currentLayerIndex].canvasCTX.measureText(this.#textInputHolder.value);

                const x = clickedPosition.x;
                const y = clickedPosition.y + metrics.actualBoundingBoxAscent + 6 * this.#scaleDivisor;

                this.layers[this.currentLayerIndex].canvasCTX.fillText(this.#textInputHolder.value, x, y);
                this.#textInputHolder.value = "";

                this.canvasWrapper.removeChild(this.#textInputHolder);

                //Starts listening for next clicks after delay
                setTimeout(() => {
                    this.layers[this.currentLayerIndex].addModeEvent(
                        this.layers[this.currentLayerIndex].canvasNode,
                        "click",
                        startAddingText,
                        {once: true}
                    );
                }, 250);

            }, {once: true});
            
            this.canvasWrapper.appendChild(this.#textInputHolder);
            
            this.#textInputHolder.focus();
        }

        this.layers[this.currentLayerIndex].addModeEvent(
            this.layers[this.currentLayerIndex].canvasNode,
            "click",
            startAddingText,
            {once: true}
        );
    }

    //Remove mode effects
    clearMode(){
        for(let cleanup of this.#modeCleanups){
            cleanup();
        }
        this.#modeCleanups = [];

        this.layers[this.currentLayerIndex].clearEvents();
    }
    //---
}

export default Canvas;