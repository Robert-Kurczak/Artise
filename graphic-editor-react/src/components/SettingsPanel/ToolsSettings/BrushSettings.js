import { GlobalContext } from "../../App";
import { useContext } from "react";

function BrushSettings(props){
	const { mainCanvas } = useContext(GlobalContext);

	const updateBrush = (e) => {
		mainCanvas.setBrushSize(parseInt(e.target.value));
	}

	return(
		<>
			<p>{props.label} size: </p>
			<input type="number" min={1} defaultValue={mainCanvas.getBrushSize()} onChange={updateBrush}></input>
		</>
	);
}

export default BrushSettings;