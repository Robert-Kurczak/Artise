import { GlobalContext } from "../../../App";
import { useContext } from "react";

function DrawWidth(props){
	const { label } = props;
	const { mainCanvas } = useContext(GlobalContext);

	const updateWidth = (event) => {
		mainCanvas.setDrawWidth(parseInt(event.target.value));
	}

	return(
		<div className="draw_width_setting">
			<p>{label} size: </p>
			<input type="number" min={1} defaultValue={mainCanvas.getDrawWidth()} onChange={updateWidth}></input>
		</div>
	);
}

export default DrawWidth;