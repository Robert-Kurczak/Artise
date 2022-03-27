var canvasDimensions = {x: 0, y: 0};

export class UI{
    //---Upper panel---
    static menuSlideTime = 150;

    static tabs = {
        fileTab: $("#file_tab"),
        saveTab: $("#save_tab"),
        loadTab: $("#load_tab"),
        editTab: $("#edit_tab")
    };

    static documentCreatorHolder = $("#document_creator_holder");

    static saveStatus = $("#save_status");

    static get canvasDimensions(){
        return canvasDimensions;
    }
    //------

    //---Tabs---
    static toggleTab(tab, tabToHide = null){
        $(tab).slideToggle(this.menuSlideTime);

        if(tabToHide != null){
            $(tabToHide).hide();
        }
    }

    static hideAllTabs(){
        for(let t in this.tabs){
            if($(this.tabs[t]).is(":visible")){
                $(this.tabs[t]).slideToggle();
            }
        }
    }
    //------

    static showDocumentCreator(mode = null){
        //Resizing non existing document case
        if(canvasDimensions.x == 0 && mode == "resize"){
            return;
        }

        var resolutionX = 512;
        var resolutionY = 512;
        var submitLabel = "Create"

        if(mode == 'resize'){
            resolutionX = canvasDimensions.x;
            resolutionY = canvasDimensions.y;
            submitLabel = "Resize"
        }

        this.documentCreatorHolder.html(`
        
            <form class="panel" id="document_creator">
                <p>Width</p><input name="resolutionX" type="number" min="1" value="`+ resolutionX +`">
                <br>
                <p>Height</p><input name="resolutionY" type="number" min="1" value="`+ resolutionY +`">
                <br>
                <br>
                <div class="UI_hr_stripe"></div>
                <button type="reset" class="tab_item" onclick="UI.hideDocumentCreator()">Cancel</button>
                <button type="button" class="tab_item" onclick="createDocument()">`+ submitLabel +`</button>
            </form>
        
        `);
    }

    static hideDocumentCreator(){
        this.documentCreatorHolder.html("");
    }

    static destroyCanvas(){
        $(".canvas-container").remove();
    }

    static createCanvas(){
        const data = $("#document_creator").serializeArray();
        this.hideDocumentCreator();

        canvasDimensions.x = parseInt(data[0].value);
        canvasDimensions.y = parseInt(data[1].value);

        $("body").append(`
        
            <canvas width="`+ canvasDimensions.x +`" height='`+ canvasDimensions.y +`' id="main_canvas"></canvas>

        `);

        this.hideAllTabs();
    }
}