function LineSettings(){
    return(
        <>
            <p>Brush size: </p>
            <input type="number" min={1} defaultValue={mainCanvas.getBrushSize()} onChange={updateBrush}></input>
        </>
    );
}

export default LineSettings;