@echo off
cd /d "%~dp0"
git mv src/infrastructure/database/prisma/activityRepository.js src/infrastructure/database/prisma/ActivityRepository_temp.js
git mv src/infrastructure/database/prisma/ActivityRepository_temp.js src/infrastructure/database/prisma/ActivityRepository.js
git mv src/infrastructure/database/prisma/teamRepository.js src/infrastructure/database/prisma/TeamRepository_temp.js
git mv src/infrastructure/database/prisma/TeamRepository_temp.js src/infrastructure/database/prisma/TeamRepository.js
git mv src/infrastructure/database/prisma/userRepository.js src/infrastructure/database/prisma/UserRepository_temp.js
git mv src/infrastructure/database/prisma/UserRepository_temp.js src/infrastructure/database/prisma/UserRepository.js
echo Archivos renombrados correctamente
pause
