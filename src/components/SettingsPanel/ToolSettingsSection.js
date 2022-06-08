import "../../styles/ToolSettingsSection.css"

import DrawWidth from "./ToolsSettings/CoreSettings/DrawWidth";
import SampleMerged from "./ToolsSettings/CoreSettings/SampleMerged";
import TextSettings from "./ToolsSettings/TextSettings";

function ToolSettingsSection(props){
	const toolName = props.toolName;

	return(
		<div className="tool_settings_section">
			{/* Bruh, I would really prefer to just pass the component */}
			{toolName === "brush" && <DrawWidth label="Brush size"/>}
			{toolName === "pencil" && <DrawWidth label="Pencil size"/>}
			{toolName === "line" && <DrawWidth label="Line thickness"/>}
			{toolName === "circle" && <DrawWidth label="Circle thickness"/>}
			{toolName === "rectangle" && <DrawWidth label="Rect thickness"/>}
			{toolName === "eraser" && <DrawWidth label="Eraser size"/>}

			{toolName === "text" && <TextSettings/>}
			{toolName === "select" && <SampleMerged label="Global select"/>}
			{toolName === "eyedropper" && <SampleMerged label="Global eyedrop"/>}
		</div>
	);
}

export default ToolSettingsSection;