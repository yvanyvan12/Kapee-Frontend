import { Outlet } from "react-router-dom"
import Footer from '../components/Footer';

const LayoutHandling = () => {
  return (
    <div>
    <div>
      <Outlet />

            

    </div>
        <Footer />

    </div>
  )
  
}

export default LayoutHandling
