import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Homepage from './components/home';
import FAQ from './components/FAQ';
import Blogs from './components/Blogs';
import Contact from './components/Contact';
import Cart from './components/Cart';
import LayoutHandling from './LayoutFolder/Layouot';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ForgotPasswordModel from './components/ForgotPasswordModel';
import Dashboard from './dashboard/dashboard';
import Order from './components/order';   // ✅ Import order

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main website routes WITH layout (header, footer, etc.) */}
          <Route path="/" element={<LayoutHandling />}>
            <Route index element={<Homepage />} />
            <Route path="home" element={<Homepage />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="cart" element={<Cart />} />
            <Route path="order" element={<Order />} />   {/* ✅ Added order route */}

            <Route 
              path="loginForm" 
              element={
                <LoginForm  
                  onClose={() => { }} 
                  onSwitchToSignup={() => { throw new Error('Function not implemented.'); }} 
                />
              } 
            />
            <Route path="signupform" element={<SignupForm />} />
            <Route path="forgotpasswordmodel" element={<ForgotPasswordModel onClose={() => {}} />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          
          {/* Protected Dashboard routes WITHOUT layout */}
          <Route 
            path="/dashboard" 
            element={
              
                <Dashboard />
              
            } 
          />
          <Route 
            path="orders" 
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            } 
          />
          <Route path='/login' element={<LoginForm  onClose={() => {}} 
      onSwitchToSignup={() => {}} />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
