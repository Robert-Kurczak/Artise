import "../../styles/icons.css"

function Icon(props){
    return(
        <span className="material-icons-outlined">{props.iconName}</span>
    );
}

export default Icon;