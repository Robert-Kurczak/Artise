class fileSaver{
    #downloader;

    // #fileTypes = {
    //     json: {type: "application/json"},
    //     png: {type: "image/png"}
    // }

    constructor(){
        this.#downloader = document.createElement("a");
    }

    saveJSON(content, fileName){
        const file = new Blob([content], {type: "application/json"});

        this.#downloader.href = URL.createObjectURL(file);
        this.#downloader.download = fileName + ".json";

        this.#downloader.click();

        URL.revokeObjectURL(this.#downloader.href);
    }

    saveCanvas(canvas, fileName){
        canvas.toBlob((file) => {
            this.#downloader.href = URL.createObjectURL(file);
            this.#downloader.download = fileName + ".png";

            this.#downloader.click();

            URL.revokeObjectURL(this.#downloader.href);
        });
    }
}

export default fileSaver;