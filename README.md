# LuxeHer — Women's wear store (MERN)

Customer store + admin panel. React/Vite frontend, Node/Express API, MongoDB.

## 1. Backend
```
cd backend
cp .env.example .env      # fill MONGO_URI, JWT_SECRET, CLIENT_URL, Cloudinary keys
npm install
npm run create-admin      # creates admin from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev
```

## 2. Frontend
```
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:5000
npm install
npm run dev
```
Log in with the admin email -> you land on /admin.

## Demo products (optional)
```
cd backend
npm run seed-demo     # 35 sections x 40 products = 1400 unique products, each with its own Pexels photo
                      # needs UNSPLASH_ACCESS_KEY (or PEXELS_API_KEY) in backend/.env
                      # free Unsplash key = 50 searches/hour; if it stops, run it again after 1 hour (progress is saved)
npm run remove-demo   # deletes only the demo items (your own products stay)
```
Demo products show a "Demo" tag in admin. Remove them before going live.

## 3. First setup in admin (in this order)
0. Store settings (business name, address, GSTIN, phone, email, grievance officer). Policy pages pull these details.
1. Categories (Sarees, Kurtis, Dresses, Lehengas, Tops, Bottoms, Co-ords…)
2. Products (images, price, MRP, stock, sizes, colors, fabric)
3. Banners (home page hero)
4. Services (Styling consultation, Makeup and hair) -> opens appointment booking
5. Coupons (optional)

## Deploy on Render
- Backend: Web Service, root `backend`, build `npm install`, start `npm start`. Add all .env values.
- Frontend: Static Site, root `frontend`, build `npm install && npm run build`, publish `dist`.
  Add a rewrite rule `/*` -> `/index.html` (or keep `public/_redirects`).
- Set backend `CLIENT_URL` to the frontend URL.
- Delivery charges are set only on backend (`FREE_DELIVERY_MIN`, `DELIVERY_FEE`). Frontend reads them from the API.

## Important
- Without Cloudinary keys, uploaded images are stored on server disk. Render wipes that disk on every deploy -> images disappear. Use Cloudinary.
- Payment is Cash on Delivery only. Online gateway (Easebuzz/Razorpay) is not wired yet.

## Pages and policies
Created automatically on first server start (only if no pages exist):
About us, Terms and conditions, Privacy policy, Refund and return policy, Shipping policy,
Cancellation policy, Payment terms, Size guide, FAQs. Plus the Contact us page with a message form (Admin > Messages).
Edit them in Admin > Pages and policies. "Restore template" brings back the original text.
These are templates, not legal advice. Review before going live.
