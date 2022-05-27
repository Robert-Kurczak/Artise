import "../styles/icons.css"

import "../styles/App.css"

import UpperPanel from "./UpperPanel/UpperPanel";
import TabsStructure from "./UpperPanel/Tabs/TabsStructure";
import DefaultScreen from "./DefaultScreen/DefaultScreen";
import ToolsPanel from "./ToolsPanel/ToolsPanel"
import DocumentCreator from "./DocumentCreator/DocumentCreator";
import DocumentEditor from "./DocumentCreator/DocumentEditor";

import { useState, createContext } from "react";
import SettingsPanel from "./SettingsPanel/SettingsPanel";

export const GlobalContext = createContext();

function App(){
    //---Document creator---
    const [showDocumentCreator, setShowDocumentCreator] = useState(false);
    const [showDocumentEditor, setShowDocumentEditor] = useState(false);
    //------

    //---Canvas---
    const wrapperID = "canvas_wrapper";

    const [mainCanvas, setMainCanvas] = useState(null);
    const [canvObjToLoad, setCanvObjToLoad] = useState(null);
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
        setCanvObjToLoad
    };

    const GlobalContextContent = {
        mainCanvas,

        colorPicker,

        currentTool,
        setCurrentTool
    };
    
    return(
        <GlobalContext.Provider value={GlobalContextContent}>

            <UpperPanel>
                <TabsStructure hooks={hooksForTabs}/>
            </UpperPanel>

            {mainCanvas == null &&
                <DefaultScreen/>
            }

            {mainCanvas &&
                <ToolsPanel
                    setColorPicker={setColorPicker}
                />
            }
            
            {mainCanvas &&
                <SettingsPanel
                    toolName={currentTool ? currentTool.toolName : ""}
                />
            }
            
            {showDocumentCreator &&
                <DocumentCreator
                    wrapperID={wrapperID}
                    setMainCanvas={setMainCanvas}
                    setCurrentTool={setCurrentTool}
                    
                    hideCreator={() => {setShowDocumentCreator(false)}}
                />
            }

            {showDocumentEditor &&
                <DocumentEditor
                    hideCreator={() => {setShowDocumentEditor(false)}}
                />
            }

            {/* Wrapper for future canvases */}
            <div id={wrapperID}></div>

        </GlobalContext.Provider>
    );
}

export default App;