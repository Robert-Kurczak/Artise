import BrushSettings from "./ToolsSettings/BrushSettings";

function ToolSettingSection(props){
	const toolName = props.toolName;

	return(
		<div className="tool_setting_section">
			{/* Brush I would really prefer to just pass the component */}
			{toolName === "brush" && <BrushSettings/>}
		</div>
	);
}

export default ToolSettingSection;