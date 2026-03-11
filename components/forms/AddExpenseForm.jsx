"use client";

import { useReducer, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const initialState = {
  status: 'idle', // idle | loading | success | resetting
  expenseName: '',
  totalAmount: '',
  group: '',
  paidBy: '',
  errors: {},
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: undefined },
      };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SUBMIT':
      return { ...state, status: 'loading', errors: {} };
    case 'SUCCESS':
      return { ...state, status: 'success' };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export default function AddExpenseForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const buttonRef = useRef(null);

  const validate = () => {
    const errors = {};
    if (!state.expenseName.trim()) errors.expenseName = 'Required';
    if (!state.totalAmount || parseFloat(state.totalAmount) <= 0) errors.totalAmount = 'Enter a valid amount';
    if (!state.group) errors.group = 'Select a group';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return;
    }

    dispatch({ type: 'SUBMIT' });

    // Loading → Success → Confetti → Reset
    setTimeout(() => {
      dispatch({ type: 'SUCCESS' });

      // Fire confetti from button position
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { x, y },
          colors: ['#4A6CF7', '#22C55E', '#7C3AED', '#F97316', '#EC4899'],
        });
      }

      setTimeout(() => {
        dispatch({ type: 'RESET' });
      }, 1500);
    }, 1500);
  };

  const inputClass = (field) => `
    w-full px-3 py-2.5 rounded-[10px] bg-bg-primary border text-sm text-text-body
    placeholder:text-text-muted outline-none
    transition-all duration-150 ease-out
    focus:ring-2 focus:ring-primary/15 focus:border-primary
    ${state.errors[field] ? 'border-danger animate-shake' : 'border-border'}
  `;

  const labelClass = (field) => `
    block text-xs font-medium mb-1.5 transition-colors duration-150
    ${state.errors[field] ? 'text-danger' : 'text-text-secondary'}
  `;

  return (
    <section aria-label="Add new expense">
      <h3 className="text-base font-semibold text-text-heading mb-1">Add New Card</h3>
      <p className="text-xs text-text-secondary mb-4 leading-relaxed">
        Credit Card generally means a plastic card issued Scheduled Commercial Banks assigned to a Cardholder.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" noValidate>
        <div>
          <label htmlFor="card-number" className={labelClass('expenseName')}>
            Card Number
          </label>
          <input
            id="card-number"
            type="text"
            placeholder="**** **** **** ****"
            value={state.expenseName}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'expenseName', value: e.target.value })}
            className={inputClass('expenseName')}
            aria-required="true"
            aria-invalid={!!state.errors.expenseName}
          />
          {state.errors.expenseName && (
            <p className="text-[11px] text-danger mt-1">{state.errors.expenseName}</p>
          )}
        </div>

        <div>
          <label htmlFor="expiration" className={labelClass('totalAmount')}>
            Expiration Card
          </label>
          <input
            id="expiration"
            type="text"
            placeholder="12/24"
            value={state.totalAmount}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'totalAmount', value: e.target.value })}
            className={inputClass('totalAmount')}
            aria-required="true"
            aria-invalid={!!state.errors.totalAmount}
          />
          {state.errors.totalAmount && (
            <p className="text-[11px] text-danger mt-1">{state.errors.totalAmount}</p>
          )}
        </div>

        <div>
          <label htmlFor="card-type" className={labelClass('group')}>
            Card Type
          </label>
          <select
            id="card-type"
            value={state.group}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'group', value: e.target.value })}
            className={inputClass('group')}
            aria-required="true"
            aria-invalid={!!state.errors.group}
          >
            <option value="">Password</option>
            <option value="roommates">Roommates</option>
            <option value="weekend-trip">Weekend Trip</option>
            <option value="college-friends">College Friends</option>
          </select>
          {state.errors.group && (
            <p className="text-[11px] text-danger mt-1">{state.errors.group}</p>
          )}
        </div>

        <div>
          <label htmlFor="name-on-card" className={labelClass('paidBy')}>
            Name on Card
          </label>
          <input
            id="name-on-card"
            type="text"
            placeholder="JK David"
            value={state.paidBy}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'paidBy', value: e.target.value })}
            className={inputClass('paidBy')}
          />
        </div>

        {/* Submit button */}
        <motion.button
          ref={buttonRef}
          type="submit"
          disabled={state.status !== 'idle'}
          whileHover={state.status === 'idle' ? { scale: 1.02 } : {}}
          whileTap={state.status === 'idle' ? { scale: 0.98 } : {}}
          transition={{ duration: 0.1 }}
          className={`
            w-full py-3 rounded-xl text-sm font-bold mt-2
            flex items-center justify-center gap-2
            transition-all duration-200 cursor-pointer
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none
            disabled:cursor-not-allowed
            ${
              state.status === 'success'
                ? 'bg-success text-white'
                : 'bg-danger text-white hover:opacity-90'
            }
          `}
        >
          <AnimatePresence mode="wait">
            {state.status === 'idle' && (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                Added New Card
              </motion.span>
            )}
            {state.status === 'loading' && (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <Loader2 size={16} className="animate-spin" />
                Adding...
              </motion.span>
            )}
            {state.status === 'success' && (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <Check size={16} />
                Done!
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </section>
  );
}