import { useState } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

function useAfterLogin() {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const { signIn } = useAuth();
  return (data) => { signIn(data.token, data.user); toast.success(`Welcome, ${data.user.name.split(' ')[0]}`); nav(sp.get('next') || (data.user.role === 'admin' ? '/admin' : '/'), { replace: true }); };
}

export function Login() {
  const { user } = useAuth();
  const done = useAfterLogin();
  const [f, setF] = useState({ login: '', password: '' });
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { const { data } = await api.post('/auth/login', f); done(data); } catch (er) { toast.error(errMsg(er)); } finally { setBusy(false); }
  };
  return (
    <div className="auth">
      <Logo />
      <h1>Log in</h1>
      <form className="form" onSubmit={submit}>
        <label>Email or phone<input required autoComplete="username" value={f.login} onChange={(e) => setF({ ...f, login: e.target.value })} /></label>
        <label>Password<input required type="password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
        <button className="btn btn-block" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
      </form>
      <p className="muted">New here? <Link to="/register">Create an account</Link></p>
    </div>
  );
}

export function Register() {
  const { user } = useAuth();
  const done = useAfterLogin();
  const [f, setF] = useState({ name: '', email: '', phone: '', password: '' });
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { const { data } = await api.post('/auth/register', f); done(data); } catch (er) { toast.error(errMsg(er)); } finally { setBusy(false); }
  };
  const bind = (k) => ({ value: f[k], onChange: (e) => setF({ ...f, [k]: e.target.value }) });
  return (
    <div className="auth">
      <Logo />
      <h1>Create account</h1>
      <form className="form" onSubmit={submit}>
        <label>Full name<input required {...bind('name')} /></label>
        <label>Email<input required type="email" {...bind('email')} /></label>
        <label>Phone<input inputMode="tel" {...bind('phone')} /></label>
        <label>Password<input required type="password" minLength={6} autoComplete="new-password" {...bind('password')} /></label>
        <p className="muted small agree">By creating an account you agree to our <Link to="/page/terms-and-conditions">Terms</Link> and <Link to="/page/privacy-policy">Privacy policy</Link>.</p>
        <button className="btn btn-block" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Log in</Link></p>
    </div>
  );
}
