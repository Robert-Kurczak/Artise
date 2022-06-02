import "../../styles/ToolSettingsSection.css"

import DrawWidth from "./ToolsSettings/CoreSettings/DrawWidth";
import TextSettings from "./ToolsSettings/TextSettings";

function ToolSettingsSection(props){
	const toolName = props.toolName;

	return(
		<div className="tool_settings_section">
			{/* Bruh, I would really prefer to just pass the component */}
			{toolName === "brush" && <DrawWidth label="Brush"/>}
			{toolName === "line" && <DrawWidth label="Line"/>}
			{toolName === "circle" && <DrawWidth label="Circle"/>}
			{toolName === "rectangle" && <DrawWidth label="Rect"/>}
			{toolName === "text" && <TextSettings/>}
		</div>
	);
}

export default ToolSettingsSection;