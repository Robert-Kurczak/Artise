import { GlobalContext } from "../../App";
import { useContext } from "react";

function BrushSettings(){
	const { mainCanvas } = useContext(GlobalContext);

	const updateBrush = (e) => {
		mainCanvas.setBrushSize(parseInt(e.target.value));
	}

	return(
		<>
			<p>Brush size: </p>
			<input type="number" min={1} defaultValue={mainCanvas.getBrushSize()} onChange={updateBrush}></input>
		</>
	);
}

export default BrushSettings;