const express = require('express');
const { createMollieClient } = require('@mollie/api-client');

const app = express();
const port = process.env.PORT || 3000;

const mollie = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY
});

app.get('/pay', async (req, res) => {
  try {
    const payment = await mollie.payments.create({
      amount: {
        currency: 'EUR',
        value: '10.00'
      },
      description: 'Test Zahlung',
      redirectUrl: 'https://deine-domain.up.railway.app/success',
      webhookUrl: 'https://deine-domain.up.railway.app/webhook',
      method: 'directdebit'
    });

    res.redirect(payment.getCheckoutUrl());
  } catch (error) {
    console.error(error);
    res.status(500).send('Fehler');
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
  console.log(`Server läuft auf Port ${port}`);
});
