import express, { Request, Response } from "express";

const app = express();
const port = 3001;

app.get("/", (req: Request, res: Response): void => {
  res.send("Hello World!");
});

app.get("/api", (req: Request, res: Response): void => {
  res.send("You have reached the API!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
