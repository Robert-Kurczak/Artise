var canvasDimensions = {x: 0, y: 0};

export class UI{
    //---Upper panel---
    static menuSlideTime = 150;

    static fileTab = $("#file_tab");
    static editTab = $("#edit_tab");

    static saveTab = $("#save_tab");
    static loadTab = $("#load_tab");

    static documentCreator = $("#document_creator");
    static canvasHolder = $("#canvas_holder");

    static saveStatus = $("#save_status");

    static get canvasDimensions(){
        return canvasDimensions;
    }
    //------

    //---Tabs---
    static toggleFileTab(){
        this.fileTab.slideToggle(this.menuSlideTime);

        if(this.loadTab.is(":visible")){
            this.loadTab.slideToggle(this.menuSlideTime);
        }

        if(this.saveTab.is(":visible")){
            this.saveTab.slideToggle(this.menuSlideTime);
        }
    }

    static toggleSaveTab(){
        this.saveTab.slideToggle(this.menuSlideTime);

        if(this.loadTab.is(":visible")){
            this.loadTab.hide();
        }
    }

    static toggleLoadTab(){
        this.loadTab.slideToggle();

        if(this.saveTab.is(":visible")){
            this.saveTab.hide();
        }
    }

    static hideAllTabs(){
        if(this.fileTab.is(":visible")){
            this.fileTab.slideToggle(this.menuSlideTime);
        }

        if(this.editTab.is(":visible")){
            this.editTab.slideToggle(this.menuSlideTime);
        }

        if(this.saveTab.is(":visible")){
            this.saveTab.slideToggle(this.menuSlideTime);
        }

        if(this.loadTab.is(":visible")){
            this.loadTab.slideToggle(this.menuSlideTime);
        }

        this.documentCreator.hide();
    }

    static toggleEditTab(){
        this.editTab.slideToggle(this.menuSlideTime);

        // if(this.loadTab.is(":visible")){
        //     this.loadTab.slideToggle(this.menuSlideTime);
        // }

        // if(this.saveTab.is(":visible")){
        //     this.saveTab.slideToggle(this.menuSlideTime);
        // }
    }
    //------

    static showDocumentCreator(){
        this.documentCreator.show();
    }

    static hideDocumentCreator(){
        this.documentCreator.hide();
    }

    static createCanvas(){
        const data = this.documentCreator.serializeArray();
        this.hideDocumentCreator();

        canvasDimensions.x = parseInt(data[0].value);
        canvasDimensions.y = parseInt(data[1].value);

        this.canvasHolder.html(`
        
            <canvas width="`+ canvasDimensions.x +`" height='`+ canvasDimensions.y +`'></canvas>

        `);
    }
}