require('dotenv').config();
const express = require('express');
const { z } = require('zod');

const app = express();
app.use(express.json());

const User = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().nonnegative().optional(),
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/users', (req, res) => {
  const parsed = User.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
  }
  res.status(201).json(parsed.data);
});

const port = Number(process.env.PORT) || 3000;
if (require.main === module) {
  app.listen(port, () => console.log(`listening on ${port}`));
}

module.exports = app;
