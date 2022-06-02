import "../../../../styles/LayerNode.css"

import LayerColor from "./LayerColor";
import RemoveLayerBtn from "./RemoveLayerBtn";

function LayerNode(props){
    const {
        active,
        layerIndex,

        hideLayer,
        showLayer,

        changeLayer,

        removeLayer,
        rerenderNodes
    } = props;

    const changeLayerToThis = () => {
        if(active) return;
        
        changeLayer();
        rerenderNodes()
    }

    const style = active ? {backgroundColor: "#141414"} : null;

    return(
        <div className="layer_node" onClick={changeLayerToThis} style={style}>
            <LayerColor
                showLayer={showLayer}
                hideLayer={hideLayer}
            />

            <p>Layer {layerIndex}</p>
            
            <RemoveLayerBtn
                active={active}
                layerIndex={layerIndex}

                removeLayer={removeLayer}
                rerenderNodes={rerenderNodes}
            />

        </div>
    );
}

export default LayerNode;