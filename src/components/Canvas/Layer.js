class Event{
    #host;
    #type;
    #handler;
    constructor(host, type, handler, options){
        host.addEventListener(type, handler, options);

        this.#host = host;
        this.#type = type;
        this.#handler = handler;
    }

    getHost(){return this.#host}
    getType(){return this.#type}
    getHandler(){return this.#handler}

    destroy(){
        this.#host.removeEventListener(this.#type, this.#handler);
    }
}

class Layer{
    canvasNode;
    canvasCTX;
    hidden = false;

    modeEvents = [];

    constructor(width, height, name){
        this.name = name;
        
        this.canvasNode = document.createElement("canvas");
        this.canvasNode.width = width;
        this.canvasNode.height = height;
        this.canvasNode.id = "layer " + name;
        this.canvasNode.style = "position: absolute; pointer-events: none; width: 100%";

        this.canvasCTX = this.canvasNode.getContext("2d");
    }

    hide(){
        this.canvasNode.style.opacity = 0;
        this.hidden = true;
    }

    show(){
        this.canvasNode.style.opacity = 1;
        this.hidden = false;
    }

    setSize(size){
        this.canvasNode.width = size.x;
        this.canvasNode.height = size.y;
    }

    addModeEvent(eventHost, eventType, eventHandler, options={}){
        this.modeEvents.push(new Event(eventHost, eventType, eventHandler, options));
    }

    clearEvents(){
        for(let event of this.modeEvents){
            event.destroy();
        }

        this.modeEvents = [];
    }

    transferEvents(receiver){
        for(let event of this.modeEvents){
            //After destroying event, its information still remains
            //so it can be recreated on new node.
            event.destroy()

            var host = event.getHost();
            if(host === this.canvasNode){
                host = receiver.canvasNode;
            }

            receiver.addModeEvent(host, event.getType(), event.getHandler());
        }

        this.modeEvents = [];
    }
}

export default Layer;