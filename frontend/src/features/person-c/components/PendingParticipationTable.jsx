function formatDate(value) {
  if (!value) return 'Unknown';

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function PendingParticipationTable({
  items,
  onApprove,
  onReject,
  busyId,
}) {
  if (items.length === 0) {
    return (
      <section className="panel">
        <p className="empty-state">No pending participation submissions.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <h2>Pending Review</h2>
        <p>Approve valid proof or reject incomplete submissions.</p>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Activity</th>
              <th>Proof</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isBusy = busyId === item.id;

              return (
                <tr key={item.id}>
                  <td>{item.employeeName || `Employee #${item.employeeId}`}</td>
                  <td>{item.activityTitle || `Activity #${item.activityId}`}</td>
                  <td>{item.proof}</td>
                  <td>{formatDate(item.createdAt)}</td>
                  <td>
                    <div className="policy-actions">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onApprove(item)}
                      >
                        {isBusy ? 'Saving...' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => onReject(item)}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
