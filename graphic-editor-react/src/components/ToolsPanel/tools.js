import { useContext, useState } from "react";
import { GlobalContext } from "../App"

import Icon from "./Icon";

class Tool {
	constructor(toolName, iconName, enableFunction, disableFunction){
		this.toolName = toolName;
		this.iconName = iconName;

		this.enable = () => {
			enableFunction()
		};

		this.disable = () => {
			disableFunction()
		};
	}
}

//Due to the fact that component's shouldn't be passed as props
//I use tool name for identification purpouses in other component's.

//To add tool's setting panel in SettingsPanel component,
//you have to add case in ToolSettingSection that render specific component
//based on given tool's name

//Maybe there's some workaround

function Tools() {
	const { mainCanvas, currentTool, setCurrentTool } = useContext(GlobalContext);

	const switchTool = (tool) => {
		if (currentTool) currentTool.disable();

		tool.enable();

		setCurrentTool(tool);
	}

	/* #region  Brush */
	const brushTool = new Tool(
		"brush",
		"brush",
		//Enable
		() => {
			mainCanvas.isDrawingMode = true;
		},
		//Disable
		() => {
			mainCanvas.isDrawingMode = false;
		}
	);
	/* #endregion */

	/* #region  Eyedropper */
	const eyedropperTool = new Tool(
		"eyedropper",
		"colorize",
		() => {
			//On
		},
		() => {
			//Off
		}
	);
	/* #endregion */

	/* #region  Fill */
	const fillTool = new Tool(
		"fill",
		"format_color_fill",
		() => {
			//On
		},
		() => {
			//Off
		}
	);
	/* #endregion */

	/* #region  Gradient */
	const gradientTool = new Tool(
		"gradient",
		"gradient",
		() => {
			//On
		},
		() => {
			//Off
		}
	);
	/* #endregion */

	/* #region  Move */
	const moveTool = new Tool(
		"move",
		"pinch",
		() => {
			//On
		},
		() => {
			//Off
		}
	);
	/* #endregion */

	/* #region  Select */
	const selectTool = new Tool(
		"select",
		"highlight_alt",
		() => {
			//On
		},
		() => {
			//Off
		}
	);
	/* #endregion */

	/* #region  Shape */
	const shapeTool = new Tool(
		"shape",
		"rectangle",
		() => {
			//On
		},
		() => {
			//Off
		}
	);
	/* #endregion */

	/* #region  Text */
	const textTool = new Tool(
		"text",
		"title",
		() => {
			//On
		},
		() => {
			//Off
		}
	);
	/* #endregion */

	const tools = [
		brushTool,
		eyedropperTool,
		fillTool,
		gradientTool,
		moveTool,
		selectTool,
		shapeTool,
	];

	const icons = tools.map((toolObj, index) =>
		<Icon key={index} iconName={toolObj.iconName} onClick={() => {switchTool(toolObj)}}/>
	);

	return icons;
}

export default Tools;