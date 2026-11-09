git switch --track origin/feature/inventario-base-datos-- CreateEnum
CREATE TYPE "EstadoEquipo" AS ENUM ('BUENO', 'EN_REPARACION', 'INHABILITADO');

-- CreateEnum
CREATE TYPE "TipoEquipo" AS ENUM ('CAMARA', 'TRIPODE', 'MICROFONO', 'PANEL_SONIDO', 'CABLE', 'PANEL_SWITCH', 'OTRO');

-- CreateTable
CREATE TABLE "Equipo" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER,
    "precioCompra" DECIMAL(12,0) NOT NULL,
    "tipo" "TipoEquipo" NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoEquipo" NOT NULL DEFAULT 'BUENO',
    "archivadoAt" TIMESTAMP(3),
    "kitId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kit" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReparacionEquipo" (
    "id" TEXT NOT NULL,
    "equipoId" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "costo" DECIMAL(12,0),
    "descripcion" TEXT,

    CONSTRAINT "ReparacionEquipo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipo_codigo_key" ON "Equipo"("codigo");

-- CreateIndex
CREATE INDEX "Equipo_nombre_idx" ON "Equipo"("nombre");

-- CreateIndex
CREATE INDEX "Equipo_tipo_idx" ON "Equipo"("tipo");

-- CreateIndex
CREATE INDEX "Equipo_kitId_idx" ON "Equipo"("kitId");

-- CreateIndex
CREATE INDEX "Equipo_estado_idx" ON "Equipo"("estado");

-- CreateIndex
CREATE INDEX "ReparacionEquipo_equipoId_fechaInicio_idx" ON "ReparacionEquipo"("equipoId", "fechaInicio");

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_kitId_fkey" FOREIGN KEY ("kitId") REFERENCES "Kit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReparacionEquipo" ADD CONSTRAINT "ReparacionEquipo_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
