const express = require('express');
const Mollie = require('@mollie/api-client');

const app = express();
const port = process.env.PORT || 3000;
// 👉 DEIN API KEY HIER
const mollie = Mollie({ apiKey: 'live_8B5g55vJSxFrpw24KHCVG2VCPbVgyK' });

app.get('/pay', async (req, res) => {
  try {
    const payment = await mollie.payments.create({
      amount: {
        currency: 'EUR',
        value: '10.00' // Betrag
      },
      description: 'Test Zahlung',
      redirectUrl: 'http://localhost:3000/success',
      webhookUrl: 'http://localhost:3000/webhook',
      method: 'directdebit' // 👉 SEPA Lastschrift
    });

    res.redirect(payment.getCheckoutUrl());
  } catch (error) {
    console.error(error);
    res.send('Fehler');
  }
});

app.get('/success', (req, res) => {
  res.send('Zahlung abgeschlossen!');
});

app.post('/webhook', express.json(), (req, res) => {
  console.log('Webhook erhalten');
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
