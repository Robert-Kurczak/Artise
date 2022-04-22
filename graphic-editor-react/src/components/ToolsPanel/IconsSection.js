import "../../styles/IconsSection.css"

import tools from "./tools";
import Icon from "./Icon"

function IconsSection(){
    const icons = tools.map((toolObj, index) => 
        <Icon key={index} iconName={toolObj.iconName}></Icon>
    );

    //Move it to tools.js and move tools to tools.js so tools function have access to hooks
    return(
        <div className="tools_grid">
            {icons}
        </div>
    );
}

export default IconsSection;