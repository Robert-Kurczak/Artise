import "../../../../styles/LayerNode.css"

import LayerColor from "./LayerColor";
import LayerRemove from "./LayerRemove";

import { GlobalContext } from "../../../App";
import { useContext } from "react";

function LayerNode(props){
    const { layerID, active, setActiveLayer} = props;
    const { mainCanvas } = useContext(GlobalContext);

    function changeLayer(ID){
        if(active) return;
        
        mainCanvas.changeLayer(ID);
        setActiveLayer(ID);
    }

    function showLayer(ID){mainCanvas.showLayer(ID)}

    function hideLayer(ID){mainCanvas.hideLayer(ID)}

    const style = active? {backgroundColor: "#141414"} : null;

    return(
        <div className="layer_node" onClick={() => {changeLayer(layerID)}} style={style}>
            <LayerColor
                showLayer={() => {showLayer(layerID)}}
                hideLayer={() => {hideLayer(layerID)}}
            />

            <p>Layer {layerID}</p>
            <LayerRemove/>
        </div>
    );
}

export default LayerNode;