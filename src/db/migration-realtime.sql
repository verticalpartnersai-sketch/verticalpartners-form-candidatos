-- ============================================================
-- Migration: Real-time Sync (Draft Support)
-- Formulario de Contratacao - Vertical Partners
-- Executar manualmente no Supabase Dashboard (SQL Editor)
-- ============================================================

-- 1. Adicionar 'draft' ao CHECK constraint de status
ALTER TABLE hiring_applications DROP CONSTRAINT IF EXISTS hiring_applications_status_check;
ALTER TABLE hiring_applications ADD CONSTRAINT hiring_applications_status_check
  CHECK (status IN ('draft', 'new', 'reviewed', 'approved', 'rejected', 'interview'));

-- 2. Defaults para campos obrigatorios (drafts comecam com strings vazias)
ALTER TABLE hiring_applications ALTER COLUMN full_name SET DEFAULT '';
ALTER TABLE hiring_applications ALTER COLUMN email SET DEFAULT '';
ALTER TABLE hiring_applications ALTER COLUMN phone SET DEFAULT '';
ALTER TABLE hiring_applications ALTER COLUMN linkedin SET DEFAULT '';
ALTER TABLE hiring_applications ALTER COLUMN city SET DEFAULT '';
ALTER TABLE hiring_applications ALTER COLUMN salary_expectation SET DEFAULT '';

-- 3. submitted_at pode ser NULL em drafts (ainda nao foram submetidos)
ALTER TABLE hiring_applications ALTER COLUMN submitted_at DROP NOT NULL;
ALTER TABLE hiring_applications ALTER COLUMN submitted_at DROP DEFAULT;

-- 4. Privileges: ambas as roles precisam de permissoes na tabela
--    (RLS policies sozinhas nao bastam — PostgreSQL exige GRANT + policy)
GRANT ALL ON hiring_applications TO anon;
GRANT ALL ON hiring_applications TO authenticated;

-- 5. RLS: anon pode UPDATE registros com status='draft'
--    WITH CHECK permite que o status mude de 'draft' para 'new' (finalizacao)
CREATE POLICY "Allow anon update own drafts"
  ON hiring_applications
  FOR UPDATE
  TO anon
  USING (status = 'draft')
  WITH CHECK (status IN ('draft', 'new'));

-- 6. RLS: authenticated tambem pode INSERT (admin logado no mesmo client Supabase)
--    O client JS compartilha sessao — se admin logou, ate paginas publicas
--    enviam requests como authenticated, nao anon.
CREATE POLICY "Allow authenticated insert"
  ON hiring_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
