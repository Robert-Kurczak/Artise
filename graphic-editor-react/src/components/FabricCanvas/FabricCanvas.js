import "../../styles/FabricCanvas.css"

import { useEffect } from "react";
import { fabric } from "fabric";

function FabricCanvas(props){
    const canvasID = "fabric_canvas";
    const { mainCanvas, setCanvas, canvasResolution, canvasImage } = props;

    useEffect(() => {
        var canvas = new fabric.Canvas(canvasID, {
            width: canvasResolution.x,
            height: canvasResolution.y
        });

        if(canvasImage){
            canvas.setWidth(canvasImage.width);
            canvas.setHeight(canvasImage.height);

            canvas.add(canvasImage).setActiveObject(canvasImage).renderAll();
        }

        setCanvas(canvas);

    }, [setCanvas, canvasResolution, canvasImage]);

    return(
        <span id="canvas_holder">
            <canvas width={canvasResolution.x} id={canvasID}></canvas>
        </span>
    );
}

export default FabricCanvas;