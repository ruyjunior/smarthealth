-- Módulo de atendimento presencial (totem + telão): fila de senhas.
--
-- O repositório não tem ferramenta de migration (nem Prisma, nem Drizzle, nem
-- runner do Next). Aplique este arquivo à mão, uma vez por ambiente, pelo SQL
-- editor do Neon ou pela linha de comando:
--
--   psql "$POSTGRES_URL" -f db/migrations/0001_attendance.sql
--
-- O script é idempotente (CREATE ... IF NOT EXISTS), logo pode ser reaplicado
-- sem erro. `gen_random_uuid()` é nativo desde o PostgreSQL 13 (versão mínima do
-- Neon), então não é preciso habilitar a extensão pgcrypto.
--
-- Nenhuma FOREIGN KEY é declarada por decisão de projeto: a integridade entre
-- clínicas é verificada nas próprias queries com EXISTS (... AND idclinic = ...),
-- como no resto do schema `smarthealth`.
--
-- As colunas de id (`idclinic`, `idclient`, `idtype`, `idoffice`, `iduser`,
-- `idqueue`) são `uuid`, o mesmo tipo das colunas equivalentes do schema que já
-- existe (`clients.id`, `types.id`, `offices.id`, `users.id`, `*.idclinic`). Com
-- `text` os LEFT JOIN da fila falhariam em produção com
-- "operator does not exist: text = uuid".
--
-- O CHECK de `queues.status` espelha a const `QUEUE_STATUSES` de
-- `app/domains/queues/types.ts`, que é a fonte da verdade: um status novo precisa
-- ser adicionado nos dois lugares.

CREATE TABLE IF NOT EXISTS smarthealth.devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idclinic uuid NOT NULL,
  label text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('totem', 'painel')),
  token_hash text NOT NULL UNIQUE,
  createdat timestamptz NOT NULL DEFAULT now(),
  lastseenat timestamptz,
  revokedat timestamptz
);

CREATE INDEX IF NOT EXISTS devices_idclinic_idx ON smarthealth.devices (idclinic);

-- Contador por clínica/dia/prefixo: o upsert atômico nesta tabela é o que garante
-- que duas senhas emitidas ao mesmo tempo nunca recebam o mesmo número.
CREATE TABLE IF NOT EXISTS smarthealth.queuecounters (
  idclinic uuid NOT NULL,
  day date NOT NULL,
  prefix text NOT NULL,
  last integer NOT NULL DEFAULT 0,
  PRIMARY KEY (idclinic, day, prefix)
);

CREATE TABLE IF NOT EXISTS smarthealth.queues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idclinic uuid NOT NULL,
  day date NOT NULL,
  idclient uuid,
  cpf text NOT NULL,
  idtype uuid NOT NULL,
  idoffice uuid,
  iduser uuid,
  code text NOT NULL,
  priority boolean NOT NULL DEFAULT false,
  priorityreason text,
  status text NOT NULL CHECK (
    status IN ('Aguardando', 'Chamada', 'EmAtendimento', 'Finalizada', 'Ausente', 'Cancelada')
  ),
  deviceid uuid,
  createdat timestamptz NOT NULL DEFAULT now(),
  calledat timestamptz,
  startedat timestamptz,
  finishedat timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS queues_idclinic_day_code_idx
  ON smarthealth.queues (idclinic, day, code);

CREATE INDEX IF NOT EXISTS queues_idclinic_day_status_createdat_idx
  ON smarthealth.queues (idclinic, day, status, createdat);

-- O totem procura o paciente por CPF a cada senha emitida: sem este índice a
-- consulta varre a tabela clients inteira.
CREATE INDEX IF NOT EXISTS clients_idclinic_cpf_idx
  ON smarthealth.clients (idclinic, cpf);

-- Trilha de auditoria do ciclo da senha: quem chamou, para qual sala e quando.
CREATE TABLE IF NOT EXISTS smarthealth.queueevents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idclinic uuid NOT NULL,
  idqueue uuid NOT NULL,
  status text NOT NULL,
  iduser uuid,
  idoffice uuid,
  at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS queueevents_idclinic_idqueue_at_idx
  ON smarthealth.queueevents (idclinic, idqueue, at);
