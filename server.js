import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();

app.use(cors());
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

    const text = await response.text(); // 👈 MUDOU AQUI
    console.log("RESPOSTA DA API:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.json({ erro: "API não retornou JSON", raw: text });
    }

    if (!data.emv) {
      return res.json({ erro: "Pix não gerado", resposta: data });
    }

    res.json({ copiaECola: data.emv });

  } catch (err) {
    console.log("ERRO GERAL:", err);
    res.status(500).json({ erro: "Erro interno" });
  }
});

app.listen(3000, () => console.log("rodando"));
