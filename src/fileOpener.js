class fileOpener{
    #reader;
    #uploader;

    constructor(imageCallback, jsonCallback){
        this.#reader = new FileReader();

        //---Creating virtual input---
        this.#uploader = document.createElement("input");
        this.#uploader.setAttribute("type", "file");
        this.#uploader.setAttribute("accept", ".png,.jpg,.jpeg,.json");
        //------

        this.#uploader.onchange = () => {
            const fileName = this.#uploader.files[0].name;
            const fileFormat = fileName.slice(fileName.indexOf(".") + 1);

            switch(fileFormat){
                case "jpg":
                case "jpeg":
                case "png":
                {
                    this.#reader.onload = (file) => {
                        var imageInstance = new Image();
                        imageInstance.src = file.target.result;

                        imageInstance.onload = () => {
                            imageCallback(imageInstance);
                        };
                    };
    
                    this.#reader.readAsDataURL(this.#uploader.files[0]);
                    
                    break;
                }
    
                case "json":
                {
                    this.#reader.onload = (file) => {
                        jsonCallback(JSON.parse(file.target.result));
                    };
    
                    this.#reader.readAsText(this.#uploader.files[0]);
    
                    break;
                }
    
                default:
                    window.alert("Incorrect file format");
    
                    break;
            }
        }
    }

    open(){
        this.#uploader.click();
    }
}

export default fileOpener;