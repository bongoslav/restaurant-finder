import app from "./app";

if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
  });
}

export default app