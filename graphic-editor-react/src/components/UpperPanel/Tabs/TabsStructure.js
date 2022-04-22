import Tab from "./Tab";

import openFile from "./openFile";

import { mainCanvasContext } from "../../App";
import { useContext } from "react";


//Automatically generates tab structure from tabsStructure.js
//Then adds any other objects that were declared between <UpperPanel></UpperPanel>
function TabsStructure(props){
    const mainCanvas = useContext(mainCanvasContext);

    const {
        setShowDocumentCreator,
        setShowDocumentEditor,
        setCanvasImage,
        setShowMainCanvas
    } = props.hooks

    const structure = [
        {name: "File",
            menu: [
                {
                    name: "New",
                    onClick: () => {setShowDocumentCreator(true)}
                },
                {name: "Save",
                    menu: [
                        {
                            name: "Save to browser",
                            onClick: () => {/*Toggle component*/}
                        },
                        {
                            name: "Save JSON",
                            onClick: () => {/*Toggle component*/}
                        }
                    ],
                },
                {
                    name: "Open",
                    onClick: () => {
                        openFile(
                            mainCanvas,
                            setCanvasImage,
                            setShowMainCanvas
                        )
                    }
                }
            ]
        },
        
        {name: "Edit",
            menu: [
                {
                    name: "Resize",
                    onClick: () => {setShowDocumentEditor(true)}
                }
            ]
        }
    ];

    //Render tabs structure from structure array
    const items = structure.map(itemObj => 
        <Tab rootTab={true} key={itemObj.name + "_tab"} content={itemObj} />
    );

    return(
        <div>
            {items}
        </div>
    );
}

export default TabsStructure;