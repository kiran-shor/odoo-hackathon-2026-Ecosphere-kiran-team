function normalizeBadge(badge) {
  if (typeof badge === 'string') {
    return {
      name: badge,
      description: '',
      icon: '',
    };
  }

  return badge || {};
}

export default function BadgeCard({ badge }) {
  const normalizedBadge = normalizeBadge(badge);

  return (
    <span
      className="status-pill complete"
      title={normalizedBadge.description || normalizedBadge.name}
    >
      {normalizedBadge.icon ? `${normalizedBadge.icon} ` : ''}
      {normalizedBadge.name || 'Badge'}
    </span>
  );
}
