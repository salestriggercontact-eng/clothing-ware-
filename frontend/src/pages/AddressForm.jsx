import { useState } from 'react';
const blank = { label: 'Home', name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' };
export default function AddressForm({ initial, onSave, onCancel, saving }) {
  const [a, setA] = useState({ ...blank, ...initial });
  const f = (k) => ({ value: a[k] || '', onChange: (e) => setA({ ...a, [k]: e.target.value }) });
  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); onSave(a); }}>
      <div className="row2"><label>Full name<input required {...f('name')} /></label><label>Phone<input required inputMode="tel" pattern="[0-9+ ]{10,14}" {...f('phone')} /></label></div>
      <label>House no, building, street<input required {...f('line1')} /></label>
      <label>Area, landmark<input {...f('line2')} /></label>
      <div className="row3"><label>City<input required {...f('city')} /></label><label>State<input required {...f('state')} /></label><label>Pincode<input required inputMode="numeric" pattern="[0-9]{6}" {...f('pincode')} /></label></div>
      <label>Save as
        <select {...f('label')}><option>Home</option><option>Work</option><option>Other</option></select>
      </label>
      <div className="form-actions">{onCancel && <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>}<button className="btn" disabled={saving}>{saving ? 'Saving…' : 'Save address'}</button></div>
    </form>
  );
}
