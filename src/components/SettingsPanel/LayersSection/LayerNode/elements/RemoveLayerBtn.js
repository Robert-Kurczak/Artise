import "../../../../../styles/RemoveLayerBtn.css"

function RemoveLayerBtn(props){
    const { removeLayer, rerenderNodes } = props;

    const removeThisLayer = (event) => {
        event.stopPropagation();

        removeLayer();

        rerenderNodes();
    }

    return(
        <span className="material-icons-outlined layer_remove" onClick={removeThisLayer}>delete</span>
    );
}

export default RemoveLayerBtn;