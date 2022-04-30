import { useRef, useState } from "react";
import "../../../../styles/LayerColor.css"

//Max value - 240
//Min value - 100
function randColorValue(){
    return Math.floor(Math.random() * 140) + 100;
}

function LayerColor(props){
    const { hideLayer, showLayer } = props;

    const [opacity, setOpacity] = useState(1);
    const randRGB = useRef(`rgb(${randColorValue()}, ${randColorValue()}, ${randColorValue()})`);

    function toggleLayer(event){
        event.stopPropagation();

        if(opacity === 1){
            setOpacity(0.2);
            hideLayer();
        }
        else{
            setOpacity(1);
            showLayer();
        }
    }

    return(
        <div
            onClick={(event) => toggleLayer(event)}
            className="layer_color"
            style={{backgroundColor: randRGB.current, opacity: opacity}}
        />
    );
}

export default LayerColor;