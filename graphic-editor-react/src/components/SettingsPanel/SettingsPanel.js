import "../../styles/SettingsPanel.css"

import SectionStripe from "../SectionStripe";
import ToolSettingSection from "./ToolSettingSection";

function SettingsPanel(props){
	return(
		<div className="panel settings">
			<ToolSettingSection toolName={props.toolName}/>
			<SectionStripe/>
			<div className="layer_section"></div>
		</div>
	);
}

export default SettingsPanel;