import { createServer } from 'http';
import app from "./app.js";
import config from "./config/index.js";
import { initializeSocket } from "./socket/index.js";

const PORT = config.port || 3000;

// Crear servidor HTTP
const server = createServer(app);

// Inicializar Socket.IO
const io = initializeSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.env}`);
  console.log(`🔌 Socket.IO initialized`);
});