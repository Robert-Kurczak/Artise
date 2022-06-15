import "../../../../../styles/MoveLayerBtn.css"

function MoveLayerBtn(props){
    const { moveLayer, rerenderNodes } = props;

    const moveUp = (event) => {
        event.stopPropagation();

        moveLayer(1);
        rerenderNodes();
    }

    const moveDown = (event) => {
        event.stopPropagation();

        moveLayer(-1);
        rerenderNodes();
    }

    return(
        <div className="layer_move">
            <span onClick={moveUp}>^</span>
            <span onClick={moveDown}>v</span>
        </div>
    );
}

export default MoveLayerBtn;