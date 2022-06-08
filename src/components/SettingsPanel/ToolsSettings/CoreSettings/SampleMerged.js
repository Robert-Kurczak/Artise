import { GlobalContext } from "../../../App";
import { useContext } from "react";

function SampleMerged(props){
    const { label } = props;
	const { mainCanvas } = useContext(GlobalContext);

	const toggleMerged = () => {
		mainCanvas.sampleMerged = !mainCanvas.sampleMerged;
	};

	return(
		<div>
			<p>{label}: </p>
            <input type="checkbox" defaultChecked={mainCanvas.sampleMerged} onClick={toggleMerged}></input>
        </div>
	);
}

export default SampleMerged;