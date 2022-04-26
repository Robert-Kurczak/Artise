import "../styles/App.css"

import UpperPanel from "./UpperPanel/UpperPanel"
import TabsStructure from "./UpperPanel/Tabs/TabsStructure";
import ToolsPanel from "./ToolsPanel/ToolsPanel"
import DocumentCreator from "./DocumentCreator/DocumentCreator";
import DocumentEditor from "./DocumentCreator/DocumentEditor";
import DocumentCanvas from "./DocumentCanvas/DocumentCanvas";

import { useState, createContext } from "react";
import SettingsPanel from "./SettingsPanel/SettingsPanel";

export const GlobalContext = createContext();

function App(){
    //---Document creator---
    const [showDocumentCreator, setShowDocumentCreator] = useState(false);
    const [showDocumentEditor, setShowDocumentEditor] = useState(false);
    //------

    //---Canvas---
    const [showMainCanvas, setShowMainCanvas] = useState(false);
    const [mainCanvas, setMainCanvas] = useState(null);
    const [canvasResolution, setCanvasResolution] = useState({x: 512, y: 512})
    const [canvasImage, setCanvasImage] = useState(null);
    //------

    //---Color picker---
    const [colorPicker, setColorPicker] = useState("");
    //------

    //---Tools---
    const [currentTool, setCurrentTool] = useState();
    //------

    //Maybe create object that collects all sorts of hooks regarding canvas and pass this?
    const hooksForTabs = {
        setShowDocumentCreator,
        setShowDocumentEditor,
        setCanvasImage,
        setShowMainCanvas
    };

    const GlobalContextContent = {
        mainCanvas,

        currentTool,
        setCurrentTool
    };
    
    return(
        <GlobalContext.Provider value={GlobalContextContent}>

            <UpperPanel>
                <TabsStructure hooks={hooksForTabs}/>
            </UpperPanel>

            <ToolsPanel
                setColorPicker={setColorPicker}
            />

            <SettingsPanel
                toolName={currentTool ? currentTool.toolName : ""}
            />
            
            {showDocumentCreator &&
                <DocumentCreator
                    setMainCanvas={setMainCanvas}

                    canvasResolution={canvasResolution}
                    setCanvasResolution={setCanvasResolution}
                    
                    hideCreator={() => {setShowDocumentCreator(false)}}
                    showCanvas={() => {setShowMainCanvas(true)}}
                />
            }

            {showDocumentEditor &&
                <DocumentEditor
                    hideCreator={() => {setShowDocumentEditor(false)}}
                />
                
            }

            {showMainCanvas &&
                <DocumentCanvas
                    setMainCanvas={setMainCanvas}
                    canvasResolution={canvasResolution}
                />
            }

        </GlobalContext.Provider>
    );
}

export default App;