
require('dotenv').config();

const express = require('express');
const crypto = require('crypto');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const {
  RAZORPAY_KEY_ID: KEY,
  RAZORPAY_KEY_SECRET: SECRET
} = process.env;

const auth = () =>
  'Basic ' + Buffer.from(`${KEY}:${SECRET}`).toString('base64');
// Server-side trusted prices for Razorpay orders
const BOOK_PRICES = {
  1: 225,
  2: 300,
  3: 160,
  4: 250,
  5: 900
};

// Create a Razorpay order
app.post('/api/order', async (req, res) => {
  if (!KEY || !SECRET) {
    return res.status(500).json({
      error: 'Razorpay keys not set in .env'
    });
  }

  const bookId = Number(req.body.bookId);
const price = BOOK_PRICES[bookId];

if (!Number.isFinite(bookId) || price === undefined) {
  return res.status(400).json({
    error: 'Invalid book'
  });
}

const amount = Math.round(price * 100);

  try {
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth()
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt: 'bb_' + Date.now(),
        notes: {
          book: String(req.body.title || '').slice(0, 100)
        }
      })
    });

    const o = await r.json();

    if (!r.ok) {
      return res.status(r.status).json({
        error: o.error?.description || 'Order failed'
      });
    }

    return res.json({
      id: o.id,
      amount: o.amount,
      key: KEY
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message || 'Something went wrong'
    });
  }
});

// Verify Razorpay payment signature
app.post('/api/verify', (req, res) => {
  const {
    razorpay_order_id: o,
    razorpay_payment_id: p,
    razorpay_signature: s
  } = req.body || {};

  if (!SECRET || !o || !p || !s) {
    return res.json({ ok: false });
  }

  const exp = crypto
    .createHmac('sha256', SECRET)
    .update(o + '|' + p)
    .digest('hex');

  const expectedBuffer = Buffer.from(exp, 'hex');
  const receivedBuffer = /^[a-f0-9]{64}$/i.test(s)
    ? Buffer.from(s, 'hex')
    : Buffer.alloc(0);

  const ok =
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

  return res.json({ ok });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`BookBecho running on http://localhost:${PORT}`);
});