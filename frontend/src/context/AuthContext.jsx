import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!localStorage.getItem('lh_token')) { setLoading(false); return; }
    try { const { data } = await api.get('/auth/me'); setUser(data); }
    catch { localStorage.removeItem('lh_token'); setUser(null); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const signIn = (token, u) => { localStorage.setItem('lh_token', token); setUser(u); };
  const logout = () => { localStorage.removeItem('lh_token'); setUser(null); };

  const isWished = (id) => !!user?.wishlist?.some((x) => String(x) === String(id));
  const toggleWish = async (id) => {
    if (!user) { toast.error('Log in to save items to your wishlist'); return false; }
    try {
      const { data } = await api.post(`/user/wishlist/${id}`);
      setUser((u) => ({ ...u, wishlist: data.wishlist }));
      toast.success(data.added ? 'Saved to wishlist' : 'Removed from wishlist');
      return true;
    } catch (e) { toast.error(errMsg(e)); return false; }
  };

  return <Ctx.Provider value={{ user, setUser, loading, signIn, logout, refresh, isWished, toggleWish }}>{children}</Ctx.Provider>;
}
