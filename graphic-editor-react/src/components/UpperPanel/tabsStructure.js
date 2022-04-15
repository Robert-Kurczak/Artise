const tabsStructure = [
    {name: "File",
        menu: [
            {
                name: "New",
                onClick: () => {/*Toggle component*/}
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

export default tabsStructure;