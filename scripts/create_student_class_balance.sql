-- Create student_class_balance table to track remaining classes
CREATE TABLE IF NOT EXISTS public.student_class_balance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  total_classes INTEGER NOT NULL DEFAULT 0,
  used_classes INTEGER NOT NULL DEFAULT 0,
  remaining_classes INTEGER GENERATED ALWAYS AS (total_classes - used_classes) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id)
);

-- Create student_orders table to track purchases
CREATE TABLE IF NOT EXISTS public.student_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  package_name TEXT NOT NULL,
  classes_purchased INTEGER NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies for student_class_balance
ALTER TABLE public.student_class_balance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view class balance (SELECT)"
  ON public.student_class_balance FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert class balance (INSERT)"
  ON public.student_class_balance FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update class balance (UPDATE)"
  ON public.student_class_balance FOR UPDATE
  USING (true);

-- RLS policies for student_orders
ALTER TABLE public.student_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view orders (SELECT)"
  ON public.student_orders FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert orders (INSERT)"
  ON public.student_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update orders (UPDATE)"
  ON public.student_orders FOR UPDATE
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_student_class_balance_student_id ON public.student_class_balance(student_id);
CREATE INDEX IF NOT EXISTS idx_student_orders_student_id ON public.student_orders(student_id);
CREATE INDEX IF NOT EXISTS idx_student_orders_status ON public.student_orders(status);
