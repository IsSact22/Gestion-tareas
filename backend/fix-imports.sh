#!/bin/bash

# Script para reemplazar imports y eliminar toStringId

# Reemplazar req.user._id con req.user.id
find src/interfaces/controllers src/middleware src/application -name "*.js" -type f -exec sed -i 's/req\.user\._id/req.user.id/g' {} \;

# Reemplazar entity._id con entity.id (cuidado con esto)
find src/interfaces/controllers src/application -name "*.js" -type f -exec sed -i 's/\([a-zA-Z]\+\)\._id/\1.id/g' {} \;

# Eliminar líneas con import toStringId
find src/interfaces/controllers src/middleware src/application -name "*.js" -type f -exec sed -i '/import.*toStringId/d' {} \;

# Eliminar líneas con import repositoryFactory
find src/interfaces/controllers src/middleware -name "*.js" -type f -exec sed -i '/import.*repositoryFactory/d' {} \;

echo "✅ Reemplazos completados"
