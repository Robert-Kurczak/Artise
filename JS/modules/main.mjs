import {UI} from "./UI.mjs";
import {tool, toolsManager} from "./toolsManager.mjs"

window.UI = UI;
window.toolsManager = toolsManager;

var mainCanvas;
window.createDocument = () => {
    //Removing previous canvas
    $(".canvas-container").remove();

    UI.createCanvas("main_canvas");
    mainCanvas = new fabric.Canvas("main_canvas");
}

window.canvas = () => {return mainCanvas};

window.loadPNG = () => {
    //---Creating virtual input---
    var uploader = document.createElement("input");
    uploader.setAttribute("type", "file");
    uploader.setAttribute("accept", ".png");
    //------

    uploader.onchange = () => {
        const fileName = uploader.files[0].name;

        if(fileName.slice(fileName.indexOf(".") + 1) == "png"){
            const reader = new FileReader();

            reader.onload = (file) => {
                var imageInstance = new Image();
                imageInstance.src = file.target.result;

				imageInstance.onload = () => {
					var img = new fabric.Image(imageInstance);
					img.scaleToWidth(UI.canvasDimensions.x);

					mainCanvas.add(img).setActiveObject(img).renderAll();
				  }
            };
    
            reader.readAsDataURL(uploader.files[0]);
        }
        else{
            window.alert("Incorrect file format");
        }
    };

    uploader.click();
}

const updateBrushColor = (color) => {mainCanvas.freeDrawingBrush.color = color.toRGBA().toString(3)};

window.updateBrushWidth = (width) => {mainCanvas.freeDrawingBrush.width = parseInt(width)};

toolsManager.tools = {
    "select": new tool("highlight_alt", () => {console.log("select On")}, () => {console.log("select Off")}),
    "move": new tool("pinch", () => {console.log("move On")}, () => {console.log("move Off")}),
    "eyedropper": new tool("colorize", () => {console.log("eyedropper On")}, () => {console.log("eyedropper Off")}),
    "text": new tool("title", () => {console.log("text On")}, () => {console.log("text Off")}),
    //---
    "brush": new tool("brush",
        //Enable function
        () => {
            mainCanvas.isDrawingMode = true;

            //Updating brush color only when brush is on
            mainCanvas.freeDrawingBrush.color = UI.pickr.getColor().toRGBA().toString(3);
            UI.pickr.on("change", updateBrushColor);

            //Showing tool settings panel
            UI.showToolSettings("brush");
        },
        //Disable function
        () => {
            //Disable listening for brush color change when brush isn't picked
            mainCanvas.isDrawingMode = false;
            UI.pickr.off("change", updateBrushColor);
        }),
    //---
    "fill": new tool("format_color_fill", () => {console.log("fill On")}, () => {console.log("fill Off")}),
    "gradient": new tool("gradient", () => {console.log("gradient On")}, () => {console.log("gradient Off")}),
    "shape": new tool("rectangle", () => {console.log("shape On")}, () => {console.log("shape Off")})
};

window.switchTool = (tool) => {
    UI.selectedToolPrev.html(tool.html());
    toolsManager.switchTool(toolsManager.tools[tool.data("tool_label")]);
}

//---Initialization---
UI.pickr.on("change", (color) => {
    var rgba = color.toRGBA().toString(3);
    UI.colorPreview.css("background-color", rgba);

    //Setting brush color
    
});
//------