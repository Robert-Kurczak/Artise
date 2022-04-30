import "../../../../styles/RemoveLayerBtn.css"

function RemoveLayerBtn(props){
    const { updateActiveLayer, removeLayer, updateLayersAmount } = props;
    
    const removeThisLayer = (event) => {
        event.stopPropagation();
        
        removeLayer();

        updateActiveLayer();
        updateLayersAmount();
    }

    return(
        <span className="material-icons-outlined layer_remove" onClick={removeThisLayer}>delete</span>
    );
}

export default RemoveLayerBtn;