-- Create estimates table
CREATE TABLE IF NOT EXISTS estimates (
  id TEXT PRIMARY KEY,
  estimate_type TEXT NOT NULL CHECK (estimate_type IN ('Initial', 'Final')),
  claim_number TEXT NOT NULL,
  client_name TEXT NOT NULL,
  task_number TEXT NOT NULL,
  date_received DATE NOT NULL,
  time_received TIME NOT NULL,
  date_returned DATE,
  time_returned TIME,
  final_amount TEXT,
  final_amount_cents INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Done')),
  billed BOOLEAN,
  created_at_iso TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_estimates_date_returned ON estimates(date_returned);
CREATE INDEX IF NOT EXISTS idx_estimates_status ON estimates(status);
CREATE INDEX IF NOT EXISTS idx_estimates_estimate_type ON estimates(estimate_type);
CREATE INDEX IF NOT EXISTS idx_estimates_billed ON estimates(billed);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_estimates_updated_at 
    BEFORE UPDATE ON estimates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- For now, we'll allow all operations for anonymous users (you can restrict this later)
CREATE POLICY "Allow all operations for anonymous users" ON estimates
    FOR ALL USING (true);

-- Insert some sample data (optional - you can remove this if you don't want sample data)
INSERT INTO estimates (
  id, estimate_type, claim_number, client_name, task_number, 
  date_received, time_received, date_returned, time_returned, 
  final_amount, final_amount_cents, status, billed
) VALUES 
  (
    'sample-1', 'Initial', '1001', 'Acme Co', 'T-01',
    CURRENT_DATE, '09:00:00', CURRENT_DATE, '11:00:00',
    '', 0, 'Done', NULL
  ),
  (
    'sample-2', 'Final', '1002', 'Globex', 'T-02',
    CURRENT_DATE, '10:00:00', CURRENT_DATE, '14:00:00',
    '$250.00', 25000, 'Done', false
  ),
  (
    'sample-3', 'Final', '1003', 'Initech', 'T-03',
    CURRENT_DATE, '08:00:00', NULL, NULL,
    '$100.00', 10000, 'In Progress', false
  )
ON CONFLICT (id) DO NOTHING;
