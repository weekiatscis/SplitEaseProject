"use client";

import { useReducer } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SpinnerGapIcon, CheckIcon } from '@phosphor-icons/react';
import AppInput from '@/components/ui/AppInput';

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

    // Loading → Success → Reset
    setTimeout(() => {
      dispatch({ type: 'SUCCESS' });

      setTimeout(() => {
        dispatch({ type: 'RESET' });
      }, 1500);
    }, 1500);
  };

  const selectClass = (field) => `
    w-full px-3 py-2.5 rounded-lg bg-bg-primary border text-sm text-text-body
    placeholder:text-text-muted outline-none
    transition-colors duration-150
    focus:ring-2 focus:ring-primary/15 focus:border-primary
    ${state.errors[field] ? 'border-danger' : 'border-border'}
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
        <AppInput
          variant="simple"
          inputSize="sm"
          label="Card Number"
          placeholder="**** **** **** ****"
          value={state.expenseName}
          onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'expenseName', value: e.target.value })}
          error={!!state.errors.expenseName}
          aria-required="true"
          aria-invalid={!!state.errors.expenseName}
        />
        {state.errors.expenseName && (
          <p className="text-[11px] text-danger -mt-2">{state.errors.expenseName}</p>
        )}

        <AppInput
          variant="simple"
          inputSize="sm"
          label="Expiration Card"
          placeholder="12/24"
          value={state.totalAmount}
          onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'totalAmount', value: e.target.value })}
          error={!!state.errors.totalAmount}
          aria-required="true"
          aria-invalid={!!state.errors.totalAmount}
        />
        {state.errors.totalAmount && (
          <p className="text-[11px] text-danger -mt-2">{state.errors.totalAmount}</p>
        )}

        <div>
          <label htmlFor="card-type" className={labelClass('group')}>
            Card Type
          </label>
          <select
            id="card-type"
            value={state.group}
            onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'group', value: e.target.value })}
            className={selectClass('group')}
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

        <AppInput
          variant="simple"
          inputSize="sm"
          label="Name on Card"
          placeholder="JK David"
          value={state.paidBy}
          onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'paidBy', value: e.target.value })}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={state.status !== 'idle'}
          className={`
            w-full py-3 rounded-lg text-sm font-semibold mt-2
            flex items-center justify-center gap-2
            transition-colors duration-150 cursor-pointer
            focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none
            disabled:cursor-not-allowed disabled:opacity-50
            ${
              state.status === 'success'
                ? 'bg-success text-white'
                : 'bg-primary text-white hover:opacity-90'
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
                <SpinnerGapIcon size={16} className="animate-spin" />
                Adding...
              </motion.span>
            )}
            {state.status === 'success' && (
              <motion.span
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                <CheckIcon size={16} />
                Done!
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </form>
    </section>
  );
}
