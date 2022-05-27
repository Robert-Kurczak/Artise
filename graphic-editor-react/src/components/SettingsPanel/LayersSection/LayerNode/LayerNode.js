import "../../../../styles/LayerNode.css"

import LayerColor from "./LayerColor";
import RemoveLayerBtn from "./RemoveLayerBtn";

function LayerNode(props){
    const {
        active,
        updateActiveLayer,
        layerIndex,

        hideLayer,
        showLayer,

        changeLayer,

        removeLayer,
        updateLayersAmount
    } = props;

    const changeLayerToThis = () => {
        if(active) return;
        
        changeLayer();
        updateActiveLayer();
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

                updateActiveLayer={updateActiveLayer}
                removeLayer={removeLayer}
                updateLayersAmount={updateLayersAmount}
            />

        </div>
    );
}

export default LayerNode;