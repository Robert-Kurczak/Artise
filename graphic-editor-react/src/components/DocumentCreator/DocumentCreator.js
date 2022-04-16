import "../../styles/DocumentCreator.css"

function DocumentCreator(props){

    return(
        <form className="panel document_creator">
            <p>Width</p><input className="number_input" name="resolutionX" type="number" min="1" defaultValue="512"/>
            <br/>
            <p>Height</p><input className="number_input" name="resolutionY" type="number" min="1" defaultValue="512"/>
            <br/>
            <br/>

            <button type="reset" className="button_item" onClick={props.cancel}>Cancel</button>
            <button type="button" className="button_item" onClick={() => {props.cancel(); props.create()}}>Create</button>
        </form>
    );
}

export default DocumentCreator;