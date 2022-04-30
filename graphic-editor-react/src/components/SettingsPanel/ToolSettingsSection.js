import BrushSettings from "./ToolsSettings/BrushSettings";

function ToolSettingsSection(props){
	const toolName = props.toolName;

	return(
		<div className="tool_setting_section">
			{/* Brush I would really prefer to just pass the component */}
			{toolName === "brush" && <BrushSettings/>}
			{/* {toolName === "line" && <LineSettings/>}
			{toolName === "rect" && <RectSettings/>} */}
		</div>
	);
}

export default ToolSettingsSection;