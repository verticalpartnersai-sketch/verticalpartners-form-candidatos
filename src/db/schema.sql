-- ============================================================
-- Tabela: hiring_applications
-- Formulario de Contratacao - Vertical Partners
-- Executar manualmente no Supabase Dashboard (SQL Editor)
-- ============================================================

CREATE TABLE IF NOT EXISTS hiring_applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Cargo e status
  position        TEXT NOT NULL CHECK (position IN ('gestor-trafego', 'cs-suporte', 'dev-senior-fullstack')),
  status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'approved', 'rejected', 'interview')),

  -- Dados pessoais (obrigatorios)
  full_name           TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT NOT NULL,
  linkedin            TEXT NOT NULL,
  city                TEXT NOT NULL,
  salary_expectation  TEXT NOT NULL,

  -- Campos especificos por cargo (opcionais)
  github         TEXT,
  portfolio      TEXT,
  availability   TEXT,

  -- Respostas do formulario
  answers        JSONB NOT NULL DEFAULT '{}',

  -- DISC
  disc_responses JSONB NOT NULL DEFAULT '[]',
  disc_scores    JSONB NOT NULL DEFAULT '{}',
  disc_profile   TEXT,

  -- Admin
  admin_notes    TEXT,
  admin_rating   INTEGER CHECK (admin_rating IS NULL OR (admin_rating >= 1 AND admin_rating <= 5)),
  reviewed_at    TIMESTAMPTZ,
  reviewed_by    UUID,

  -- Metadata
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_agent     TEXT
);

-- ============================================================
-- Indices
-- ============================================================

CREATE INDEX idx_hiring_applications_position
  ON hiring_applications (position);

CREATE INDEX idx_hiring_applications_status
  ON hiring_applications (status);

CREATE INDEX idx_hiring_applications_created_at
  ON hiring_applications (created_at DESC);

-- ============================================================
-- Privileges (necessario alem das RLS policies)
-- ============================================================

GRANT ALL ON hiring_applications TO anon;
GRANT ALL ON hiring_applications TO authenticated;

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE hiring_applications ENABLE ROW LEVEL SECURITY;

-- INSERT: anon pode inserir (formulario publico)
CREATE POLICY "Allow public insert"
  ON hiring_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- INSERT: authenticated tambem pode inserir
-- (client Supabase compartilha sessao — admin logado envia requests como authenticated)
CREATE POLICY "Allow authenticated insert"
  ON hiring_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- SELECT: apenas usuarios autenticados (admin)
CREATE POLICY "Allow authenticated select"
  ON hiring_applications
  FOR SELECT
  TO authenticated
  USING (true);

-- UPDATE: apenas usuarios autenticados (admin)
CREATE POLICY "Allow authenticated update"
  ON hiring_applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
