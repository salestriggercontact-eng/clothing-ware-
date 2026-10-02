import { useState } from 'react';
import toast from 'react-hot-toast';
import { ImagePlus, X, Star } from 'lucide-react';
import api, { img, errMsg } from '../api';

// value: string[] (multiple) or string (single)
export default function ImageUpload({ value, onChange, multiple }) {
  const [busy, setBusy] = useState(false);
  const list = multiple ? value || [] : value ? [value] : [];

  const pick = async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    if (!files.length) return;
    const fd = new FormData();
    files.forEach((f) => fd.append('images', f));
    setBusy(true);
    try {
      const { data } = await api.post('/upload', fd);
      onChange(multiple ? [...list, ...data.urls] : data.urls[0]);
    } catch (er) { toast.error(errMsg(er)); } finally { setBusy(false); }
  };
  const remove = (k) => onChange(multiple ? list.filter((_, i) => i !== k) : '');
  const makeMain = (k) => onChange([list[k], ...list.filter((_, i) => i !== k)]);

  return (
    <div className="uploader">
      {list.map((u, k) => (
        <div key={u + k} className="up-thumb">
          <img src={img(u)} alt="" />
          {multiple && k === 0 && <span className="up-main">Main</span>}
          <div className="up-actions">
            {multiple && k > 0 && <button type="button" onClick={() => makeMain(k)} title="Set as main image"><Star size={13} /></button>}
            <button type="button" onClick={() => remove(k)} title="Remove"><X size={13} /></button>
          </div>
        </div>
      ))}
      {(multiple || !list.length) && (
        <label className="up-add">
          <input type="file" accept="image/*" multiple={multiple} onChange={pick} hidden />
          <ImagePlus size={22} /><span>{busy ? 'Uploading…' : 'Add image'}</span>
        </label>
      )}
    </div>
  );
}
