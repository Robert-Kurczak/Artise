import "../styles/icons.css"
import "../styles/App.css"

import UpperPanel from "./UpperPanel/UpperPanel";
import TabsStructure from "./UpperPanel/Tabs/TabsStructure";
import DefaultScreen from "./DefaultScreen/DefaultScreen";
import ToolsPanel from "./ToolsPanel/ToolsPanel"
import DocumentCreator from "./DocumentCreator/DocumentCreator";
import DocumentEditor from "./DocumentCreator/DocumentEditor";
import Canvas from "./Canvas/Canvas";
import SettingsPanel from "./SettingsPanel/SettingsPanel";

import fileOpener from "../fileOpener";
import fileSaver from "../fileSaver";

import { useState, createContext, useEffect, useCallback, useMemo } from "react";

export const GlobalContext = createContext();

function App(){
    //---Color picker---
    const [colorPicker, setColorPicker] = useState("");
    //------

    //---Tools---
    const [currentTool, setCurrentTool] = useState();
    //------

    //---Document creator---
    const [showDocumentCreator, setShowDocumentCreator] = useState(false);
    const [showDocumentEditor, setShowDocumentEditor] = useState(false);
    //------

    //---Canvas---
    const wrapperID = "canvas_wrapper";

    const [mainCanvas, setMainCanvas] = useState(null);

    const setCanvSettings = useCallback((canvas) => {
        canvas.setDrawWidth(5);
        canvas.setFontSize(10);
        canvas.setFontFamily("Arial");
    }, []);

    const createNewCanvas = useCallback((width, height) => {
        setCurrentTool(null);

        const canvas = new Canvas(wrapperID);
        canvas.initNew(width, height);

        setCanvSettings(canvas);
        setMainCanvas(canvas);

        return canvas;
    }, [setCanvSettings]);

    const createCanvasFromJSON = useCallback((jsonObject) => {
        setCurrentTool(null);

        const canvas = new Canvas(wrapperID);
        canvas.initFromJSON(jsonObject);

        setCanvSettings(canvas);
        setMainCanvas(canvas);

        return canvas;
    }, [setCanvSettings]);

    const createCanvasFromImage = useCallback((image) => {
        const canvas = createNewCanvas(image.width, image.height);

        canvas.addImage(image)
    }, [createNewCanvas]);
    //------

    //---File IO---
    const opener = useMemo(() => {return new fileOpener(createCanvasFromImage, createCanvasFromJSON)}, [createCanvasFromImage, createCanvasFromJSON]);
    const saver = useMemo(() => {return new fileSaver()}, []);

    const downloadJSON = useCallback(() => {
        saver.saveJSON(mainCanvas.getCanvasJSON(), "Artific");
    }, [mainCanvas, saver]);

    const downloadImage = useCallback(() => {
        saver.saveCanvas(mainCanvas.getLayersSection(), "Artific");
    }, [mainCanvas, saver]);

    const saveLocal = useCallback(() => {
        localStorage.setItem("canvasJSON", mainCanvas.getCanvasJSON());
    }, [mainCanvas]);

    const loadLocal = useCallback(() => {
        createCanvasFromJSON(JSON.parse(localStorage.getItem("canvasJSON")));
    }, [createCanvasFromJSON]);

    //Loading stored canvas when it's possible
    useEffect(() => {
        if(!mainCanvas && localStorage.getItem("canvasJSON")) loadLocal();
    }, [loadLocal, mainCanvas]);
    //------

    //Autosave every 3 minutes
    useEffect(() => {
        var interval;

        if(mainCanvas){
            interval = setInterval(() => {
                saveLocal();
            }, 180000);
        }

        return () => clearInterval(interval);
        }, [saveLocal, mainCanvas]);

    const GlobalContextContent = {
        mainCanvas,

        colorPicker,

        currentTool,
        setCurrentTool
    };
    
    return(
        <GlobalContext.Provider value={GlobalContextContent}>

            <UpperPanel>
                <TabsStructure
                    setShowDocumentCreator={setShowDocumentCreator}
                    setShowDocumentEditor={setShowDocumentEditor}

                    opener={opener}
                    downloadJSON={downloadJSON}
                    saveLocal={saveLocal}
                    downloadImage={downloadImage}
                />
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
                    createCanvas={createNewCanvas}
                    
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