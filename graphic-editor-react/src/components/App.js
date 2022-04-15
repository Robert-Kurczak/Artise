import "../styles/App.css"

import UpperPanel from "./UpperPanel/UpperPanel"
import ToolsPanel from "./ToolsPanel/ToolsPanel"
import DocumentCreator from "./DocumentCreator/DocumentCreator";

import { useState, createContext } from "react";

export const AppContext = createContext();

function App(){
    const [showCreator, setShowCreator] = useState(false);

    const componentsHooks = {
        DocumentCreatorState: [showCreator, setShowCreator]
    };

    return(
        <>
            {/* <AppContext.Provider value={componentsHooks}> */}
                <UpperPanel/>
            {/* </AppContext.Provider> */}

            <ToolsPanel/>
            {/* {showCreator? <DocumentCreator/>: null} */}
            <DocumentCreator/>
        </>
    );
}

export default App;