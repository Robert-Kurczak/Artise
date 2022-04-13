export class Tool{
    constructor(iconName, enableFunction, disableFunction){
        this.iconName = iconName;
        this.enable = () => {enableFunction()};
        this.disable = () => {disableFunction()};
    }
}