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
    
    //For storing references to events function so they can be delete later
    #eventFunctions = {
        mousedown: null,
        mouseup: null,
        click: null
    };
    
    canvasWrapper;

    //Index of currently selected layer
    currentLayerIndex;
    
    canvasDimensions = {x: 0, y: 0};
    canvasResolution = {x: 0, y: 0};
    
    layers = [];

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

    addLayer(){
        const layer = new Layer(this.canvasResolution.x, this.canvasResolution.y);
        this.layers.push(layer);
        this.canvasWrapper.appendChild(layer.canvasNode);
    }

    #moveSettings(prevLayer, newLayer){
        newLayer.canvasCTX.lineWidth = prevLayer.canvasCTX.lineWidth;
        newLayer.canvasCTX.strokeStyle = prevLayer.canvasCTX.strokeStyle;
        newLayer.canvasCTX.lineCap = prevLayer.canvasCTX.lineCap;
        newLayer.canvasCTX.globalCompositeOperation = prevLayer.canvasCTX.globalCompositeOperation;
        
        newLayer.canvasCTX.font = prevLayer.canvasCTX.font;
        newLayer.canvasCTX.fillColor = prevLayer.canvasCTX.fillColor;
    }

    //TODO make object for storing settings
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

    hideLayer(layerIndex){
        this.layers[layerIndex].canvasNode.style.opacity = 0;
    }

    showLayer(layerIndex){
        this.layers[layerIndex].canvasNode.style.opacity = 1;
    }

    //TODO better text color updating
    setColor(color){
        this.layers[this.currentLayerIndex].canvasCTX.strokeStyle = color;
        this.#auxilaryCanvasCTX.strokeStyle = color;

        //For text
        this.layers[this.currentLayerIndex].canvasCTX.fillStyle = color;
        this.#textInputHolder.style.color = color;
    }

    getColor(){
        return this.layers[this.currentLayerIndex].canvasCTX.strokeStyle;
    }

    setFontSize(size){
        var scaledSize = Math.round(size * this.#scaleDivisor);
        
        const currentCTX = this.layers[this.currentLayerIndex].canvasCTX;
        currentCTX.font = currentCTX.font.replace(/\d+px/, `${scaledSize}px`);

        this.#textInputHolder.style.fontSize = size + "px";
    }

    //read from input holder?
    getFontSize(scaled=false){
        const currentFont = this.layers[this.currentLayerIndex].canvasCTX.font;
        const pxIndex = currentFont.indexOf("px");

        const size = parseInt(currentFont.substr(pxIndex - 2, pxIndex));

        if(!scaled) return Math.round(size / this.#scaleDivisor);
        return size;
    }

    setFontFamily(fontFamily){
        //Setting CTX
        const currentCTX = this.layers[this.currentLayerIndex].canvasCTX;
        currentCTX.font = currentCTX.font.replace(currentCTX.font.substr(currentCTX.font.indexOf("px") + 3), fontFamily);

        //Setting holder style
        this.#textInputHolder.style.fontFamily = fontFamily;

    }

    getFontFamily(){
        const currentFont = this.layers[this.currentLayerIndex].canvasCTX.font;

        return currentFont.substring(currentFont.indexOf("px") + 3);
    }

    setFillColor(color){
        this.layers[this.currentLayerIndex].canvasCTX.fillStyle = color;
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

    setDrawWidth(size){
        if(size > 0){
            this.layers[this.currentLayerIndex].canvasCTX.lineWidth = size;
            this.#auxilaryCanvasCTX.lineWidth = size;
        }
    }

    getDrawWidth(){
        return this.layers[this.currentLayerIndex].canvasCTX.lineWidth;
    }

    setDrawOperation(operation){
        this.layers[this.currentLayerIndex].canvasCTX.globalCompositeOperation = operation;
    }

    addImage(image){
        this.layers[this.currentLayerIndex].canvasCTX.drawImage(image, 0, 0);
    }

    drawMode(mode){
        var lastPosition;
        
        this.layers[this.currentLayerIndex].canvasCTX.lineCap = "round";

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

    drawLineMode(){
        var lastPosition;

        this.#auxilaryCanvasCTX.lineCap = "square";

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

            //this.layers[this.currentLayerIndex].canvasNode.addEventListener("mousemove", drawLinePrev);
            this.layers[this.currentLayerIndex].addEvent(

            )
        }

        //Drawing line in main canvas and removing drawing preview of the line
        //on the auxilary canvas
        const handleMouseUp = (event) => {
            this.#auxilaryCanvasCTX.clearRect(0, 0, this.canvasResolution.x, this.canvasResolution.y);

            this.layers[this.currentLayerIndex].canvasCTX.lineCap = "square";

            const currentPosition = this.#extractPosition(event);

            this.layers[this.currentLayerIndex].canvasCTX.beginPath();
            this.layers[this.currentLayerIndex].canvasCTX.moveTo(lastPosition.x, lastPosition.y);
            this.layers[this.currentLayerIndex].canvasCTX.lineTo(currentPosition.x, currentPosition.y);
            this.layers[this.currentLayerIndex].canvasCTX.stroke();

            this.layers[this.currentLayerIndex].removeEvent(
                this.layers[this.currentLayerIndex].canvasNode,
                "mousemove",
                drawLinePrev
            )
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
        var lastPosition;
        this.layers[this.currentLayerIndex].canvasCTX.lineCap = "square";

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
        var lastPosition;
        this.layers[this.currentLayerIndex].canvasCTX.lineCap = "round";

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
                const imageData = this.getMergedPixel(clickedPosition.x, clickedPosition.y).getContext("2d").getImageData(0, 0, 1, 1);
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
                    this.layers[this.currentLayerIndex].canvasNode.addEventListener("click", startAddingText, {once: true});
                    this.#eventFunctions.click = startAddingText;
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

    //Remove mode events
    clearMode(){
        this.layers[this.currentLayerIndex].clearEvents();
    }

    //Returns canvas combined from all layers
    getMergedLayers(){
        const resultCanvas = document.createElement("canvas");
        resultCanvas.width = this.canvasResolution.x;
        resultCanvas.height = this.canvasResolution.y;

        const resultCanvasCTX = resultCanvas.getContext("2d");

        for(let layer of this.layers){
            resultCanvasCTX.drawImage(layer.canvasNode, 0, 0);
        }

        return resultCanvas;
    }

    //Returns canvas containing one pixel
    getMergedPixel(x, y){
        const resultCanvas = document.createElement("canvas");
        resultCanvas.width = 1;
        resultCanvas.height = 1;
        
        const resultCanvasCTX = resultCanvas.getContext("2d");

        for(let layer of this.layers){
            resultCanvasCTX.drawImage(layer.canvasNode, x, y, 1, 1, 0, 0, 1, 1);
        }

        return resultCanvas;
    }
}

export default Canvas;