'use client'

import * as React from 'react'
import { useState } from 'react'

interface InputProps {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'simple';
  inputSize?: 'default' | 'sm';
  error?: boolean;
  [key: string]: any;
}

const AppInput = (props: InputProps) => {
  const { label, placeholder, icon, variant = 'default', inputSize = 'default', error, className, ...rest } = props;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const isDefault = variant === 'default';
  const isSmall = inputSize === 'sm';

  const inputClasses = isDefault
    ? `peer relative z-10 border-2 border-[var(--color-border)] ${isSmall ? 'h-10' : 'h-13'} w-full rounded-md bg-[var(--color-surface)] px-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-[var(--color-bg)] placeholder:font-medium`
    : `w-full ${isSmall ? 'px-3 py-2.5' : 'px-4 py-3'} rounded-[10px] bg-bg-primary border ${error ? 'border-danger animate-shake' : 'border-border'} text-sm text-text-body placeholder:text-text-muted outline-none transition-all duration-150 ease-out focus:ring-2 focus:ring-primary/15 focus:border-primary`;

  return (
    <div className={`w-full ${isDefault ? 'min-w-[200px]' : ''} relative ${className || ''}`}>
      { label &&
        <label className={`block ${isDefault ? 'mb-2 text-sm' : 'text-xs font-medium mb-1.5 transition-colors duration-150'} ${error ? 'text-danger' : isDefault ? '' : 'text-text-secondary'}`}>
          {label}
        </label>
      }
      <div className="relative w-full">
        {!isDefault && icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted z-10">
            {icon}
          </div>
        )}
        <input
          type="text"
          className={`${inputClasses} ${!isDefault && icon ? 'pl-9' : ''}`}
          placeholder={placeholder}
          onMouseMove={isDefault ? handleMouseMove : undefined}
          onMouseEnter={isDefault ? () => setIsHovering(true) : undefined}
          onMouseLeave={isDefault ? () => setIsHovering(false) : undefined}
          {...rest}
        />
        {isDefault && isHovering && (
          <>
            <div
              className="absolute pointer-events-none top-0 left-0 right-0 h-[2px] z-20 rounded-t-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 0px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
            <div
              className="absolute pointer-events-none bottom-0 left-0 right-0 h-[2px] z-20 rounded-b-md overflow-hidden"
              style={{
                background: `radial-gradient(30px circle at ${mousePosition.x}px 2px, var(--color-text-primary) 0%, transparent 70%)`,
              }}
            />
          </>
        )}
        {isDefault && icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20">
            {icon}
          </div>
        )}
      </div>
      {error && typeof error === 'string' && (
        <p className="text-[11px] text-danger mt-1">{error}</p>
      )}
    </div>
  )
}

export default AppInput
