

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import RegistrationPage from './RegistrationPage';
import AdminPanel from './AdminPanel';
import StudentDashboard from './StudentDashboard';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import Navbar from './Navbar';
import EventsPage from './EventsPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/signin" element={<SignInForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/track" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App
