const tabsStructure = [
    {name: "File",
        menu: [
            {name: "New"},
            {name: "Save",
                menu: [
                    {name: "Save to browser"},
                    {name: "Save JSON"},
                    {name: "Parent",
                        menu: [
                            {name: "Child1"},
                            {name: "Child2"},
                            {name: "CHild3"}
                        ]
                    }
                ],
            },
            {name: "Load"}
        ]
    },
    
    {name: "Edit",
        menu: [
            {name: "Resize"}
        ]
    }
];

export default tabsStructure;