import app from './app.js';
import ensureDatabase from './db-setup.js';

ensureDatabase();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
