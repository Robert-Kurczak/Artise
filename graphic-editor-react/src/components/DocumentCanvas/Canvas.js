class Canvas{
    #canvasWrapper;
    #canvasBoundingRect;
    #canvasCTX;

    canvas;

    brushSize = 5;

    constructor(wrapperID, width, height){
        this.width = width;
        this.height = height;

        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;

        this.#canvasCTX = this.canvas.getContext("2d");

        this.#canvasWrapper = document.getElementById(wrapperID);
        this.#canvasWrapper.appendChild(this.canvas);

        this.#canvasBoundingRect = this.canvas.getBoundingClientRect();

        //Some initial conditions
        this.setColorHex("FF0044");
        this.setBrushSize(5);

        this.setDrawMode("brush");
    }

    setColorHex(color){
        this.#canvasCTX.strokeStyle = "#" + color;
    }

    setBrushSize(size){
        if(size > 0){
            this.#canvasCTX.lineWidth = size;
        }
    }

    #lastPosition;
    setDrawMode(mode){
        const savePosition = (event) => {
            this.#lastPosition = {
                x: event.clientX - this.#canvasBoundingRect.left,
                y: event.clientY - this.#canvasBoundingRect.top
            }
        }

        const brushDraw = (event) => {
            this.#canvasCTX.beginPath();
            this.#canvasCTX.lineCap = "round";
            this.#canvasCTX.moveTo(this.#lastPosition.x, this.#lastPosition.y);
    
            savePosition(event);
    
            this.#canvasCTX.lineTo(this.#lastPosition.x, this.#lastPosition.y);
            this.#canvasCTX.stroke();
        }

        var drawingMethod;
        if(mode === "brush"){
            drawingMethod = brushDraw;
        }
        else if(mode === "pencil"){
            //
        }

        //Handle click on canvas
        this.canvas.addEventListener("mousedown", (event) => {
            this.canvas.addEventListener("mousemove", drawingMethod);

            savePosition(event);
        });

        this.canvas.addEventListener("mouseup", () => {
            this.canvas.removeEventListener("mousemove", drawingMethod);
        });
    }
}

export default Canvas;