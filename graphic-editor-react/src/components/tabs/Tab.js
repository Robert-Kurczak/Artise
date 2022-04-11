import {useState, useEffect, useRef} from "react";
import TabItem from "./TabItem"

//Recursive function that generates nested tabs using
//{name: "parent", menu: [{name: "child", ...}]} objects
function Tab(props){
    const [hidden, setHidden] = useState(true);
    const ref = useRef();
    const toggleTab = () => setHidden(!hidden);
    
    //Setting class names
    const wrapperClassName = props.rootTab ? "root_tab_wrapper" : "nested_tab_wrapper";
    const buttonClassName = props.rootTab ? "tab_label" : null;
    const divClassName = props.rootTab ? "panel tab" : "panel tab nested_tab";
    
    const menuItems = props.content.menu.map(itemObj => {
        if("menu" in itemObj){
            return <Tab key={itemObj.name + "_tab"} submenuParent={true} content={itemObj}/>
        }
        else{
            return <TabItem key={itemObj.name + "_item"} name={itemObj.name}/>;
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
            <TabItem key={props.content.name + "_item"} onClick={toggleTab} addClass={buttonClassName} name={props.content.name}/>

            {/*Direct tab div*/}
            {!hidden ? 
            <div className={divClassName} id="file_tab">
                {menuItems}
            </div> : null}
        </div>
    );
}

export default Tab;