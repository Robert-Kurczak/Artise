import Tab from "./Tab";

//Automatically generates tab structure from tabsStructure.js
//Then adds any other objects that were declared between <UpperPanel></UpperPanel>
function TabsStructure(props){
    const {
        setShowDocumentCreator,
        setShowDocumentEditor,

        opener,
        downloadJSON,
        saveLocal,
        downloadImage
    } = props

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
                            onClick: () => {saveLocal()}
                        },
                        {
                            name: "Save JSON",
                            onClick: () => {downloadJSON()}
                        }
                    ],
                },
                {
                    name: "Open",
                    onClick: () => {
                        opener.open();
                    }
                },
                {name: "Export",
                    menu: [
                        {
                            name: "Save PNG",
                            onClick: () => {downloadImage()}
                        }
                    ]
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
    const items = structure.map((itemObj, index) => 
        <Tab rootTab={true} key={index} content={itemObj} />
    );

    return(
        <div>
            {items}
        </div>
    );
}

export default TabsStructure;