'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image';
import Link from 'next/link';
import AppInput from '@/components/ui/AppInput';

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--login-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex rounded-2xl border border-[var(--login-border)] bg-[var(--login-surface)] shadow-sm overflow-hidden" style={{ minHeight: 560 }}>

        {/* Left — form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-12 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--login-heading)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-[var(--login-text-secondary)]">Sign in to your SplitEase account</p>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <AppInput
              placeholder="Email"
              type="email"
              value={email}
              variant="simple"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            <AppInput
              placeholder="Password"
              type="password"
              value={password}
              variant="simple"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />

            {error && (
              <p className="text-danger text-sm -mt-1">{error}</p>
            )}

            <div className="flex items-center justify-between mt-1">
              <a href="#" className="text-xs text-[var(--login-text-secondary)] hover:text-[var(--login-text-primary)] transition-colors duration-150">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={!email || !password || isLoading}
              className="w-full py-2.5 rounded-lg bg-primary text-white text-sm font-medium
                hover:bg-primary-hover transition-colors duration-150
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-[var(--login-text-secondary)]">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-[var(--login-text-primary)] hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        {/* Right — decorative image */}
        <div className="hidden lg:flex w-1/2 items-center justify-center bg-[var(--login-muted-surface)] p-8">
          <Image
            src="/SplitEase.png"
            width={480}
            height={480}
            priority
            alt="SplitEase illustration"
            className="w-full max-w-sm h-auto object-contain"
          />
        </div>

      </div>
    </div>
  )
}

export default Page
