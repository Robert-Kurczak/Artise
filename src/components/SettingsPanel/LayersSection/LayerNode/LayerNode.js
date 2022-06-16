import "../../../../styles/LayerNode.css"

import LayerColor from "./elements/LayerColor";
import MoveLayerBtn from "./elements/MoveLayerBtn";
import RemoveLayerBtn from "./elements/RemoveLayerBtn";

function LayerNode(props){
    const {
        layerIndex,
        layerName,

        active,
        hidden,

        hideLayer,
        showLayer,

        changeLayer,

        removeLayer,
        moveLayer,

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
                hidden={hidden}
                showLayer={showLayer}
                hideLayer={hideLayer}
                rerenderNodes={rerenderNodes}
            />

            <p>Layer {layerName}</p>

            <MoveLayerBtn
                moveLayer={moveLayer}
                rerenderNodes={rerenderNodes}
            />
            
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