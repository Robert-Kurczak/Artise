import "../../../../../styles/MoveLayerBtn.css"
import { Icon as MdIcon } from '@mdi/react'
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'; 

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
            <span onClick={moveUp} className="move_up">
                <MdIcon path={mdiChevronUp} size={1}/>
            </span>
            <span onClick={moveDown} className="move_down">
                <MdIcon path={mdiChevronDown} size={1}/>
            </span>
        </div>
    );
}

export default MoveLayerBtn;