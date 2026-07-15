// Small floating status toast shared by every admin section. Renders nothing
// until a save is in progress or has just finished.
function AdminToast({ status }) {
  if (!status) return null

  const text =
    status === 'saving' ? 'Saving…'
    : status === 'saved' ? '✓ Saved'
    : '✗ Error — check Firestore rules'

  return <div className={`admin-toast admin-toast--${status}`}>{text}</div>
}

export default AdminToast
