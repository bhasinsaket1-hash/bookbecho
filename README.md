# BookBecho
Second-hand book marketplace: buy, sell and exchange books within your city.

## Run
1. Install Node.js 18+
2. `npm install`
3. Copy `.env.example` to `.env` and add Razorpay TEST keys (dashboard.razorpay.com)
4. `npm start` → http://localhost:3000

UPI app link and QR work without any keys. Razorpay (card/netbanking/UPI) needs the keys.

## Structure
public/index.html, public/css/style.css, public/js/app.js — frontend
server.js — payment API (order creation + signature verification)

## Next steps
Database (listings/users), OTP login, Razorpay Route for seller payouts, React/Vite frontend.
