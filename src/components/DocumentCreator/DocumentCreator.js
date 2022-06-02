import "../../styles/DocumentCreator.css"

function DocumentCreator(props){
    const {
        createCanvas,
        hideCreator
    } = props;

    var width = 512;
    var height = 512;

    const changeWidth = e => width = e.target.value;
    const changeHeight = e => height = e.target.value;

    const create = () => {
        createCanvas(width, height);
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