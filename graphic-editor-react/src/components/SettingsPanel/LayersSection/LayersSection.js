import "../../../styles/LayersSection.css"

import LayerNode from "./LayerNode/LayerNode";
import AddLayerBtn from "./AddLayerBtn";

import { GlobalContext } from "../../App";
import { useContext, useState } from "react";

function LayersSection(){
    const { mainCanvas } = useContext(GlobalContext);

    const [activeLayer, setActiveLayer] = useState(mainCanvas.currentLayerIndex);
    const [layersAmount, setLayersAmount] = useState(mainCanvas.layers.length);

    const updateLayersAmount = () => {setLayersAmount(mainCanvas.layers.length)}
    const updateActiveLayer = () => {setActiveLayer(mainCanvas.currentLayerIndex)}

    const nodes = [];

    for(let index = 0; index < layersAmount; index++){
        nodes.push(
            <LayerNode
                key={index}

                active={index === activeLayer}

                layerIndex={index}

                updateActiveLayer={updateActiveLayer}
                
                hideLayer={() => {mainCanvas.hideLayer(index)}}
                showLayer={() => {mainCanvas.showLayer(index)}}
                
                changeLayer={() => {mainCanvas.changeLayer(index)}}

                updateLayersAmount={updateLayersAmount}
                removeLayer={() => {mainCanvas.removeLayer(index)}}
            />
        )
    }

    return(
        <div className="layer_section">
            <div className="layers_nodes">
                {nodes.reverse()}
            </div>

            <AddLayerBtn
                updateLayersAmount={updateLayersAmount}
                addLayer={() => {mainCanvas.addLayer()}}
            />
        </div>
    );
}

export default LayersSection;