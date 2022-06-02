import "../../../styles/AddLayerBtn.css"

function AddLayerBtn(props){
    const { rerenderNodes, addLayer } = props;

    const addNewLayer = () => {
        addLayer();
        rerenderNodes();
    }

    return(
        <span className="material-icons-outlined layer_add_btn" onClick={addNewLayer}>add</span>
    );
}

export default AddLayerBtn;