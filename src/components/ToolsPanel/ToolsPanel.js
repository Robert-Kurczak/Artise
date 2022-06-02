import "../../styles/ToolsPanel.css"
import IconsSection from "./IconsSection";
import SectionStripe from "../SectionStripe"
import ColorPicker from "./ColorPicker/ColorPicker";

function ToolsPanel(props){
    return(
        <div className="panel tools_panel">
            <IconsSection/>
            <SectionStripe/>
            <ColorPicker setColorPicker={props.setColorPicker}/>
        </div>
    );
}

export default ToolsPanel;