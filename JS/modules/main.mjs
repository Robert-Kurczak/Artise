import {UI} from "./UI.mjs";
window.UI = UI;

var g_mainCanvas;
window.createDocument = () => {
    //Removing previous canvas
    $(".canvas-container").remove()

    UI.createCanvas();
    g_mainCanvas = new fabric.Canvas("main_canvas");
}

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

					g_mainCanvas.add(img).setActiveObject(img).renderAll();
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

//---Initialization---
UI.hideAllTabs();
//------