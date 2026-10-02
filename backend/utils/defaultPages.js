// Default page templates. {{placeholders}} are filled on the website from Admin > Store settings.
// These are starting templates, not legal advice. Review them with a lawyer/CA before going live.
const Page = require('../models/Page');

const DEFAULT_PAGES = [
  {
    slug: 'about-us', title: 'About us', order: 1, content: `
{{storeName}} is a women's wear store for sarees, kurtis, lehengas, suits, dresses and everyday fashion. We bring traditional craft and modern style together, so you can dress for every day and every occasion.

## What we offer
- Ethnic wear: sarees, lehengas, salwar suits, sharara sets and dupattas
- Western and fusion wear: dresses, gowns, co-ords, tops, jeans and skirts
- Styling and makeup appointments with our team

## Our promise
- Clear product photos and honest descriptions
- Prices shown with all discounts, no hidden charges at checkout
- Help on call, WhatsApp and email during {{hours}}

## Business details
- Business name: {{legalName}}
- Address: {{address}}
- GSTIN: {{gstin}}
- Email: {{email}}
- Phone: {{phone}}
`,
  },
  {
    slug: 'terms-and-conditions', title: 'Terms and conditions', order: 2, content: `
These terms apply when you use the {{storeName}} website and place orders with us. By using the website or placing an order, you agree to these terms. The website is run by {{legalName}}, {{address}}.

## 1. Your account
- You must give correct name, email, phone and address details.
- You are responsible for keeping your password safe and for all activity on your account.
- We may block accounts that misuse offers, place fake orders or break these terms.

## 2. Products and prices
- We try to show colours and details as accurately as possible. Small colour differences can happen because of screen settings and lighting.
- Handwork, zari and handloom products can have small variations. These are part of the craft and are not defects.
- All prices are in Indian Rupees and include applicable taxes unless stated otherwise.
- If a product is listed at a wrong price because of an error, we may cancel the order and refund any amount paid.

## 3. Orders
- An order is confirmed only after we accept it. You will see the status in My orders.
- We may cancel an order if the product is out of stock, the address is not serviceable, or we find suspicious activity. Any amount paid will be refunded in full.

## 4. Coupons and offers
- Coupons have their own conditions (minimum order, expiry, maximum discount) and cannot be exchanged for cash.
- Only one coupon can be used per order.
- We may withdraw an offer at any time. Orders already placed will keep the discount.

## 5. Delivery, cancellation and returns
These are covered in our [Shipping policy](/page/shipping-policy), [Cancellation policy](/page/cancellation-policy) and [Refund and return policy](/page/refund-and-return-policy).

## 6. Appointments
- Styling and makeup appointments depend on availability. Please reschedule or cancel from My appointments if you cannot come.
- We may reschedule an appointment if needed and will inform you in advance.

## 7. Reviews
- Only customers who received a product can review it.
- We may remove reviews that are abusive, false or unrelated to the product.

## 8. Intellectual property
All content on this website, including photos, logo and text, belongs to {{legalName}} and cannot be copied without written permission.

## 9. Limitation of liability
Our liability for any order is limited to the amount paid for that order.

## 10. Grievance officer
For any complaint, contact our grievance officer:
- Name: {{grievanceName}}
- Email: {{grievanceEmail}}
- Address: {{address}}
We will acknowledge your complaint within 48 hours and try to resolve it within 30 days.

## 11. Governing law
These terms are governed by the laws of India. Courts at the city of our registered address will have jurisdiction.

## 12. Changes
We may update these terms. The date at the top of this page shows the last update.
`,
  },
  {
    slug: 'privacy-policy', title: 'Privacy policy', order: 3, content: `
This policy explains what information {{storeName}} ({{legalName}}) collects, why, and how we protect it.

## Information we collect
- Account details: name, email, phone number and password (stored in encrypted form).
- Delivery addresses you save.
- Orders, wishlist, reviews and appointment bookings.
- Messages you send us through the contact form.
- Basic technical data such as browser type, collected by our hosting provider for security.

## How we use it
- To process and deliver your orders and handle returns and refunds.
- To manage your appointments.
- To contact you about your order, appointment or support request.
- To prevent fraud and misuse of offers.
- To send offers only if you have agreed to receive them.

## Who we share it with
We share only what is needed with:
- Courier partners, to deliver your order (name, phone, address).
- Payment providers, when online payment is used.
- Hosting and image storage providers that run this website.
We do not sell your personal data.

## Data stored on your device
We save your login session and shopping cart in your browser's local storage so you stay logged in and do not lose your cart. You can clear this by logging out or clearing your browser data.

## How long we keep data
We keep account and order data as long as your account is active and as required by tax and accounting laws.

## Your choices
- You can update your name, phone and addresses from your Profile.
- To delete your account or get a copy of your data, email {{email}}.

## Security
Passwords are encrypted and all data is sent over a secure connection. No system is fully secure, so please use a strong password.

## Contact
For privacy questions, contact {{grievanceName}} at {{grievanceEmail}}.
`,
  },
  {
    slug: 'refund-and-return-policy', title: 'Refund and return policy', order: 4, content: `
We want you to love what you buy. If something is not right, here is how returns and refunds work.

## Return window
You can request a return or exchange within **{{returnDays}} days** of delivery.

## What can be returned
- Product is unused, unwashed and undamaged.
- All original tags, labels and packaging are intact.
- Product received is damaged, defective or different from what you ordered.

## What cannot be returned
- Products that are used, washed, altered or stitched.
- Innerwear, nightwear and blouses, for hygiene reasons, unless damaged or wrong.
- Products bought on final sale, if marked so on the product page.
- Customised or made-to-order products.

## How to request a return
1. Contact us on {{phone}}, WhatsApp or {{email}} within {{returnDays}} days of delivery.
2. Share your order number and clear photos of the product and tags.
3. We will confirm within 48 hours and arrange a pickup where available, or share the return address.

## Damaged or wrong product
Please record an unboxing video when you open the parcel. Report damage or a wrong item within 48 hours of delivery so we can resolve it quickly.

## Refunds
- After the returned product reaches us and passes the quality check, we start the refund within 2 working days.
- Cash on delivery orders: refund to your bank account or UPI ID shared with us.
- Online payments: refund to the original payment method.
- Banks usually take 5 to 7 working days to credit the amount.
- Delivery charges are not refunded unless the product was damaged or wrong.

## Exchanges
Exchanges for size or colour depend on stock. If the item is not available, we will refund the amount.
`,
  },
  {
    slug: 'shipping-policy', title: 'Shipping policy', order: 5, content: `
## Where we deliver
We deliver across India through trusted courier partners. If your pincode is not serviceable, we will inform you and cancel the order.

## Delivery charges
- Free delivery on orders of **{{freeDeliveryMin}}** or more.
- Orders below that have a delivery charge of **{{deliveryFee}}**.
- The exact charge is shown in your cart before you place the order.

## Delivery time
- Orders are packed and dispatched within **{{dispatchDays}} working days**.
- Delivery usually takes **{{deliveryDays}} working days** after dispatch, depending on your location.
- Delays can happen during festivals, sales, bad weather or courier issues. We will keep you updated.

## Tracking your order
Go to Profile, then My orders. The order page shows the current status and tracking details once shipped.

## Failed delivery
If the courier cannot deliver after attempts, the order returns to us. For prepaid orders, we refund the product amount after deducting delivery charges. Repeated refusal of cash on delivery orders may lead to cash on delivery being disabled for your account.

## Damaged parcel
Do not accept a parcel that looks opened or damaged. If you notice damage after opening, contact us within 48 hours with photos or an unboxing video.
`,
  },
  {
    slug: 'cancellation-policy', title: 'Cancellation policy', order: 6, content: `
## Cancelling your order
- You can cancel an order while its status is **Placed** or **Confirmed**.
- Open Profile, then My orders, choose the order and tap **Cancel order**.
- Once the order is **Shipped**, it cannot be cancelled. You can request a return after delivery as per our [Refund and return policy](/page/refund-and-return-policy).

## Refund on cancellation
- Cash on delivery orders: nothing to refund since no payment was made.
- Online payments: full refund to the original payment method within 5 to 7 working days.

## Cancellation by us
We may cancel an order if the product is out of stock, the address is not serviceable, the price was listed wrongly, or we see suspicious activity. You will get a full refund of any amount paid.

## Appointments
You can cancel or reschedule an appointment from My appointments any time before the appointment.
`,
  },
  {
    slug: 'payment-terms', title: 'Payment terms', order: 7, content: `
## Payment methods
- **Cash on delivery (COD):** pay in cash or UPI to the delivery partner when your order arrives.
- **Online payment:** UPI, cards, net banking and wallets will be available through a secure payment gateway when enabled on checkout.

## Prices and taxes
- All prices are in Indian Rupees and include GST unless stated otherwise.
- The final amount, including any delivery charge and coupon discount, is shown before you place the order.

## Cash on delivery
- Keep the exact amount ready if paying in cash.
- We may limit cash on delivery for high-value orders or for accounts with repeated refusals.

## Online payment security
Card and bank details are entered only on the payment gateway's secure page. {{storeName}} does not see or store your card or bank details.

## Failed or double payments
If money is deducted but the order is not placed, it is usually returned automatically by your bank within 5 to 7 working days. If not, email {{email}} with the transaction details.

## Invoices
A GST invoice is included with your order or sent to your email. GSTIN: {{gstin}}.
`,
  },
  {
    slug: 'size-guide', title: 'Size guide', order: 8, content: `
Measure over light clothing and keep the tape snug, not tight. If you are between sizes, choose the larger size.

## How to measure
- **Bust:** around the fullest part of your chest.
- **Waist:** around your natural waist, the narrowest part.
- **Hip:** around the fullest part of your hips.
- **Length:** from the highest point of the shoulder down to where you want the garment to end.

## Tops, kurtis, dresses, suits and co-ords (in inches)
- **XS:** bust 32, waist 26, hip 35
- **S:** bust 34, waist 28, hip 37
- **M:** bust 36, waist 30, hip 39
- **L:** bust 38, waist 32, hip 41
- **XL:** bust 40, waist 34, hip 43
- **XXL:** bust 42, waist 36, hip 45
- **3XL:** bust 44, waist 38, hip 47

## Jeans (waist in inches)
- **26:** waist 26, hip 35
- **28:** waist 28, hip 37
- **30:** waist 30, hip 39
- **32:** waist 32, hip 41
- **34:** waist 34, hip 43

## Blouses
Blouse sizes 32 to 40 match your bust measurement in inches.

## Sarees and dupattas
Free size. Sarees are about 5.5 m with a 0.8 m blouse piece. Dupattas are about 2.25 m.

Still not sure? Message us on WhatsApp with your measurements and we will suggest a size.
`,
  },
  {
    slug: 'faqs', title: 'FAQs', order: 9, content: `
## Orders
**How do I track my order?**
Go to Profile, then My orders. Each order shows its current status.

**Can I change my address after ordering?**
Contact us quickly on {{phone}}. We can change it only before the order is shipped.

**Can I cancel my order?**
Yes, until it is shipped. See our [Cancellation policy](/page/cancellation-policy).

## Payment
**Which payment methods do you accept?**
Cash on delivery is available. See [Payment terms](/page/payment-terms) for details.

**Is there a delivery charge?**
Delivery is free on orders of {{freeDeliveryMin}} or more. Below that, it is {{deliveryFee}}.

## Returns
**What is your return policy?**
You can request a return within {{returnDays}} days of delivery. See our [Refund and return policy](/page/refund-and-return-policy).

## Products
**How do I choose my size?**
Check our [Size guide](/page/size-guide).

**Do sarees come with a blouse piece?**
Most do. It is mentioned in the product details.

## Appointments
**How do I book a stylist?**
Go to Profile, then My appointments, and tap the calendar icon.
`,
  },
];

// Creates default pages on first start only. Pages you delete later are not recreated.
async function ensureDefaultPages() {
  if (await Page.estimatedDocumentCount()) return;
  await Page.insertMany(DEFAULT_PAGES.map((p) => ({ ...p, content: p.content.trim() })));
  console.log(`Created ${DEFAULT_PAGES.length} default pages`);
}

DEFAULT_PAGES.forEach((p) => { p.content = p.content.trim(); });
module.exports = { DEFAULT_PAGES, ensureDefaultPages };
