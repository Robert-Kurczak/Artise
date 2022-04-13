import "../../styles/ToolsPanel.css"
import IconsSection from "./IconsSection";
import SectionStripe from "../SectionStripe"

function ToolsPanel(){
    return(
        <div className="panel tools_panel">
            <IconsSection/>

            {/*--TODO--*/}
            <SectionStripe/>

            <div id="color_preview"></div>
        </div>
    );
}

export default ToolsPanel;