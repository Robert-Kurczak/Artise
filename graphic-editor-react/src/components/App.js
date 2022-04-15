import "../styles/App.css"

import UpperPanel from "./UpperPanel/UpperPanel"
import TabsStructure from "./UpperPanel/Tabs/TabsStructure";
import ToolsPanel from "./ToolsPanel/ToolsPanel"
import DocumentCreator from "./DocumentCreator/DocumentCreator";
import { useState } from "react";

function App(){
    const [showDocumentCreator, setShowDocumentCreator] = useState(false);

    const componentsHooks = {
        setShowDocumentCreator
    };

    
    return(
        <>
            <UpperPanel>
                <TabsStructure hooks={componentsHooks}/>
            </UpperPanel>

            <ToolsPanel/>
            {showDocumentCreator? <DocumentCreator/>: null}
        </>
    );
}

export default App;