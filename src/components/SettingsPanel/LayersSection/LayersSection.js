import "../../../styles/LayersSection.css"

import LayerNode from "./LayerNode/LayerNode";
import AddLayerBtn from "./AddLayerBtn";

import { GlobalContext } from "../../App";
import { useContext, useState } from "react";

function LayersSection(){
    const { mainCanvas } = useContext(GlobalContext);
    const [rerender, setRerender] = useState(false);

    //When adding and removing nodes, array in mainCanvas changes.
    //I force rerender to synchronize this layer nodes with canvas array
    const rerenderNodes = () => {setRerender(!rerender)}

    const nodes = [];

    for(let index = 0; index < mainCanvas.layers.length; index++){
        nodes.push(
            <LayerNode
                key={index}
                
                layerIndex={index}
                layerName={mainCanvas.layers[index].name}

                active={index === mainCanvas.currentLayerIndex}
                hidden={mainCanvas.layers[index].hidden}
                
                hideLayer={() => {mainCanvas.hideLayer(index)}}
                showLayer={() => {mainCanvas.showLayer(index)}}
                
                changeLayer={() => {mainCanvas.changeLayer(index)}}

                removeLayer={() => {mainCanvas.removeLayer(index)}}
                moveLayer={(direction) => {mainCanvas.moveLayer(index, direction)}}

                rerenderNodes={rerenderNodes}
            />
        )
    }

    return(
        <div className="layer_section">
            <div className="layers_nodes">
                {nodes.reverse()}
            </div>

            <AddLayerBtn
                rerenderNodes={rerenderNodes}
                addLayer={() => {mainCanvas.addLayer()}}
            />
        </div>
    );
}

export default LayersSection;