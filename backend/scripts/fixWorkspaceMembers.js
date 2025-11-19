/**
 * Script para agregar el owner como member en workspaces existentes
 * 
 * Ejecutar con: node scripts/fixWorkspaceMembers.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.join(__dirname, '../.env') });

// Conectar a MongoDB
const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL || process.env.MONGODB_URI;
    
    if (!dbUrl) {
      console.error('❌ Error: DB_URL no está definida en .env');
      console.log('💡 Asegúrate de tener un archivo .env con DB_URL=tu_mongodb_uri');
      process.exit(1);
    }
    
    await mongoose.connect(dbUrl);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Definir el schema de Workspace
const workspaceSchema = new mongoose.Schema({
  name: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member', 'viewer'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  createdAt: Date,
  updatedAt: Date
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

// Función principal
async function fixWorkspaceMembers() {
  try {
    await connectDB();

    console.log('\n🔍 Buscando workspaces sin members...\n');

    // Buscar workspaces donde el owner no está en members
    const workspaces = await Workspace.find();

    let fixed = 0;
    let skipped = 0;

    for (const workspace of workspaces) {
      // Verificar si el owner ya está en members
      const ownerIsMember = workspace.members.some(
        m => m.user.toString() === workspace.owner.toString()
      );

      if (!ownerIsMember) {
        // Agregar el owner como admin
        workspace.members.push({
          user: workspace.owner,
          role: 'admin',
          joinedAt: workspace.createdAt || new Date()
        });

        await workspace.save();
        console.log(`✅ Fixed workspace: ${workspace.name} (ID: ${workspace.id})`);
        console.log(`   Owner ${workspace.owner} agregado como admin\n`);
        fixed++;
      } else {
        console.log(`⏭️  Skipped workspace: ${workspace.name} (owner ya es member)`);
        skipped++;
      }
    }

    console.log('\n📊 Resumen:');
    console.log(`   Total workspaces: ${workspaces.length}`);
    console.log(`   Arreglados: ${fixed}`);
    console.log(`   Omitidos: ${skipped}`);
    console.log('\n✅ Script completado!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Ejecutar
fixWorkspaceMembers();
