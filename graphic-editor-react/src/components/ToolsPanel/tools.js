import { useContext } from "react";
import { GlobalContext } from "../App"

import Icon from "./Icon";

import {
	mdiBrush,
	mdiPencil,
	mdiEraser,
	mdiEyedropper,
	mdiFormatColorFill,
	mdiGradientHorizontal,
	mdiCursorMove,
	mdiSelectDrag,
	mdiMinus,
	mdiRectangleOutline,
	mdiCircleOutline,
	mdiFormatTitle

} from '@mdi/js'; 

class Tool{
	constructor(toolName, icon, enableFunction, disableFunction){
		this.toolName = toolName;
		this.icon = icon;

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
//TODO move to other icon font
function Tools() {
	const { mainCanvas, colorPicker, currentTool, setCurrentTool } = useContext(GlobalContext);

	const switchTool = (tool) => {
		if(currentTool){
			if (currentTool.toolName === tool.toolName) return;
			currentTool.disable();
		}

		tool.enable();

		setCurrentTool(tool);
	}

	/* #region  Brush */
	const brushTool = new Tool(
		"brush",
		mdiBrush,
		//Enable
		() => {
			mainCanvas.drawMode("brush");
		},
		//Disable
		() => {
			mainCanvas.clearMode();
		}
	);
	/* #endregion */

	/* #region  Pencil */
	const pencilTool = new Tool(
		"pencil",
		mdiPencil,
		//Enable
		() => {
			mainCanvas.drawMode("pencil");
		},
		//Disable
		() => {
			mainCanvas.clearMode();
		}
	);
	/* #endregion */

	/* #region  Eraser */
	const eraserTool = new Tool(
		"eraser",
		mdiEraser,
		//Enable
		() => {
			mainCanvas.setDrawOperation("destination-out");
			mainCanvas.drawMode("brush");
		},
		//Disable
		() => {
			mainCanvas.setDrawOperation("source-over");
			mainCanvas.clearMode();
		}
	);
	/* #endregion */

	/* #region  Eyedropper */
	const updateColor = () => {
		colorPicker.setColor(mainCanvas.getColor());
	}

	const eyedropperTool = new Tool(
		"eyedropper",
		mdiEyedropper,
		//Enable
		() => {
			mainCanvas.eyedropperMode(true);
			mainCanvas.canvasWrapper.addEventListener("click", updateColor);
		},
		//Disable
		() => {
			mainCanvas.clearMode();
			mainCanvas.canvasWrapper.removeEventListener("click", updateColor);
		}
	);
	/* #endregion */

	/* #region  Fill */
	const fillTool = new Tool(
		"fill",
		mdiFormatColorFill,
		//Enable
		() => {
			mainCanvas.bucketFillMode();
		},
		//Disable
		() => {
			mainCanvas.clearMode();
		}
	);
	/* #endregion */

	/* #region  Gradient */
	const gradientTool = new Tool(
		"gradient",
		mdiGradientHorizontal,
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
		mdiCursorMove,
		() => {
			mainCanvas.clearMode();
		},
		() => {
			//Off
		}
	);
	/* #endregion */

	/* #region  Select */
	const selectTool = new Tool(
		"select",
		mdiSelectDrag,
		() => {
			//On
		},
		() => {
			//Off
		}
	);
	/* #endregion */

	/* #region  Line */
	const lineTool = new Tool(
		"line",
		mdiMinus,
		//Enable
		() => {
			mainCanvas.drawLineMode();
		},
		//Disable
		() => {
			mainCanvas.clearMode();
		}
	);
	/* #endregion */

	/* #region  Rectangle */
	const rectangleTool = new Tool(
		"rectangle",
		mdiRectangleOutline,
		//Enable
		() => {
			mainCanvas.drawRectMode();
		},
		//Disable
		() => {
			mainCanvas.clearMode();
		}
	);
	/* #endregion */

	/* #region Circle */
	const circleTool = new Tool(
		"circle",
		mdiCircleOutline,
		//Enable
		() => {
			mainCanvas.drawCircleMode();
		},
		//Disable
		() => {
			mainCanvas.clearMode();
		}
	);
	/* #endregion */

	/* #region  Text */
	const textTool = new Tool(
		"text",
		mdiFormatTitle,
		//Enable
		() => {
			mainCanvas.textMode();
		},
		//Disable
		() => {
			mainCanvas.clearMode();
		}
	);
	/* #endregion */

	const tools = [
		selectTool,
		moveTool,
		eyedropperTool,
		textTool,
		brushTool,
		pencilTool,
		eraserTool,
		fillTool,
		gradientTool,
		lineTool,
		rectangleTool,
		circleTool
	];

	const icons = tools.map((toolObj, index) =>
		<Icon
			key={index}

			toolName={toolObj.toolName}
			icon={toolObj.icon}
			onClick={() => {switchTool(toolObj)}}

			active={currentTool ? toolObj.toolName === currentTool.toolName : false}
		/>
	);

	return icons;
}

export default Tools;