import "../../styles/DocumentCreator.css"
import { useContext } from "react";

import { mainCanvasContext } from "../App";

function DocumentEditor(props){
    const canvas = useContext(mainCanvasContext)

    var width = canvas.width;
    var height = canvas.height;

    const changeWidth = e => width = e.target.value;
    const changeHeight = e => height = e.target.value;

    const cancel = () => {
        props.hideCreator();
    }

    const edit = () => {
        canvas.setWidth(width);
        canvas.setHeight(height);

        props.hideCreator();
        //TODO scale objects in canvas
    }

    return(
        <form className="panel document_creator">
            <p>Width</p>
            <input className="number_input" type="number" min="1" defaultValue={width} onChange={changeWidth}/>
            <br/>
            <p>Height</p>
            <input className="number_input" type="number" min="1" defaultValue={height} onChange={changeHeight}/>
            <br/>
            <br/>

            <button type="button" className="button_item" onClick={cancel}>Cancel</button>
            <button type="button" className="button_item" onClick={edit}>Edit</button>
        </form>
    );
}

export default DocumentEditor;