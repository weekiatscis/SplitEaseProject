'use client'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import AppInput from '@/components/ui/AppInput'

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+65');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !countryCode || !phoneNumber || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^\+?\d{1,4}$/.test(countryCode.trim())) {
      setError('Please enter a valid country code');
      return;
    }

    if (!/^\d{6,15}$/.test(phoneNumber.trim())) {
      setError('Please enter a valid phone number');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/users/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: name.trim(),
          Email: email.trim(),
          Password: password,
          CountryCode: countryCode.trim(),
          PhoneNumber: phoneNumber.trim(),
        }),
      });
      if (!res.ok) throw new Error(`Sign up failed with status ${res.status}`);
      router.push('/');
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
      <div className="w-full max-w-4xl flex rounded-2xl border border-[var(--login-border)] bg-[var(--login-surface)] shadow-sm overflow-hidden" style={{ minHeight: 600 }}>

        {/* Left — form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-12 py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--login-heading)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Create account
            </h1>
            <p className="mt-1.5 text-sm text-[var(--login-text-secondary)]">Join SplitEase to split bills with friends</p>
          </div>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <AppInput
              placeholder="Full name"
              type="text"
              value={name}
              variant="simple"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
            <AppInput
              placeholder="Email"
              type="email"
              value={email}
              variant="simple"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            <div className="grid grid-cols-[112px_minmax(0,1fr)] gap-3">
              <AppInput
                placeholder="+65"
                type="text"
                value={countryCode}
                variant="simple"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountryCode(e.target.value)}
              />
              <AppInput
                placeholder="Phone number"
                type="tel"
                value={phoneNumber}
                variant="simple"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              />
            </div>
            <AppInput
              placeholder="Password"
              type="password"
              value={password}
              variant="simple"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <AppInput
              placeholder="Confirm password"
              type="password"
              value={confirmPassword}
              variant="simple"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            />

            {error && (
              <p className="text-danger text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={!name || !email || !countryCode || !phoneNumber || !password || !confirmPassword || isLoading}
              className="w-full mt-1 py-2.5 rounded-lg bg-primary text-white text-sm font-medium
                hover:bg-primary-hover transition-colors duration-150
                disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-[var(--login-text-secondary)]">
            Already have an account?{' '}
            <Link href="/" className="font-semibold text-[var(--login-text-primary)] hover:underline">
              Sign in
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

export default SignUpPage
