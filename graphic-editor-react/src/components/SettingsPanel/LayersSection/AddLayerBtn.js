import "../../../styles/AddLayerBtn.css"

function AddLayerBtn(props){
    const { updateLayersAmount, addLayer } = props;

    const addNewLayer = () => {
        addLayer();
        updateLayersAmount();
    }

    return(
        <span className="material-icons-outlined layer_add_btn" onClick={addNewLayer}>add</span>
    );
}

export default AddLayerBtn;