import "../../styles/SettingsPanel.css"

import SectionStripe from "../SectionStripe";
import LayersSection from "./LayersSection/LayersSection";
import ToolSettingsSection from "./ToolSettingsSection";

function SettingsPanel(props){
	return(
		<div className="panel settings">
			<ToolSettingsSection toolName={props.toolName}/>

			<SectionStripe/>

			<LayersSection/>
		</div>
	);
}

export default SettingsPanel;