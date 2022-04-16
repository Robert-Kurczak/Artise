import { useEffect } from "react";
import { fabric } from "fabric";

function FabricCanvas(props){
    const canvasID = "fabric_canvas";

    useEffect(() => {
        props.setCanvas(new fabric.Canvas(canvasID, {
                width: props.width, 
                height: props.height,
                isDrawingMode: true
            }));
    }, []);

    return(
        <canvas id={canvasID}></canvas>
    );
}

export default FabricCanvas;