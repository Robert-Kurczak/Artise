import "../../styles/DocumentCreator.css"
import Canvas from "../Canvas/Canvas";

function DocumentCreator(props){
    const {
        wrapperID,
        setMainCanvas,
        hideCreator,
        setCurrentTool
    } = props;

    var width = 512;
    var height = 512;

    const changeWidth = e => width = e.target.value;
    const changeHeight = e => height = e.target.value;

    const create = () => {
        setCurrentTool(null);
        const canvas = new Canvas(wrapperID, width, height);

        //TODO Maybe use normal variable instead of state?
        setMainCanvas(canvas);
        
        hideCreator();
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

            <button type="button" className="button_item" onClick={hideCreator}>Cancel</button>
            <button type="button" className="button_item" onClick={create}>Create</button>
        </form>
    );
}

export default DocumentCreator;