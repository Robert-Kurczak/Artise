import "../../styles/FabricCanvas.css"

import { useEffect } from "react";
import { fabric } from "fabric";

function FabricCanvas(props){
    const canvasID = "fabric_canvas";
    const { setCanvas, canvasResolution } = props;

    useEffect(() => {
        setCanvas(new fabric.Canvas(canvasID, {
                width: canvasResolution.x, 
                height: canvasResolution.y,
                isDrawingMode: true
            }));
    }, [setCanvas, canvasResolution]);

    return(
        <canvas id={canvasID}></canvas>
    );
}

export default FabricCanvas;