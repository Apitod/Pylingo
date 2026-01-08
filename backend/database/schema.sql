-- PyLingo Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    
    -- Gamification fields
    total_xp INTEGER DEFAULT 0 CHECK (total_xp >= 0),
    current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
    longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
    last_activity_date DATE,
    
    -- Hearts/Lives system (max 5)
    hearts INTEGER DEFAULT 5 CHECK (hearts >= 0 AND hearts <= 5),
    hearts_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_total_xp ON users(total_xp DESC);
CREATE INDEX idx_users_current_streak ON users(current_streak DESC);

-- =============================================
-- COURSES TABLE
-- =============================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    order_index INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_courses_order ON courses(order_index);

-- =============================================
-- UNITS TABLE
-- =============================================
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    color VARCHAR(7) DEFAULT '#58CC02',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_units_course ON units(course_id, order_index);

-- =============================================
-- LESSONS TABLE
-- =============================================
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID NOT NULL REFERENCES units(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    xp_reward INTEGER DEFAULT 10 CHECK (xp_reward > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lessons_unit ON lessons(unit_id, order_index);

-- =============================================
-- CHALLENGES TABLE
-- =============================================
CREATE TYPE challenge_type AS ENUM ('SELECT', 'ASSIST', 'MATCH', 'FILL_BLANK');

CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    type challenge_type NOT NULL,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer VARCHAR(500) NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_challenges_lesson ON challenges(lesson_id, order_index);

-- =============================================
-- CHALLENGE PROGRESS TABLE
-- =============================================
CREATE TABLE challenge_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(user_id, challenge_id)
);

CREATE INDEX idx_progress_user ON challenge_progress(user_id);
CREATE INDEX idx_progress_challenge ON challenge_progress(challenge_id);

-- =============================================
-- USER SUBSCRIPTION TABLE
-- =============================================
CREATE TYPE subscription_plan AS ENUM ('FREE', 'PLUS', 'FAMILY');

CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_type subscription_plan DEFAULT 'FREE',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
