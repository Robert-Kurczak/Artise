import BrushSettings from "./ToolsSettings/BrushSettings";

function ToolSettingsSection(props){
	const toolName = props.toolName;

	return(
		<div className="tool_setting_section">
			{/* Bruh, I would really prefer to just pass the component */}
			{toolName === "brush" && <BrushSettings label="Brush"/>}
			{toolName === "line" && <BrushSettings label="Line"/>}
			{toolName === "circle" && <BrushSettings label="Circle"/>}
			{toolName === "rectangle" && <BrushSettings label="Rect"/>}
			{/* {toolName === "rect" && <RectSettings/>} */}
		</div>
	);
}

export default ToolSettingsSection;