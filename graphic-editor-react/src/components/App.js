import "../styles/App.css"

import UpperPanel from "./UpperPanel/UpperPanel"
import TabsStructure from "./UpperPanel/Tabs/TabsStructure";

import ToolsPanel from "./ToolsPanel/ToolsPanel"

import DocumentCreator from "./DocumentCreator/DocumentCreator";

import FabricCanvas from "./FabricCanvas/FabricCanvas";

import { useState } from "react";

//TODO: Write create doument function

function App(){
    const [showDocumentCreator, setShowDocumentCreator] = useState(false);
    const [showMainCanvas, setShowMainCanvas] = useState(false);
    const [mainCanvas, setMainCanvas] = useState("");

    const componentsHooks = {
        setShowDocumentCreator,
        setShowMainCanvas
    };

    console.log(mainCanvas);
    
    return(
        <>
            <UpperPanel>
                <TabsStructure hooks={componentsHooks}/>
            </UpperPanel>

            <ToolsPanel/>
            
            {showDocumentCreator? 
                <DocumentCreator
                    cancel={() => {setShowDocumentCreator(false)}}
                    create={() => {setShowMainCanvas(true)}}
                />
            : null}

            {showMainCanvas? 
                <FabricCanvas
                    setCanvas={setMainCanvas}
                    width={512}
                    height={512}
                />
            : null}
        </>
    );
}

export default App;