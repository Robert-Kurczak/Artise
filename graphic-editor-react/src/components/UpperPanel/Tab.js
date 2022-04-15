import "../../styles/Tab.css"

import {useState, useEffect, useRef} from "react";
import TabItem from "./TabItem"

//Recursive function that generates nested tabs using
//{name: "parent", menu: [{name: "child", ...}]} objects

//Proper tab have label and menu
function Tab(props){
    const [hidden, setHidden] = useState(true);
    const ref = useRef();
    const toggleTab = () => setHidden(!hidden);
    
    //Setting class names
    const wrapperClassName = props.rootTab ? "root_tab_wrapper" : "nested_tab_wrapper";
    const buttonClassName = props.rootTab ? "tab_label" : "";
    const divClassName = props.rootTab ? "tab panel" : "panel tab nested_tab";
    
    const menuItems = props.content.menu.map(itemObj => {
        //if tab have submenu, call recursive Tab
        if("menu" in itemObj){
            return <Tab key={itemObj.name + "_tab"} submenuParent={true} content={itemObj}/>
        }
        //else just add normal item
        else{
            return <TabItem key={itemObj.name + "_item"} name={itemObj.name} onClick={itemObj.onClick}/>;
        }
    });

    //Hiding tab when clicking outside
    useEffect(() =>{
        const handler = (event) => {
            if(!hidden && ref.current && !ref.current.contains(event.target)){
                setHidden(true);
            }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);

        //Cleanup
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, [hidden, ref]);

    return(
        <div className={wrapperClassName} ref={ref}>
            {/*Label of tab. Toggles content */}
            <TabItem
                key={props.content.name + "_item"}
                onClick={toggleTab}
                addClass={buttonClassName}
                name={props.content.name}
                submenuParent={props.submenuParent}
            />

            {/*Direct tab div*/}
            {!hidden ? 
            <div className={divClassName}>
                {menuItems}
            </div> : null}
        </div>
    );
}

export default Tab;