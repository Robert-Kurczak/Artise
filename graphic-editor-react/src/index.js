import React from 'react';
import ReactDOM from 'react-dom';

import "./CSS/style.css"
import "./CSS/UI.css"

class Tab extends React.Component{
    tree = this.props.fields;

    treeHTML = ""


    generateTree(nodeObj, lastField=null, deepLevel = 0){
        if(nodeObj == null){
            return lastField;
        }
    
        if(lastField != null){
            treeHTML += `
                <button class="tab_item" onclick="UI.showDocumentCreator()">{lastField}</button>
                <div class="UI_hr_stripe"></div>
            `
        }

        for(let field in nodeObj){
            console.log(this.generateTree(nodeObj[field], field));
        }
    }

    render(){
        this.generateTree(this.tree);

        return(
            <div class="root_tab_wrapper">
                <button class="tab_item tab_label" onclick="UI.toggleTab(UI.tabs.fileTab, 0)">{this.props.label}</button>

                <div class="panel tab" id="file_tab">
                    
                </div>
            </div>
        )
    }
}

const fileTabTree = {
    "New": null,
    "Save": {
        "Save to browser": null,
        "Save JSON": null
    },
    "Load": {
        "Load from browser": null,
        "Load PNG": null,
        "Load from JSON": null
        }
};

ReactDOM.render(
    <Tab label="File" fields={fileTabTree}/>,
    document.getElementById('root')
  );