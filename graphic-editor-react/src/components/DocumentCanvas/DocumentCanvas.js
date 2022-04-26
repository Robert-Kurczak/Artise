import "../../styles/DocumentCanvas.css"

import { useEffect } from "react";
import Canvas from "./Canvas";

function DocumentCanvas(props){
    const wrapperID = "canvas_wrapper"
    const { setMainCanvas, canvasResolution } = props;

    useEffect(() => {
        const canvas = new Canvas(wrapperID, canvasResolution.x, canvasResolution.y);

        setMainCanvas(canvas);
    }, [setMainCanvas, canvasResolution]);


    return(
        <div id={wrapperID}>
            
        </div>
    );
}

export default DocumentCanvas;