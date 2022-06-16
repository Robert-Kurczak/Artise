import "../../styles/DocumentCreator.css"

function DocumentEditor(props){
    const { currentWidth, currentHeight, resize } = props

    var width = currentWidth;
    var height = currentHeight;

    const changeWidth = (event) => width = event.target.value;
    const changeHeight = (event) => height = event.target.value;

    const cancel = () => {
        props.hideCreator();
    }

    const edit = () => {
        resize({x: width, y: height});

        props.hideCreator();
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