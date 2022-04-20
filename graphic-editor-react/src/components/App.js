import "../styles/App.css"

import UpperPanel from "./UpperPanel/UpperPanel"
import TabsStructure from "./UpperPanel/Tabs/TabsStructure";
import ToolsPanel from "./ToolsPanel/ToolsPanel"
import DocumentCreator from "./DocumentCreator/DocumentCreator";
import FabricCanvas from "./FabricCanvas/FabricCanvas";

import { useState } from "react";

function App(){
    const [showDocumentCreator, setShowDocumentCreator] = useState(false);
    const [showMainCanvas, setShowMainCanvas] = useState(false);
    const [canvasResolution, setCanvasResolution] = useState({x: 512, y: 512})
    const [mainCanvas, setMainCanvas] = useState("");
    const [colorPicker, setColorPicker] = useState("");

    const componentsHooks = {
        setShowDocumentCreator,
        setShowMainCanvas
    };
    
    return(
        <>
            <UpperPanel>
                <TabsStructure hooks={componentsHooks}/>
            </UpperPanel>

            <ToolsPanel setColorPicker={setColorPicker}/>
            
            {showDocumentCreator? 
                <DocumentCreator
                    canvasResolution={canvasResolution}
                    setCanvasResolution={setCanvasResolution}
                    
                    hideCreator={() => {setShowDocumentCreator(false)}}
                    showCanvas={() => {setShowMainCanvas(true)}}
                />
            : null}

            {showMainCanvas? 
                <FabricCanvas
                    setCanvas={setMainCanvas}
                    canvasResolution={canvasResolution}
                />
            : null}
        </>
    );
}

export default App;