import backgroundImg from "../../Images/favicon_color.svg";
import "../../styles/DefaultScreen.css";

function DefaultScreen(){
    return(
        <div className="default_screen">
            <img src={backgroundImg} alt="pallete icon"/>
            <p>Artise</p>
        </div>
    );
}

export default DefaultScreen;