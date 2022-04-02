export class tool{
    constructor(iconName, enableFunction, disableFunction){
        this.iconName = iconName;
        this.enable = () => {enableFunction()};
        this.disable = () => {disableFunction()};
    }
}

export class toolsManager{
    static tools = {};

    static currentTool = null;

    static switchTool(tool){
        if(this.currentTool != null){
            this.currentTool.disable();
        }
        
        tool.enable();
        this.currentTool = tool;
    }
}