import "../../styles/icons.css"

function Icon(props){
    return(
        <span onClick={props.onClick} className="material-icons-outlined">{props.iconName}</span>
    );
}

export default Icon;