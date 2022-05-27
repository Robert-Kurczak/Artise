function saveFile(json){
    //---Creating virtual output---
    const downloader = document.createElement("a");
    //------

    const file = new Blob([json], {type: "application/json"});
    downloader.href = URL.createObjectURL(file);
    downloader.download = "Artific.json";

    downloader.click()

    URL.revokeObjectURL(downloader.href);

    downloader.remove()
}

export default saveFile