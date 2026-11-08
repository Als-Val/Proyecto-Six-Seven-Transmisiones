-- CreateEnum
CREATE TYPE "TipoServicio" AS ENUM ('BASICO', 'COMPLEJO');

-- CreateEnum
CREATE TYPE "EstadoTransmision" AS ENUM ('COTIZADO', 'AUTORIZADO_TERRENO', 'FINALIZADA', 'RECHAZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "AccionTransmision" AS ENUM ('CREACION', 'EDICION', 'AUTORIZACION', 'RECHAZO', 'CANCELACION', 'CIERRE');

-- CreateEnum
CREATE TYPE "TipoCobro" AS ENUM ('GARANTIA', 'SALDO');

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "razonSocial" VARCHAR(150) NOT NULL,
    "rut" VARCHAR(12),
    "contacto" VARCHAR(100),
    "telefono" VARCHAR(20),
    "email" VARCHAR(150),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recintos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "direccion" VARCHAR(200) NOT NULL,
    "comuna" VARCHAR(60) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recintos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funciones" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(40) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "funciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarifas" (
    "id" SERIAL NOT NULL,
    "tarifaBaseBasico" INTEGER NOT NULL,
    "tarifaBaseComplejo" INTEGER NOT NULL,
    "valorHora" INTEGER NOT NULL,
    "valorPersona" INTEGER NOT NULL,
    "valorKit" INTEGER NOT NULL,
    "recargoKitNuevoPct" SMALLINT NOT NULL,
    "vigenteDesde" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creadoPorId" INTEGER NOT NULL,

    CONSTRAINT "tarifas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transmisiones" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "recintoId" INTEGER NOT NULL,
    "tarifaId" INTEGER NOT NULL,
    "tipoServicio" "TipoServicio" NOT NULL,
    "inicio" TIMESTAMPTZ(3) NOT NULL,
    "duracionMin" INTEGER NOT NULL,
    "cantidadKits" SMALLINT NOT NULL,
    "kitsUltimaGeneracion" SMALLINT NOT NULL DEFAULT 0,
    "observacionEquipos" TEXT,
    "valorCotizado" INTEGER NOT NULL,
    "estado" "EstadoTransmision" NOT NULL DEFAULT 'COTIZADO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transmisiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requerimientos_personal" (
    "transmisionId" INTEGER NOT NULL,
    "funcionId" INTEGER NOT NULL,
    "cantidad" SMALLINT NOT NULL,

    CONSTRAINT "requerimientos_personal_pkey" PRIMARY KEY ("transmisionId","funcionId")
);

-- CreateTable
CREATE TABLE "historial_transmisiones" (
    "id" SERIAL NOT NULL,
    "transmisionId" INTEGER NOT NULL,
    "accion" "AccionTransmision" NOT NULL,
    "estadoNuevo" "EstadoTransmision" NOT NULL,
    "motivo" VARCHAR(300),
    "usuarioId" INTEGER NOT NULL,
    "fechaHora" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(45) NOT NULL,

    CONSTRAINT "historial_transmisiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cobros" (
    "id" SERIAL NOT NULL,
    "transmisionId" INTEGER NOT NULL,
    "tipo" "TipoCobro" NOT NULL,
    "monto" INTEGER NOT NULL,
    "fechaPago" DATE NOT NULL,
    "comprobanteUrl" VARCHAR(255) NOT NULL,
    "registradoPorId" INTEGER NOT NULL,
    "registradoEn" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(45) NOT NULL,

    CONSTRAINT "cobros_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_rut_key" ON "clientes"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "funciones_nombre_key" ON "funciones"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "tarifas_vigenteDesde_key" ON "tarifas"("vigenteDesde");

-- CreateIndex
CREATE INDEX "transmisiones_inicio_idx" ON "transmisiones"("inicio");

-- CreateIndex
CREATE INDEX "transmisiones_estado_inicio_idx" ON "transmisiones"("estado", "inicio");

-- CreateIndex
CREATE INDEX "historial_transmisiones_transmisionId_fechaHora_idx" ON "historial_transmisiones"("transmisionId", "fechaHora");

-- CreateIndex
CREATE INDEX "cobros_transmisionId_tipo_idx" ON "cobros"("transmisionId", "tipo");

-- AddForeignKey
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transmisiones" ADD CONSTRAINT "transmisiones_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transmisiones" ADD CONSTRAINT "transmisiones_recintoId_fkey" FOREIGN KEY ("recintoId") REFERENCES "recintos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transmisiones" ADD CONSTRAINT "transmisiones_tarifaId_fkey" FOREIGN KEY ("tarifaId") REFERENCES "tarifas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requerimientos_personal" ADD CONSTRAINT "requerimientos_personal_transmisionId_fkey" FOREIGN KEY ("transmisionId") REFERENCES "transmisiones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requerimientos_personal" ADD CONSTRAINT "requerimientos_personal_funcionId_fkey" FOREIGN KEY ("funcionId") REFERENCES "funciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_transmisiones" ADD CONSTRAINT "historial_transmisiones_transmisionId_fkey" FOREIGN KEY ("transmisionId") REFERENCES "transmisiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_transmisiones" ADD CONSTRAINT "historial_transmisiones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobros" ADD CONSTRAINT "cobros_transmisionId_fkey" FOREIGN KEY ("transmisionId") REFERENCES "transmisiones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobros" ADD CONSTRAINT "cobros_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- =====================================================================================
-- Reglas que Prisma no puede expresar. La justificación está en el documento del modelo.
-- =====================================================================================

-- Dominio de los datos
ALTER TABLE "transmisiones"
  ADD CONSTRAINT "tx_duracion" CHECK ("duracionMin" > 0 AND "duracionMin" <= 1440 AND "duracionMin" % 30 = 0),
  ADD CONSTRAINT "tx_kits" CHECK ("cantidadKits" >= 1 AND "kitsUltimaGeneracion" BETWEEN 0 AND "cantidadKits"),
  ADD CONSTRAINT "tx_valor" CHECK ("valorCotizado" > 0);
ALTER TABLE "requerimientos_personal" ADD CONSTRAINT "req_cantidad" CHECK ("cantidad" > 0);
ALTER TABLE "cobros" ADD CONSTRAINT "cobro_monto" CHECK ("monto" > 0);
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifa_valores" CHECK (
  "tarifaBaseBasico" >= 0 AND "tarifaBaseComplejo" >= 0 AND "valorHora" >= 0
  AND "valorPersona" >= 0 AND "valorKit" >= 0 AND "recargoKitNuevoPct" BETWEEN 0 AND 100);
ALTER TABLE "historial_transmisiones"
  ADD CONSTRAINT "hist_motivo" CHECK (
    "accion" NOT IN ('RECHAZO', 'CANCELACION') OR length(btrim(coalesce("motivo", ''))) > 0),
  ADD CONSTRAINT "hist_accion_estado" CHECK (
    ("accion", "estadoNuevo") IN (
      ('CREACION', 'COTIZADO'), ('EDICION', 'COTIZADO'),
      ('AUTORIZACION', 'AUTORIZADO_TERRENO'), ('RECHAZO', 'RECHAZADA'),
      ('CANCELACION', 'CANCELADA'), ('CIERRE', 'FINALIZADA')));

-- Unicidad que Prisma no expresa
CREATE UNIQUE INDEX "recintos_nombre_comuna_key" ON "recintos" (lower("nombre"), lower("comuna"));
CREATE UNIQUE INDEX "historial_una_creacion" ON "historial_transmisiones" ("transmisionId")
  WHERE "accion" = 'CREACION';

-- Toda transmisión nace cotizada
CREATE FUNCTION validar_alta_transmision() RETURNS trigger AS $$
BEGIN
  IF NEW."estado" <> 'COTIZADO' THEN
    RAISE EXCEPTION 'Una transmisión debe crearse en estado COTIZADO';
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "tx_alta" BEFORE INSERT ON "transmisiones"
  FOR EACH ROW EXECUTE FUNCTION validar_alta_transmision();

-- Solo se edita en COTIZADO, solo transiciones válidas y garantía antes de autorizar (RF10)
CREATE FUNCTION validar_cambio_transmision() RETURNS trigger AS $$
DECLARE pagado bigint;
BEGIN
  IF OLD."estado" <> 'COTIZADO'
     AND (to_jsonb(NEW) - 'estado' - 'updatedAt') IS DISTINCT FROM (to_jsonb(OLD) - 'estado' - 'updatedAt') THEN
    RAISE EXCEPTION 'Solo se puede editar una transmisión en estado COTIZADO';
  END IF;

  IF NEW."estado" = OLD."estado" THEN RETURN NEW; END IF;

  IF NOT ((OLD."estado", NEW."estado") IN (
      ('COTIZADO', 'AUTORIZADO_TERRENO'), ('COTIZADO', 'RECHAZADA'),
      ('AUTORIZADO_TERRENO', 'FINALIZADA'), ('AUTORIZADO_TERRENO', 'CANCELADA'))) THEN
    RAISE EXCEPTION 'Transición no permitida: % -> %', OLD."estado", NEW."estado";
  END IF;

  IF NEW."estado" = 'AUTORIZADO_TERRENO' AND NEW."duracionMin" > 300 THEN
    SELECT COALESCE(SUM("monto"), 0) INTO pagado FROM "cobros"
      WHERE "transmisionId" = NEW."id" AND "tipo" = 'GARANTIA';
    IF pagado < ROUND(NEW."valorCotizado" / 2.0) THEN
      RAISE EXCEPTION 'Garantía pendiente';
    END IF;
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "tx_cambio" BEFORE UPDATE ON "transmisiones"
  FOR EACH ROW EXECUTE FUNCTION validar_cambio_transmision();

-- El personal requerido tampoco cambia fuera de COTIZADO
CREATE FUNCTION validar_cambio_requerimiento() RETURNS trigger AS $$
DECLARE estado_actual "EstadoTransmision";
BEGIN
  SELECT "estado" INTO estado_actual FROM "transmisiones"
    WHERE "id" = CASE WHEN TG_OP = 'DELETE' THEN OLD."transmisionId" ELSE NEW."transmisionId" END;
  IF estado_actual IS NOT NULL AND estado_actual <> 'COTIZADO' THEN
    RAISE EXCEPTION 'Solo se puede editar una transmisión en estado COTIZADO';
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "req_cambio" BEFORE INSERT OR UPDATE OR DELETE ON "requerimientos_personal"
  FOR EACH ROW EXECUTE FUNCTION validar_cambio_requerimiento();

-- Garantía: solo si se exige, en COTIZADO y por el monto exacto que falta (RF09).
-- FOR UPDATE ordena los registros simultáneos, para que dos pagos no sumen de más.
CREATE FUNCTION validar_garantia() RETURNS trigger AS $$
DECLARE
  tx "transmisiones"%ROWTYPE;
  pagado bigint;
  faltante bigint;
BEGIN
  IF NEW."tipo" <> 'GARANTIA' THEN RETURN NEW; END IF;

  SELECT * INTO tx FROM "transmisiones" WHERE "id" = NEW."transmisionId" FOR UPDATE;
  IF NOT FOUND THEN RETURN NEW; END IF;  -- la FK responde el error
  IF tx."estado" <> 'COTIZADO' THEN
    RAISE EXCEPTION 'La garantía solo se registra en estado COTIZADO';
  END IF;
  IF tx."duracionMin" <= 300 THEN
    RAISE EXCEPTION 'Esta transmisión no requiere garantía';
  END IF;

  SELECT COALESCE(SUM("monto"), 0) INTO pagado FROM "cobros"
    WHERE "transmisionId" = tx."id" AND "tipo" = 'GARANTIA';
  faltante := ROUND(tx."valorCotizado" / 2.0) - pagado;
  IF faltante <= 0 THEN
    RAISE EXCEPTION 'La garantía ya está pagada';
  END IF;
  IF NEW."monto" <> faltante THEN
    RAISE EXCEPTION 'El monto de la garantía debe ser exactamente %', faltante;
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "cobro_garantia" BEFORE INSERT ON "cobros"
  FOR EACH ROW EXECUTE FUNCTION validar_garantia();

-- Lo que ya ocurrió no se reescribe (§6.4)
CREATE FUNCTION rechazar_modificacion() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'Los registros de % no se pueden modificar ni borrar', TG_TABLE_NAME;
END $$ LANGUAGE plpgsql;
CREATE TRIGGER "hist_inmutable" BEFORE UPDATE OR DELETE ON "historial_transmisiones"
  FOR EACH ROW EXECUTE FUNCTION rechazar_modificacion();
CREATE TRIGGER "tarifa_inmutable" BEFORE UPDATE OR DELETE ON "tarifas"
  FOR EACH ROW EXECUTE FUNCTION rechazar_modificacion();
CREATE TRIGGER "cobro_inmutable" BEFORE UPDATE OR DELETE ON "cobros"
  FOR EACH ROW EXECUTE FUNCTION rechazar_modificacion();

-- Al confirmar la transacción: debe existir la fila CREACION, que es la única fuente del
-- autor, la última fila del historial debe coincidir con el estado, y debe pedirse personal.
CREATE FUNCTION verificar_coherencia_transmision() RETURNS trigger AS $$
DECLARE
  tx_id int;
  estado_actual "EstadoTransmision";
  ultimo "EstadoTransmision";
BEGIN
  IF TG_TABLE_NAME = 'transmisiones' THEN tx_id := NEW."id";
  ELSIF TG_OP = 'DELETE' THEN tx_id := OLD."transmisionId";
  ELSE tx_id := NEW."transmisionId";
  END IF;

  SELECT "estado" INTO estado_actual FROM "transmisiones" WHERE "id" = tx_id;
  IF NOT FOUND THEN RETURN NULL; END IF;

  IF NOT EXISTS (SELECT 1 FROM "historial_transmisiones"
                 WHERE "transmisionId" = tx_id AND "accion" = 'CREACION') THEN
    RAISE EXCEPTION 'La transmisión % no tiene su fila CREACION en el historial', tx_id;
  END IF;

  SELECT "estadoNuevo" INTO ultimo FROM "historial_transmisiones"
    WHERE "transmisionId" = tx_id ORDER BY "id" DESC LIMIT 1;
  IF ultimo <> estado_actual THEN
    RAISE EXCEPTION 'El historial de la transmisión % termina en % y su estado es %', tx_id, ultimo, estado_actual;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM "requerimientos_personal" WHERE "transmisionId" = tx_id) THEN
    RAISE EXCEPTION 'La transmisión % no indica personal requerido', tx_id;
  END IF;
  RETURN NULL;
END $$ LANGUAGE plpgsql;
CREATE CONSTRAINT TRIGGER "tx_coherencia" AFTER INSERT OR UPDATE ON "transmisiones"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION verificar_coherencia_transmision();
CREATE CONSTRAINT TRIGGER "hist_coherencia" AFTER INSERT ON "historial_transmisiones"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION verificar_coherencia_transmision();
CREATE CONSTRAINT TRIGGER "req_coherencia" AFTER DELETE ON "requerimientos_personal"
  DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION verificar_coherencia_transmision();
