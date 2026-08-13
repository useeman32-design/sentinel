import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './state/AppState';
import { Splash, Login, Register, ForgotPassword, VerifyEmail, ResetPassword } from './pages/auth/AuthScreens';
import Home from './pages/Home';
import {
  ScanHub,
  LinkScanner,
  EmailScanner,
  SmsScanner,
  QrScanner,
  FileScanner,
  PasswordChecker,
  BreachMonitor,
} from './pages/Scan';
import Intel from './pages/Intel';
import Assistant from './pages/Assistant';
import More, { Profile, Settings, Notifications } from './pages/More';
import { Training, Course } from './pages/Training';
import { Reports, ReportDetail } from './pages/Reports';

function Guard({ children }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { theme } = useApp();
  return (
    <div className="stage" data-theme={theme}>
      <div className="phone" data-theme={theme}>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/app/home"
            element={
              <Guard>
                <Home />
              </Guard>
            }
          />
          <Route path="/app/scan" element={<Guard><ScanHub /></Guard>} />
          <Route path="/app/scan/link" element={<Guard><LinkScanner /></Guard>} />
          <Route path="/app/scan/email" element={<Guard><EmailScanner /></Guard>} />
          <Route path="/app/scan/sms" element={<Guard><SmsScanner /></Guard>} />
          <Route path="/app/scan/qr" element={<Guard><QrScanner /></Guard>} />
          <Route path="/app/scan/file" element={<Guard><FileScanner /></Guard>} />
          <Route path="/app/scan/password" element={<Guard><PasswordChecker /></Guard>} />
          <Route path="/app/scan/breach" element={<Guard><BreachMonitor /></Guard>} />
          <Route path="/app/intel" element={<Guard><Intel /></Guard>} />
          <Route path="/app/assistant" element={<Guard><Assistant /></Guard>} />
          <Route path="/app/more" element={<Guard><More /></Guard>} />
          <Route path="/app/profile" element={<Guard><Profile /></Guard>} />
          <Route path="/app/settings" element={<Guard><Settings /></Guard>} />
          <Route path="/app/notifications" element={<Guard><Notifications /></Guard>} />
          <Route path="/app/training" element={<Guard><Training /></Guard>} />
          <Route path="/app/training/:id" element={<Guard><Course /></Guard>} />
          <Route path="/app/reports" element={<Guard><Reports /></Guard>} />
          <Route path="/app/reports/:id" element={<Guard><ReportDetail /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
