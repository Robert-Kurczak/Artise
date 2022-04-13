import "../../styles/IconsSection.css"

import tools from "./tools";
import Icon from "./Icon"

function IconsSection(){
    const icons = tools.map((toolObj, index) => 
        <Icon key={index} iconName={toolObj.iconName}></Icon>
    );

    return(
        <div className="tools_grid">
            {icons}
        </div>
    );
}

export default IconsSection;