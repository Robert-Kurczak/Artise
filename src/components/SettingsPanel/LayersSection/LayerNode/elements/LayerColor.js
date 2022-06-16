import "../../../../../styles/LayerColor.css"

import { useRef } from "react";

//Max value - 240
//Min value - 100
function randColorValue(){
    return Math.floor(Math.random() * 140) + 100;
}

function LayerColor(props){
    const { hidden, hideLayer, showLayer, rerenderNodes } = props;

    const randRGB = useRef(`rgb(${randColorValue()}, ${randColorValue()}, ${randColorValue()})`);

    function toggleLayer(event){
        event.stopPropagation();

        if(!hidden){
            hideLayer();
            
        }
        else{
            showLayer();
        }

        rerenderNodes();
    }

    return(
        <div
            onClick={(event) => toggleLayer(event)}
            className="layer_color"
            style={{backgroundColor: randRGB.current, opacity: hidden ? 0.2 : 1}}
        />
    );
}

export default LayerColor;