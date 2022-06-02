import { GlobalContext } from "../../App";
import { useContext } from "react";


function TextSettings(){
    const { mainCanvas } = useContext(GlobalContext);

    const updateFontSize = (event) => {
        mainCanvas.setFontSize(event.target.value);
    }

    const updateFontFamily = (event) => {
        mainCanvas.setFontFamily(event.target.value);
    }

    const fonts = [
        "Arial",
        "Verdana",
        "Helvetica",
        "Tahoma",
        "Trebuchet MS",
        "Times New Roman",
        "Georgia",
        "Garamond",
        "Courier New",
        "Brush Script MT"
    ].sort().map((fontName, index) => <option style={{fontFamily: fontName}} key={index}>{fontName}</option>);

    return(
        <div className="text_settings">
            <p>Font size: </p>
            <input
                type="number"
                defaultValue={mainCanvas.getFontSize()}
                onChange={updateFontSize}
            />

            <br/>

            <p>Font family: </p>
            <select onChange={updateFontFamily}>
                {fonts}
            </select>
        </div>
    );
}

export default TextSettings;