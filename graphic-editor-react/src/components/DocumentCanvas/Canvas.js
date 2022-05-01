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

    //Index of currently selected layer
    currentLayerIndex;

    width;
    height;
    layers = [];

    addLayer(){
        const layer = document.createElement("canvas");
        layer.width = this.width;
        layer.height = this.height;
        layer.style = "position: absolute; pointer-events: none;";
        // layer.setAttribute("id", "layer" + this.layers.length);

        //Important structure for whole class
        //I guess it should be declared in some better way
        const layerObj = {
            canvasNode: layer,
            canvasCTX: layer.getContext("2d")
        };

        this.layers.push(layerObj);
        this.#canvasWrapper.appendChild(layer);
    }

    changeLayer(layerIndex){
        const prevLayerID = this.currentLayerIndex;

        //---Cleaning previous layer---
        this.layers[prevLayerID].canvasNode.style.pointerEvents = "none";  //Moving layer to the back
        this.clearMode();   //Removing events from layer
        //------

        //Sellecting new layer
        this.currentLayerIndex = layerIndex;
        const currentLayer = this.layers[this.currentLayerIndex];

        currentLayer.canvasNode.style.pointerEvents = "auto";

        // currentLayer.canvasNode.style.zIndex = this.#MAX_LAYER;    //Moving layer to the front

        //---Attaching current mode events to the new layer---
        //TODO - Redundant code
        currentLayer.canvasNode.addEventListener("mouseup", this.#eventFunctions.mouseup);
        currentLayer.canvasNode.addEventListener("mousedown", this.#eventFunctions.mousedown);
        //------

        //---Moving settings from previous layer to current---
        currentLayer.canvasCTX.lineWidth = this.layers[prevLayerID].canvasCTX.lineWidth;
        currentLayer.canvasCTX.strokeStyle = this.layers[prevLayerID].canvasCTX.strokeStyle;
        //------
    }

    removeLayer(layerIndex){
        this.layers[layerIndex].canvasNode.remove();

        if(layerIndex === this.currentLayerIndex){
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

    constructor(wrapperID, width, height){
        this.width = width;
        this.height = height;

        //---Setting wrapper---
        this.#canvasWrapper = document.getElementById(wrapperID);
        this.#canvasWrapper.innerHTML = "";
        this.#canvasWrapper.style = `width: ${width}px; height: ${height}px`;
        //------

        //---Creating auxilary canvas---
        this.#auxilaryCanvas = document.createElement("canvas");
        this.#auxilaryCanvas.width = this.width;
        this.#auxilaryCanvas.height = this.height;
        this.#auxilaryCanvas.style = "position: absolute; pointer-events: none;";
        this.#auxilaryCanvas.setAttribute("id", "auxilary-canvas");
        this.#auxilaryCanvasCTX = this.#auxilaryCanvas.getContext("2d");

        this.#canvasWrapper.appendChild(this.#auxilaryCanvas);
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
        this.layers[this.currentLayerIndex].canvasCTX.strokeStyle = color;
        this.#auxilaryCanvasCTX.strokeStyle = color;
    }

    setBrushSize(size){
        if(size > 0){
            this.layers[this.currentLayerIndex].canvasCTX.lineWidth = size;
            this.#auxilaryCanvasCTX.lineWidth = size;
        }
    }

    getBrushSize(){
        return this.layers[this.currentLayerIndex].canvasCTX.lineWidth
    }

    setDrawMode(mode){
        var lastPosition;
        this.layers[this.currentLayerIndex].canvasCTX.lineCap = "round";

        const brushDraw = (event) => {
            const layerCTX = this.layers[this.currentLayerIndex].canvasCTX;

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

            this.layers[this.currentLayerIndex].canvasNode.addEventListener("mousemove", drawingMethod);
        }

        const handleMouseUp = () => {
            this.layers[this.currentLayerIndex].canvasNode.removeEventListener("mousemove", drawingMethod);
        }

        this.layers[this.currentLayerIndex].canvasNode.addEventListener("mousedown", handleMouseDown);
        this.layers[this.currentLayerIndex].canvasNode.addEventListener("mouseup", handleMouseUp);

        //Maybe move to it layer object?
        this.#eventFunctions.mousedown = handleMouseDown;
        this.#eventFunctions.mouseup = handleMouseUp;
    }

    drawLineMode(){
        var lastPosition;

        this.layers[this.currentLayerIndex].canvasCTX.lineCap = "square";
        this.#auxilaryCanvasCTX.lineCap = "square";

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

            this.layers[this.currentLayerIndex].canvasNode.addEventListener("mousemove", drawLinePrev);
        }

        //Drawing line in main canvas and removing drawing preview of the line
        //on the auxilary canvas
        const handleMouseUp = (event) => {
            this.#auxilaryCanvasCTX.clearRect(0, 0, this.width, this.height);

            const currentPosition = this.#extractPosition(event);

            this.layers[this.currentLayerIndex].canvasCTX.beginPath();
            this.layers[this.currentLayerIndex].canvasCTX.moveTo(lastPosition.x, lastPosition.y);
            this.layers[this.currentLayerIndex].canvasCTX.lineTo(currentPosition.x, currentPosition.y);
            this.layers[this.currentLayerIndex].canvasCTX.stroke();

            this.layers[this.currentLayerIndex].canvasNode.removeEventListener("mousemove", drawLinePrev);
        }
        
        this.layers[this.currentLayerIndex].canvasNode.addEventListener("mousedown", handleMouseDown);
        this.layers[this.currentLayerIndex].canvasNode.addEventListener("mouseup", handleMouseUp);

        this.#eventFunctions.mousedown = handleMouseDown;
        this.#eventFunctions.mouseup = handleMouseUp;
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

            this.#auxilaryCanvasCTX.clearRect(0, 0, this.width, this.height);
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
            this.#auxilaryCanvasCTX.clearRect(0, 0, this.width, this.height);

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
        
        this.layers[this.currentLayerIndex].canvasNode.addEventListener("mousedown", handleMouseDown);
        this.layers[this.currentLayerIndex].canvasNode.addEventListener("mouseup", handleMouseUp);

        this.#eventFunctions.mousedown = handleMouseDown;
        this.#eventFunctions.mouseup = handleMouseUp;
    }

    //Removing events from canvas
    clearMode(){
        this.layers[this.currentLayerIndex].canvasNode.removeEventListener("mousedown", this.#eventFunctions.mousedown);
        this.layers[this.currentLayerIndex].canvasNode.removeEventListener("mouseup", this.#eventFunctions.mouseup);
    }
}

export default Canvas;