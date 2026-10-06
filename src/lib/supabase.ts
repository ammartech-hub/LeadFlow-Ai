import React, { createContext, useContext, useMemo } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables for Supabase configuration
const envSupabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const envSupabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/**
 * Safely decodes JWT payload to extract project ref if available
 */
function getRefFromJwt(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length >= 2) {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonStr = typeof atob !== 'undefined'
        ? atob(base64)
        : Buffer.from(base64, 'base64').toString('utf-8');
      const payload = JSON.parse(jsonStr);
      if (payload && typeof payload.ref === 'string') {
        return payload.ref;
      }
    }
  } catch {
    // Ignore decode errors
  }
  return null;
}

/**
 * Resolves a valid HTTPS Supabase URL, auto-correcting project ref or recovering from JWT
 */
function resolveSupabaseUrl(rawUrl: string, rawKey: string): { url: string; isValid: boolean } {
  const trimmed = (rawUrl || '').trim();

  // If already full http(s) URL
  if (/^https?:\/\//i.test(trimmed)) {
    return { url: trimmed, isValid: true };
  }

  // If user passed bare project ID/ref (e.g. 'yozerhphkjcsdydycoeb')
  if (/^[a-z0-9_-]{12,45}$/i.test(trimmed) && !trimmed.startsWith('sb_publishable_')) {
    return { url: `https://${trimmed}.supabase.co`, isValid: true };
  }

  // If URL was misconfigured or passed publishable key, extract ref from JWT anon key
  const ref = getRefFromJwt(rawKey);
  if (ref) {
    return { url: `https://${ref}.supabase.co`, isValid: true };
  }

  return { url: 'https://placeholder.supabase.co', isValid: false };
}

// Resolve and initialize client safely with fallback
let client: SupabaseClient;
let configured = false;
let resolvedUrl = 'https://placeholder.supabase.co';

try {
  const resolved = resolveSupabaseUrl(envSupabaseUrl, envSupabaseAnonKey);
  resolvedUrl = resolved.url;
  const anonKey = envSupabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

  client = createClient(resolvedUrl, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  configured = resolved.isValid &&
    Boolean(envSupabaseAnonKey) &&
    !envSupabaseAnonKey.includes('your-anon-public-key');
} catch (err) {
  console.warn('Supabase initialization handled safely with fallback client:', err);
  resolvedUrl = 'https://placeholder.supabase.co';
  client = createClient('https://placeholder.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder', {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
  configured = false;
}

export const isSupabaseConfigured = configured;
export const supabase: SupabaseClient = client;

interface SupabaseContextType {
  supabase: SupabaseClient;
  isConfigured: boolean;
  supabaseUrl: string;
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase,
  isConfigured: configured,
  supabaseUrl: resolvedUrl
});

/**
 * Global provider for Supabase database and authentication access across the application
 */
export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = useMemo(
    () => ({
      supabase,
      isConfigured: configured,
      supabaseUrl: resolvedUrl
    }),
    []
  );

  return React.createElement(SupabaseContext.Provider, { value }, children);
};

/**
 * Hook to access the initialized Supabase client and connection state anywhere in the component tree
 */
export const useSupabase = (): SupabaseContextType => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};
