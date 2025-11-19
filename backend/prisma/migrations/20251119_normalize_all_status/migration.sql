-- Normalizar todos los valores de status en la tabla tasks
-- Reemplazar 'in_progress' (guion bajo) con 'in-progress' (guion)
UPDATE "tasks" SET "status" = 'in-progress' WHERE "status" = 'in_progress';
