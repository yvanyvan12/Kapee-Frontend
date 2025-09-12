
import {Outlet} from "react-router-dom";
import NavbarPage from"../components/Navbar";
import FooterSide from "../components/Footer";


const  LayoutHandling=()=>{
    return(
        <div>
            <NavbarPage/>
                <Outlet/>
                <FooterSide/>
        </div>
    )
}
export default LayoutHandling;