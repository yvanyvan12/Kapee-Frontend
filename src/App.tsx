import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/home';
import FAQ from './components/FAQ';
import Blogs from './components/Blogs';
import Contact from './components/Contact';
import Cart from './components/Cart';
import LayoutHandling from './LayoutFolder/Layout';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ForgotPasswordModel from './components/ForgotPasswordModel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutHandling />}>
          <Route index element={<Homepage />} />
          <Route path="home" element={<Homepage />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="cart" element={<Cart />} />
          <Route path="loginform" element={<LoginForm onClose={() => {}} />} />
          <Route path="signupform" element={<SignupForm onClose={() => {}} />} />
          <Route path="forgotpasswordmodel" element={<ForgotPasswordModel onClose={() => {}} />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
