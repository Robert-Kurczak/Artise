//Smallest node in displayed tab
function TabItem(props){
    return(
        <button onClick={props.onClick} className={"tab_item " + props.addClass}>{props.name}</button>
    );
}

export default TabItem;