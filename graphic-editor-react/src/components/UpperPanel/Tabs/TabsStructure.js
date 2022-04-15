import Tab from "./Tab";

//Automatically generates tab structure from tabsStructure.js
//Then adds any other objects that were declared between <UpperPanel></UpperPanel>
function TabsStructure(props){
    const structure = [
        {name: "File",
            menu: [
                {
                    name: "New",
                    onClick: () => {props.hooks.setShowDocumentCreator(true)}
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
                    name: "Load",
                    onClick: () => {/*Toggle component*/}
                }
            ]
        },
        
        {name: "Edit",
            menu: [
                {
                    name: "Resize",
                    onClick: () => {/*Toggle component*/}
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