function Icon(props){
    const { onClick, toolName, iconName } = props;

    return(
        <span onClick={onClick} title={toolName} className="material-icons-outlined">{iconName}</span>
    );
}

export default Icon;