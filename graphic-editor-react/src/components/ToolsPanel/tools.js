import {
    useContext,
    useState
} from "react";
import {
    mainCanvasContext
} from "../App"

import Icon from "./Icon";

class Tool {
    constructor(iconName, enableFunction, disableFunction) {
        this.iconName = iconName;
        this.enable = () => {
            enableFunction()
        };
        this.disable = () => {
            disableFunction()
        };
    }
}

function Tools() {
    const mainCanvas = useContext(mainCanvasContext);

    const [currentTool, setCurrentTool] = useState();

    const switchTool = (tool) => {
        if (currentTool) currentTool.disable();

        tool.enable();

        setCurrentTool(tool);

        console.log("switching", tool)
    }

    /* #region  Brush */
    const brushTool = new Tool(
        "brush",
        () => {
            mainCanvas.isDrawingMode = true;
        },
        () => {
            mainCanvas.isDrawingMode = false;
        }
    );
    /* #endregion */

    /* #region  Eyedropper */
    const eyedropperTool = new Tool(
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
        <
        Icon key = {
            index
        }
        iconName = {
            toolObj.iconName
        }
        onClick = {
            () => {
                switchTool(toolObj)
            }
        }
        />
    );

    return icons;
}

export default Tools;