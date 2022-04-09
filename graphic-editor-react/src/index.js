import React from 'react';
import ReactDOM from 'react-dom';

//OLD - to rework
import "./CSS/style.css"
import "./CSS/UI.css"
//

import {tabsStructure} from "./tabsStructure"

function TabItem(props){
    return(
        <button className={"tab_item " + props.addClass}>{props.name}</button>
    );
}

//Recursive function that generates nested tabs using
//{name: "parent", menu: [{name: "child", ...}]} objects
function Tab(props){
    const wrapperClassName = props.rootTab ? "root_tab_wrapper" : "nested_tab_wrapper";
    const buttonClassName = props.rootTab ? "tab_label" : null;
    const divClassName = props.rootTab ? "panel tab" : "panel tab nested_tab";
    
    const menuItems = props.content.menu.map((itemObj, index) => {
        if("menu" in itemObj){
            return <Tab key={index} content={itemObj}/>
        }
        else{
            return <TabItem key={index} name={itemObj.name}/>;
        }

    });

    return(
        <div className={wrapperClassName}>
            <TabItem addClass={buttonClassName} name={props.content.name}/>

            <div className={divClassName} id="file_tab">
                {menuItems}
            </div>
            
        </div>
    );
}

//Automatically generates tab structure from tabsStructure.js
//Then adds any other objects that were declared between <UpperPanel></UpperPanel>
class UpperPanel extends React.Component{
    //Render tabs structure from tabsStructure.js
    render(){
        const items = tabsStructure.map((itemObj, index) => 
            <Tab rootTab={true} key={index} content={itemObj} />
        );

        return(
            <div class="panel" id="upper_panel">
                {items}
            </div>
        );
    }
}

ReactDOM.render(
    <UpperPanel />,
    document.getElementById('root')
);