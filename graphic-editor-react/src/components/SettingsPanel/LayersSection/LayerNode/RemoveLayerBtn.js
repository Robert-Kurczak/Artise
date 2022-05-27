import "../../../../styles/RemoveLayerBtn.css"

function RemoveLayerBtn(props){
    const { updateActiveLayer, removeLayer, rerenderNodes } = props;
    
    const removeThisLayer = (event) => {
        event.stopPropagation();
        
        removeLayer();

        updateActiveLayer();
        rerenderNodes();
    }

    return(
        <span className="material-icons-outlined layer_remove" onClick={removeThisLayer}>delete</span>
    );
}

export default RemoveLayerBtn;