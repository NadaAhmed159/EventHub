export function getAccountApprovalStatus(user) {
  const rawStatus = user?.accountStatus || user?.approvalStatus || user?.status;

  if (typeof rawStatus === 'string' && rawStatus.trim()) {
    return rawStatus.trim().toLowerCase();
  }

  if (user?.applyAs === 'EventOrganizer') {
    return 'approved';
  }

  return 'approved';
}

export function isPendingOrganizer(user) {
  return user?.applyAs === 'EventOrganizer' && getAccountApprovalStatus(user) !== 'approved';
}

export function isRejectedOrganizer(user) {
  return user?.applyAs === 'EventOrganizer' && getAccountApprovalStatus(user) === 'rejected';
}