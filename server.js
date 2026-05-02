import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

const MERCHANT_ID = "1346";
const MERCHANT_KEY = process.env.EXPAY_KEY;

function gerarSignature(valor) {
  const base = `${MERCHANT_ID}${valor}BRL${MERCHANT_KEY}`;
  return crypto.createHash("sha256").update(base).digest("hex");
}

app.post("/pix", async (req, res) => {
  try {
    const valor = req.body.valor;

    const signature = gerarSignature(valor);

    const params = new URLSearchParams();
    params.append("merchant_id", MERCHANT_ID);
    params.append("currency_code", "BRL");
    params.append("amount", valor);
    params.append("signature", signature);

    const response = await fetch("https://expaybrasil.com/en/purchase/link", {
      method: "POST",
      body: params
    });

    const text = await response.text();
    console.log("RESPOSTA:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.json({ erro: "Resposta não é JSON", raw: text });
    }

    if (!data.emv) {
      return res.json({ erro: "Pix não gerado", data });
    }

    res.json({
      copiaECola: data.emv
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro interno" });
  }
});

app.listen(3000, () => console.log("rodando"));
