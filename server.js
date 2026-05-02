import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

app.use(cors()); // 🔥 LIBERA CORS
app.use(express.json());

app.post('/pix', async (req, res) => {
  try {
    const valor = req.body.valor;

    const response = await fetch('https://expaybrasil.com/en/purchase/link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        merchant_key: process.env.EXPAY_KEY,
        currency_code: 'BRL',
        amount: valor
      })
    });

    const data = await response.json();

    res.json({ copiaECola: data.emv });

  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.listen(3000, () => console.log("Servidor rodando"));
