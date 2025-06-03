import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./Login";
import Dashboard from "./dashboard";
import ProtectedRoute from './ProtectedRoute';
import PaymentForm from "./PaymentForm";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RegistrationForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/paymentForm" element={<PaymentForm />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;