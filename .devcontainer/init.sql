-- Initialize database schema for the application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create user_credits table
CREATE TABLE IF NOT EXISTS public.user_credits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    balance NUMERIC DEFAULT 100 NOT NULL,
    lifetime_purchased NUMERIC DEFAULT 0 NOT NULL,
    lifetime_used NUMERIC DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan_id TEXT,
    status TEXT,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    monthly_credits NUMERIC DEFAULT 0,
    credits_reset_at TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create credit_transactions table
CREATE TABLE IF NOT EXISTS public.credit_transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    amount NUMERIC NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    metadata JSONB,
    balance_after NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_credits
CREATE POLICY "Users can view their own credits" ON public.user_credits
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" ON public.user_credits
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policies for credit_transactions
CREATE POLICY "Users can view their own transactions" ON public.credit_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Create function to deduct credits
CREATE OR REPLACE FUNCTION deduct_credits(
    p_user_id UUID,
    p_amount NUMERIC,
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    current_balance NUMERIC;
    new_balance NUMERIC;
BEGIN
    -- Get current balance
    SELECT balance INTO current_balance
    FROM public.user_credits
    WHERE user_id = p_user_id;

    IF current_balance IS NULL THEN
        RAISE EXCEPTION 'User credits record not found';
    END IF;

    IF current_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient credits';
    END IF;

    -- Calculate new balance
    new_balance := current_balance - p_amount;

    -- Update user credits
    UPDATE public.user_credits
    SET balance = new_balance,
        lifetime_used = lifetime_used + p_amount,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- Insert transaction record
    INSERT INTO public.credit_transactions (
        user_id,
        amount,
        type,
        description,
        metadata,
        balance_after
    ) VALUES (
        p_user_id,
        -p_amount,
        'usage',
        p_description,
        p_metadata,
        new_balance
    );

    RETURN json_build_object(
        'success', true,
        'new_balance', new_balance,
        'transaction_id', (SELECT currval('credit_transactions_id_seq'))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add credits
CREATE OR REPLACE FUNCTION add_credits(
    p_user_id UUID,
    p_amount NUMERIC,
    p_type TEXT,
    p_description TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    current_balance NUMERIC;
    new_balance NUMERIC;
BEGIN
    -- Get or create user credits record
    INSERT INTO public.user_credits (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    -- Get current balance
    SELECT balance INTO current_balance
    FROM public.user_credits
    WHERE user_id = p_user_id;

    -- Calculate new balance
    new_balance := current_balance + p_amount;

    -- Update user credits
    UPDATE public.user_credits
    SET balance = new_balance,
        lifetime_purchased = lifetime_purchased + CASE WHEN p_type = 'purchase' THEN p_amount ELSE 0 END,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- Insert transaction record
    INSERT INTO public.credit_transactions (
        user_id,
        amount,
        type,
        description,
        metadata,
        balance_after
    ) VALUES (
        p_user_id,
        p_amount,
        p_type,
        p_description,
        p_metadata,
        new_balance
    );

    RETURN json_build_object(
        'success', true,
        'new_balance', new_balance,
        'transaction_id', (SELECT currval('credit_transactions_id_seq'))
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.user_credits TO anon, authenticated;
GRANT ALL ON public.subscriptions TO anon, authenticated;
GRANT ALL ON public.credit_transactions TO anon, authenticated;
GRANT EXECUTE ON FUNCTION deduct_credits(UUID, NUMERIC, TEXT, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION add_credits(UUID, NUMERIC, TEXT, TEXT, JSONB) TO anon, authenticated;
