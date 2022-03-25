var canvasDimensions = {x: 0, y: 0};

export class UI{
    //---Upper panel---
    static menuSlideTime = 150;

    static fileMenu = $("#file_menu");
    static saveMenu = $("#save_menu");
    static loadMenu = $("#load_menu");

    static documentCreator = $("#document_creator");
    static canvasHolder = $("#canvas_holder");

    static saveStatus = $("#save_status");

    static get canvasDimensions(){
        return canvasDimensions;
    }
    //------

    //---Menus---
    static toggleFileMenu(){
        this.fileMenu.slideToggle(this.menuSlideTime);

        if(this.loadMenu.is(":visible")){
            this.loadMenu.slideToggle(this.menuSlideTime);
        }

        if(this.saveMenu.is(":visible")){
            this.saveMenu.slideToggle(this.menuSlideTime);
        }
    }

    static toggleSaveMenu(){
        this.saveMenu.slideToggle(this.menuSlideTime);

        if(this.loadMenu.is(":visible")){
            this.loadMenu.hide();
        }
    }

    static toggleLoadMenu(){
        this.loadMenu.slideToggle();

        if(this.saveMenu.is(":visible")){
            this.saveMenu.hide();
        }
    }

    static hideAllMenus(){
        if(this.fileMenu.is(":visible")){
            this.fileMenu.slideToggle(this.menuSlideTime);
        }

        if(this.saveMenu.is(":visible")){
            this.saveMenu.slideToggle(this.menuSlideTime);
        }

        if(this.loadMenu.is(":visible")){
            this.loadMenu.slideToggle(this.menuSlideTime);
        }

        this.documentCreator.hide();
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