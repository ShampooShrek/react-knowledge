import { app } from "./server";

const port = process.env.PORT ? Number(process.env.PORT) : 3001;

app.listen(port, () => console.log(`Backend rodando na porta ${port}`));
