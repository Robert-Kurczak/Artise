import { fabric } from "fabric";

function openFile(canvas, setImage, showCanvas){
        //---Creating virtual input---
        var uploader = document.createElement("input");
        uploader.setAttribute("type", "file");
        uploader.setAttribute("accept", ".png,.jpg,.jpeg");
        //------
    
        uploader.onchange = () => {
            const fileName = uploader.files[0].name;
            const fileFormat = fileName.slice(fileName.indexOf(".") + 1);

            switch(fileFormat){
                case "png":
                    const reader = new FileReader();
                    
                    reader.onload = (file) => {
                        var imageInstance = new Image();
                        imageInstance.src = file.target.result;
        
                        imageInstance.onload = () => {
                            var img = new fabric.Image(imageInstance);

                            //Creating canvas with image
                            if(canvas === ""){
                                setImage(img);
                                showCanvas(true);
                            }
                            else{
                                //Adding image to existing canvas
                                img.scaleToWidth(canvas.width);
        
                                canvas.add(img).setActiveObject(img).renderAll();
                            }
                        }
                    };

                    reader.readAsDataURL(uploader.files[0]);
                    
                    break;

                default:
                    window.alert("Incorrect file format");

                    break;
            }
        };
    
    uploader.click();
}

export default openFile;