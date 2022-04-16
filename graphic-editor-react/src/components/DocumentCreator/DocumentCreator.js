import "../../styles/DocumentCreator.css"

function DocumentCreator(){
    return(
        <form className="panel document_creator">
            <p>Width</p><input className="number_input" name="resolutionX" type="number" min="1" defaultValue="512"/>
            <br/>
            <p>Height</p><input className="number_input" name="resolutionY" type="number" min="1" defaultValue="512"/>
            <br/>
            <br/>

            <button type="reset" className="button_item">Cancel</button>
            <button type="button" className="button_item">Create</button>
        </form>
    );
}

export default DocumentCreator;