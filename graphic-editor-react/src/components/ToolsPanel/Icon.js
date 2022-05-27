import { Icon as MdIcon } from '@mdi/react'

function Icon(props){
    const { onClick, toolName, icon, active } = props;

    const style = active ? {backgroundColor: "#141414"} : null;

    return(
        <span onClick={onClick} title={toolName} style={style}>
            <MdIcon path={icon} size={1}/>
        </span>
    );
}

export default Icon;