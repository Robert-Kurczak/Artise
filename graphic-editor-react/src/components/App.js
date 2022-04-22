import "../styles/App.css"

import UpperPanel from "./UpperPanel/UpperPanel"
import TabsStructure from "./UpperPanel/Tabs/TabsStructure";
import ToolsPanel from "./ToolsPanel/ToolsPanel"
import DocumentCreator from "./DocumentCreator/DocumentCreator";
import DocumentEditor from "./DocumentCreator/DocumentEditor";
import FabricCanvas from "./FabricCanvas/FabricCanvas";

import { useState, createContext } from "react";

export const mainCanvasContext = createContext();

function App(){
    const [showDocumentCreator, setShowDocumentCreator] = useState(false);
    const [showDocumentEditor, setShowDocumentEditor] = useState(false);

    const [showMainCanvas, setShowMainCanvas] = useState(false);
    const [mainCanvas, setMainCanvas] = useState("");
    const [canvasResolution, setCanvasResolution] = useState({x: 512, y: 512})
    const [canvasImage, setCanvasImage] = useState(null);

    const [colorPicker, setColorPicker] = useState("");

    //Maybe create object that collects all sorts of hooks regarding canvas and pass this?
    const hooksForTabs = {
        setShowDocumentCreator,
        setShowDocumentEditor,
        setCanvasImage,
        setShowMainCanvas
    };
    
    return(
        <mainCanvasContext.Provider value={mainCanvas}>

            <UpperPanel>
                <TabsStructure hooks={hooksForTabs}/>
            </UpperPanel>

            <ToolsPanel
                setColorPicker={setColorPicker}
            />
            
            {/*That's a lot of hooks regarding canvas component
            //Maybe wrap them in single object ("canvasSetters") and pass this object around?*/}
            {showDocumentCreator?
                <DocumentCreator
                    setMainCanvas={setMainCanvas}

                    canvasResolution={canvasResolution}
                    setCanvasResolution={setCanvasResolution}
                    
                    hideCreator={() => {setShowDocumentCreator(false)}}
                    showCanvas={() => {setShowMainCanvas(true)}}
                />
            : null}

            {showDocumentEditor?
                <DocumentEditor
                    hideCreator={() => {setShowDocumentEditor(false)}}
                />
                
            : null}

            {showMainCanvas?
                <FabricCanvas
                    mainCanvas={mainCanvas}
                    setCanvas={setMainCanvas}
                    canvasResolution={canvasResolution}

                    canvasImage={canvasImage}
                />
            : null}

        </mainCanvasContext.Provider>
    );
}

export default App;