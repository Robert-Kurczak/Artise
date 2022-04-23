import "../../styles/DocumentCanvas.css"

import { useEffect } from "react";
import Canvas from "./Canvas";

function DocumentCanvas(props){
    const wrapperID = "canvas_wrapper"
    const { mainCanvas, setCanvas, canvasResolution, canvasImage } = props;

    useEffect(() => {
        var canvas = new Canvas(wrapperID, canvasResolution.x, canvasResolution.y);

        setCanvas(canvas);
    }, [setCanvas, canvasResolution]);


    return(
        <div id={wrapperID}>
            
        </div>
    );
}

export default DocumentCanvas;