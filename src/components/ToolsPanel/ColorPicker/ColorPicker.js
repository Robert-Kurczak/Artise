import "../../../styles/monolith.min.css"
import "../../../styles/ColorPicker.css"

import { useContext, useEffect, useState } from "react";
import Pickr from "@simonwep/pickr"
import { GlobalContext } from "../../App";

//TODO, cleanup effect
function ColorPicker(props){
    const defaultColor = "#ffffff"

    const {setColorPicker} = props;
    const [background, setBackground] = useState(defaultColor)
    const { mainCanvas } = useContext(GlobalContext);

    useEffect(() => {
        const pickr = Pickr.create({
            el: '#color_preview',
            theme: 'monolith',
            useAsButton: true,
            appClass: "color_picker_custom",
            default: defaultColor,
        
            swatches: [
                'rgba(244, 67, 54, 1)',
                'rgba(233, 30, 99, 0.95)',
                'rgba(156, 39, 176, 0.9)',
                'rgba(103, 58, 183, 0.85)',
                'rgba(63, 81, 181, 0.8)',
                'rgba(33, 150, 243, 0.75)',
                'rgba(3, 169, 244, 0.7)',
                'rgba(0, 188, 212, 0.7)'
            ],
        
            components: {
                // Main components
                hue: true,
                hsv: true,
                opacity: true,
                
        
                // Input / output Options
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: true,
                    hsva: true,
                    cmyk: true,
                    input: true,
                }
            }
        });

        //Updating color preview div with selected color
        //and color in mainCanvas object
        pickr.on("change", (color) => {
            const rgba = color.toRGBA().toString(3);
            
            mainCanvas.setColor(rgba);
            setBackground(rgba);
        });

        //Default values
        mainCanvas && mainCanvas.setColor(defaultColor);
        setBackground(defaultColor);

        setColorPicker(pickr);

        return () => {document.getElementsByClassName("color_picker_custom")[0].remove()}

    }, [setColorPicker, mainCanvas]);

    return(
        <div style={{backgroundColor: background}} id="color_preview"></div>
    );
}

export default ColorPicker;