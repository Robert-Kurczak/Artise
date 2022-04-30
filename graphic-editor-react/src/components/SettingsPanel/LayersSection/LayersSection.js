import "../../../styles/LayersSection.css"
import LayerNode from "./LayerNode/LayerNode";

import { GlobalContext } from "../../App";
import { useContext, useState } from "react";

function LayersSection(){
    const { mainCanvas } = useContext(GlobalContext);
    const layers = mainCanvas.layers;

    const [activeLayer, setActiveLayer] = useState(mainCanvas.currentLayer.id);

    const nodes = layers.map((layerObj, index) =>
        <LayerNode
            key={index}
            layerID={layerObj.id}
            active={layerObj.id === activeLayer}
            setActiveLayer={setActiveLayer}
        />
    );

    return(
        <div className="layer_section">
            {nodes}
        </div>
    );
}

export default LayersSection;