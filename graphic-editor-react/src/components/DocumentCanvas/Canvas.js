class Canvas{
    #LAYER_NUM_OFFSET = 100;
    #MAX_LAYER = 9999;

    #canvasWrapper;
    #canvasBoundingRect;

    //Auxilary canvas is used for displaying information for user,
    //such as selected area, preview of drawn shapes etc.
    //It's not considered layer and therefore not construced as one.
    #auxilaryCanvas;
    #auxilaryCanvasCTX;

    //For storing references to events function so they can be delete later
    #eventFunctions = {
        mousedown: null,
        mouseup: null
    }

    currentLayer;

    width;
    height;
    layers = [];

    addLayer(){
        const layer = document.createElement("canvas");
        layer.width = this.width;
        layer.height = this.height;
        layer.style = `position: absolute; z-index: ${this.layers.length + 10}`;
        layer.setAttribute("id", "layer" + this.layers.length);

        //Important structure for whole class
        //I guess it should be declared in some better way
        const layerObj = {
            id: this.layers.length,
            canvasNode: layer,
            canvasCTX: layer.getContext("2d")
        };

        this.layers.push(layerObj);
        this.#canvasWrapper.appendChild(layer);

        // this.currentLayer = layerObj;
    }

    changeLayer(layerID){
        // if(layerID >= this.layers.length) return;

        const prevLayerID = this.currentLayer.id;
        
        //---Cleaning previous layer---
        this.currentLayer.canvasNode.style.zIndex = this.currentLayer.id + this.#LAYER_NUM_OFFSET;  //Moving layer to the back
        this.clearMode();   //Removing events from layer
        //------

        //Sellecting new layer
        this.currentLayer = this.layers[layerID];
        this.currentLayer.canvasNode.style.zIndex = this.#MAX_LAYER;    //Moving layer to the front

        //---Attaching current mode events to the new layer---
        //TODO - Redundant code
        this.currentLayer.canvasNode.addEventListener("mouseup", this.#eventFunctions.mouseup);
        this.currentLayer.canvasNode.addEventListener("mousedown", this.#eventFunctions.mousedown);
        //------

        //---Moving settings from previous layer to current---
        this.currentLayer.canvasCTX.lineWidth = this.layers[prevLayerID].canvasCTX.lineWidth;
        this.currentLayer.canvasCTX.strokeStyle = this.layers[prevLayerID].canvasCTX.strokeStyle;
        //------
    }

    removeLayer(layerID){
        this.layers.splice(layerID, 1);
    }

    hideLayer(layerID){
        this.layers[layerID].canvasNode.style.display = "none";
    }

    showLayer(layerID){
        this.layers[layerID].canvasNode.style.display = "block";
    }

    constructor(wrapperID, width, height){
        this.width = width;
        this.height = height;

        //---Setting wrapper---
        this.#canvasWrapper = document.getElementById(wrapperID);
        this.#canvasWrapper.innerHTML = "";
        this.#canvasWrapper.style = `width: ${width}px; height: ${height}px`;
        //------

        //---Creating main layer---
        this.addLayer();

        //changeLayers bases on currentLayer property.
        //At the time of constructing currentLayer is not set
        //Instead of writing code in changeLayers for this specific case
        //I initialize layer here
        this.currentLayer = this.layers[0];
        this.currentLayer.canvasNode.style.zIndex = this.#MAX_LAYER;
        //------

        //---Creating auxilary canvas---
        this.#auxilaryCanvas = this.currentLayer.canvasNode.cloneNode();
        this.#auxilaryCanvas.style = `position: absolute; z-index: ${this.#MAX_LAYER + 1}; pointer-events: none;`;
        this.#auxilaryCanvas.setAttribute("id", "auxilary-canvas");
        this.#auxilaryCanvasCTX = this.#auxilaryCanvas.getContext("2d");

        this.#canvasWrapper.appendChild(this.#auxilaryCanvas);
        //------
        
        this.#canvasBoundingRect = this.#canvasWrapper.getBoundingClientRect();

        //When the window resizes, previous bounding rect is invalid.
        //It have to be recalculated again
        window.addEventListener("resize", () => {
            this.#canvasBoundingRect = this.#canvasWrapper.getBoundingClientRect();
        });

        //---Some initial conditions---
        this.setBrushSize(5);

        this.addLayer();
        this.addLayer();
        // this.changeLayer(1);
        // this.changeLayer(0);
        //------
    }

    //Extract clicked, relative to canvas, position from event
    #extractPosition(event){
        const currentPosition = {
            x: event.clientX - this.#canvasBoundingRect.left,
            y: event.clientY - this.#canvasBoundingRect.top
        };

        return currentPosition;
    }

    setColor(color){
        this.currentLayer.canvasCTX.strokeStyle = color;
        this.#auxilaryCanvasCTX.strokeStyle = color;
    }

    setBrushSize(size){
        if(size > 0){
            this.currentLayer.canvasCTX.lineWidth = size;
            this.#auxilaryCanvasCTX.lineWidth = size;
        }
    }

    getBrushSize(){
        return this.currentLayer.canvasCTX.lineWidth
    }

    setDrawMode(mode){
        var lastPosition;

        this.currentLayer.canvasCTX.lineCap = "round";
        const brushDraw = (event) => {
            const layerCTX = this.currentLayer.canvasCTX;

            layerCTX.beginPath();
            layerCTX.moveTo(lastPosition.x, lastPosition.y);
    
            lastPosition = this.#extractPosition(event);
    
            layerCTX.lineTo(lastPosition.x, lastPosition.y);
            layerCTX.stroke();
        }

        var drawingMethod;
        if(mode === "brush") drawingMethod = brushDraw;
        // else if(mode === "pencil");

        const handleMouseDown = (event) => {
            lastPosition = this.#extractPosition(event);

            this.currentLayer.canvasNode.addEventListener("mousemove", drawingMethod);
        }

        const handleMouseUp = () => {
            this.currentLayer.canvasNode.removeEventListener("mousemove", drawingMethod);
        }

        this.currentLayer.canvasNode.addEventListener("mousedown", handleMouseDown);
        this.currentLayer.canvasNode.addEventListener("mouseup", handleMouseUp);

        //Maybe move to it layer object?
        this.#eventFunctions.mousedown = handleMouseDown;
        this.#eventFunctions.mouseup = handleMouseUp;
    }

    drawLineMode(){
        var lastPosition;
        this.currentLayer.canvasCTX.lineCap = "square";

        //Drawing line from stored position to mouse position on
        //auxilary canvas
        const drawLinePrev = (event) => {
            const currentPosition = this.#extractPosition(event);

            this.#auxilaryCanvasCTX.clearRect(0, 0, this.width, this.height);
            this.#auxilaryCanvasCTX.beginPath();
            this.#auxilaryCanvasCTX.moveTo(lastPosition.x, lastPosition.y);
            this.#auxilaryCanvasCTX.lineTo(currentPosition.x, currentPosition.y);
            this.#auxilaryCanvasCTX.stroke();
        }

        //Storing initial position and drawing from there to current mouse position
        const handleMouseDown = (event) => {
            lastPosition = this.#extractPosition(event);

            this.currentLayer.canvasNode.addEventListener("mousemove", drawLinePrev);
        }

        //Drawing line in main canvas and removing drawing preview of the line
        //on the auxilary canvas
        const handleMouseUp = (event) => {
            this.#auxilaryCanvasCTX.clearRect(0, 0, this.width, this.height);

            const currentPosition = this.#extractPosition(event);

            this.currentLayer.canvasCTX.beginPath();
            this.currentLayer.canvasCTX.moveTo(lastPosition.x, lastPosition.y);
            this.currentLayer.canvasCTX.lineTo(currentPosition.x, currentPosition.y);
            this.currentLayer.canvasCTX.stroke();

            this.currentLayer.canvasNode.removeEventListener("mousemove", drawLinePrev);
        }
        
        this.currentLayer.canvasNode.addEventListener("mousedown", handleMouseDown);
        this.currentLayer.canvasNode.addEventListener("mouseup", handleMouseUp);

        this.#eventFunctions.mousedown = handleMouseDown;
        this.#eventFunctions.mouseup = handleMouseUp;
    }

    drawRectMode(){
        var lastPosition;
        this.currentLayer.canvasCTX.lineCap = "square";

        //Drawing rect from stored position to mouse position on
        //auxilary canvas
        const drawRectPrev = (event) => {
            const currentPosition = this.#extractPosition(event);
            const rectSize = {
                width: currentPosition.x - lastPosition.x,
                height: currentPosition.y - lastPosition.y
            }

            this.#auxilaryCanvasCTX.clearRect(0, 0, this.width, this.height);
            this.#auxilaryCanvasCTX.beginPath();
            this.#auxilaryCanvasCTX.rect(lastPosition.x, lastPosition.y, rectSize.width, rectSize.height);
            this.#auxilaryCanvasCTX.stroke();
        }

        //Storing initial position and drawing from there to current mouse position
        const handleMouseDown = (event) => {
            lastPosition = this.#extractPosition(event);

            this.currentLayer.canvasNode.addEventListener("mousemove", drawRectPrev);
        }

        //Drawing rect in main canvas and removing drawing preview of the rect
        //on the auxilary canvas
        const handleMouseUp = (event) => {
            this.#auxilaryCanvasCTX.clearRect(0, 0, this.width, this.height);

            const currentPosition = this.#extractPosition(event);
            const rectSize = {
                width: currentPosition.x - lastPosition.x,
                height: currentPosition.y - lastPosition.y
            }

            this.currentLayer.canvasCTX.beginPath();
            this.currentLayer.canvasCTX.rect(lastPosition.x, lastPosition.y, rectSize.width, rectSize.height);
            this.currentLayer.canvasCTX.stroke();

            this.currentLayer.canvasNode.removeEventListener("mousemove", drawRectPrev);
        }
        
        this.currentLayer.canvasNode.addEventListener("mousedown", handleMouseDown);
        this.currentLayer.canvasNode.addEventListener("mouseup", handleMouseUp);

        this.#eventFunctions.mousedown = handleMouseDown;
        this.#eventFunctions.mouseup = handleMouseUp;
    }

    //Removing events from canvas
    clearMode(){
        this.currentLayer.canvasNode.removeEventListener("mousedown", this.#eventFunctions.mousedown);
        this.currentLayer.canvasNode.removeEventListener("mouseup", this.#eventFunctions.mouseup);
    }
}

export default Canvas;