import "../../styles/DocumentCreator.css"

function DocumentCreator(props){
    var width = props.canvasResolution.x;
    var height = props.canvasResolution.y;

    const changeWidth = e => width = e.target.value;
    const changeHeight = e => height = e.target.value;

    const cancel = () => {
        props.hideCreator();
    }

    const create = () => {
        props.setCanvasResolution({x: width, y: height})
        
        props.hideCreator();
        props.showCanvas();
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
            <button type="button" className="button_item" onClick={create}>Create</button>
        </form>
    );
}

export default DocumentCreator;