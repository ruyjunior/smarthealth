-- Código de pareamento curto, digitável no controle remoto de uma TV.
--
-- Antes o dispositivo nascia com um token de 32 bytes (43 caracteres) que era, ao
-- mesmo tempo, o código a digitar e a credencial da sessão. Isso é impossível de
-- digitar em uma TV e, se encurtado, viraria um segredo fraco e permanente.
--
-- Agora são dois segredos com papéis distintos:
--   * `pairingcodehash` — código curto, de uso único e validade de 15 minutos,
--     feito só para parear (o técnico digita na TV);
--   * `token_hash` — token de 32 bytes gerado NO MOMENTO do pareamento, que é a
--     credencial de sessão lida por `getDeviceSession`.
-- Por isso `token_hash` passa a aceitar NULL: um dispositivo recém-criado ainda
-- não tem sessão.
--
-- Aplicar com: psql "$POSTGRES_URL" -f db/migrations/0002_device_pairing_codes.sql
-- (o script é idempotente e pode ser reaplicado).

ALTER TABLE smarthealth.devices ALTER COLUMN token_hash DROP NOT NULL;

ALTER TABLE smarthealth.devices ADD COLUMN IF NOT EXISTS pairingcodehash text;
ALTER TABLE smarthealth.devices ADD COLUMN IF NOT EXISTS pairingexpiresat timestamptz;

-- O pareamento procura pelo hash do código: este índice mantém a busca pontual
-- (e o código deixa de ser varredura de tabela).
CREATE INDEX IF NOT EXISTS devices_pairingcodehash_idx
  ON smarthealth.devices (pairingcodehash);
