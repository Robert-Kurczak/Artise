import "../../styles/ToolSettingsSection.css"

import DrawWidth from "./ToolsSettings/DrawWidth";

function ToolSettingsSection(props){
	const toolName = props.toolName;

	return(
		<div className="tool_settings_section">
			{/* Bruh, I would really prefer to just pass the component */}
			{toolName === "brush" && <DrawWidth label="Brush"/>}
			{toolName === "line" && <DrawWidth label="Line"/>}
			{toolName === "circle" && <DrawWidth label="Circle"/>}
			{toolName === "rectangle" && <DrawWidth label="Rect"/>}
		</div>
	);
}

export default ToolSettingsSection;