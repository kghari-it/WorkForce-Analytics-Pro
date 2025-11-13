-- WorkForce Analytics Pro - Database Setup Script
-- Run this in your Supabase SQL Editor to set up the database

-- Drop existing tables if they exist (optional - comment out if you want to keep existing data)
-- DROP TABLE IF EXISTS worker_records CASCADE;
-- DROP TABLE IF EXISTS worker_settings CASCADE;

-- Create worker_settings table
CREATE TABLE IF NOT EXISTS worker_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  worker_id text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, worker_id)
);

-- Create worker_records table
CREATE TABLE IF NOT EXISTS worker_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  worker_id text NOT NULL,
  worker_name text NOT NULL,
  worked boolean NOT NULL DEFAULT false,
  sheets_tapped integer NOT NULL DEFAULT 0,
  salary integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_worker_settings_user_id ON worker_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_worker_settings_worker_id ON worker_settings(user_id, worker_id);
CREATE INDEX IF NOT EXISTS idx_worker_records_user_id ON worker_records(user_id);
CREATE INDEX IF NOT EXISTS idx_worker_records_date ON worker_records(user_id, date);
CREATE INDEX IF NOT EXISTS idx_worker_records_worker_id ON worker_records(user_id, worker_id);

-- Enable Row Level Security
ALTER TABLE worker_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_records ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for worker_settings table
CREATE POLICY "Users can select own worker settings"
  ON worker_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own worker settings"
  ON worker_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own worker settings"
  ON worker_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own worker settings"
  ON worker_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create RLS Policies for worker_records table
CREATE POLICY "Users can select own worker records"
  ON worker_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own worker records"
  ON worker_records FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own worker records"
  ON worker_records FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own worker records"
  ON worker_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
