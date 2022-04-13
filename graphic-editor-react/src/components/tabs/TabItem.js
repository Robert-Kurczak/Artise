import "../../styles/TabItem.css"

//Smallest node in displayed tab
function TabItem(props){
    const addClass = "addClass" in props ? " " + props.addClass : "";

    return(
        <button onClick={props.onClick} className={"tab_item" + addClass}>{props.name}
        
            {props.submenuParent ? 
                <span className="submenu_arrow">&gt;</span>
            : null}
        </button>
    );
}

export default TabItem;