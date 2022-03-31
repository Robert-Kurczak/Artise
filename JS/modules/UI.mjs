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

    static activeTabs = [];
    static lastNestLevel = -1;

    static documentCreatorHolder = $("#document_creator_holder");
    static colorPreview = $("#color_preview");

    static saveStatus = $("#save_status");

    static get canvasDimensions(){
        return canvasDimensions;
    }
    //------

    //---Tabs---
    static toggleTab(tab, nestLevel){
        //Simply closing tab
        if($(tab).is(":visible")){
            $(tab).slideToggle(this.menuSlideTime);

            this.lastNestLevel--;
            this.activeTabs.splice(nestLevel, 1);

            return
        }

        //No tabs opened or opening in order
        if((this.lastNestLevel == -1) || (this.lastNestLevel == nestLevel - 1)){
            $(tab).slideToggle(this.menuSlideTime);

            this.activeTabs.push(tab);
            this.lastNestLevel++;

            return;
        }

        //Opening tabs not in order
        //Hiding tabs
        for(let i = nestLevel; i <= this.lastNestLevel; i++){
            
            $(this.activeTabs[i]).hide();
        }

        //Clearing array
        this.activeTabs.splice(nestLevel, this.lastNestLevel);

        //Showing proper tab and pushing its node to array
        $(tab).slideToggle(this.menuSlideTime);
        this.activeTabs.push(tab);

        //Update nestLevel
        this.lastNestLevel = nestLevel;
        
    }

    static hideActiveTabs(){
        
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
    
    static pickr = Pickr.create({
        el: '#color_preview',
        theme: 'monolith',
        useAsButton: true,
        appClass: "color_picker_custom",
        default: "#ffffff",
    
        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)'
        ],
    
        components: {
    
            // Main components
            hue: true,
            hsv: true,
            opacity: true,
            
    
            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                hsla: true,
                hsva: true,
                cmyk: true,
                input: true,
            }
        }
    });
    
}

//---UI initialization---
UI.hideAllTabs();

UI.pickr.on("change", (color) => {
    UI.colorPreview.css("background-color", color.toRGBA().toString(3));

});
//------