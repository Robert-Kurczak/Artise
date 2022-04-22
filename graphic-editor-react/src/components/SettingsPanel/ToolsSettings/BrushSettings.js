import { GlobalContext } from "../../App";
import { useContext } from "react";

function BrushSettings(){
	const defaultBrushSize = 4;

	const { mainCanvas } = useContext(GlobalContext);

	const updateBrush = (e) => {
		mainCanvas.freeDrawingBrush.width = parseInt(e.target.value);
	}

	return(
		<>
			<p>Brush size: </p>
			<input type="number" min={1} defaultValue={defaultBrushSize} onChange={updateBrush}></input>
		</>
	);
}

export default BrushSettings;