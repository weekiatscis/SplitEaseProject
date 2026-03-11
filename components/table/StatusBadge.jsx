export default function StatusBadge({ status }) {
  const config = {
    settled: {
      bg: 'bg-success-bg',
      text: 'text-success',
      label: 'Settled',
    },
    pending: {
      bg: 'bg-warning-bg',
      text: 'text-warning',
      label: 'Pending',
      pulse: true,
    },
    unsettled: {
      bg: 'bg-danger-bg',
      text: 'text-danger',
      label: 'Unsettled',
    },
  };

  const { bg, text, label, pulse } = config[status] || config.pending;

  return (
    <span
      role="status"
      aria-label={label}
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
        ${bg} ${text}
        ${pulse ? 'animate-subtle-pulse' : ''}
      `}
    >
      {label}
    </span>
  );
}
