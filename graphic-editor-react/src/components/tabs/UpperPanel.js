import tabsStructure from "./tabsStructure"
import Tab from "./Tab";

//Automatically generates tab structure from tabsStructure.js
//Then adds any other objects that were declared between <UpperPanel></UpperPanel>
function UpperPanel(){

    //Render tabs structure from tabsStructure.js
    const items = tabsStructure.map(itemObj => 
        <Tab rootTab={true} key={itemObj.name + "_tab"} content={itemObj} />
    );

    return(
        <div className="panel">
            {items}
        </div>
    );
}

export default UpperPanel;