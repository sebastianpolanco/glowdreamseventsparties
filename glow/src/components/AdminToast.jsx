// Small floating status toast shared by every admin section. Renders nothing
// until a save is in progress or has just finished.

// Every failed save used to read "check Firestore rules", which sent the owner
// hunting through the console while the real cause was an oversized document.
// Translate the codes that actually come up into something actionable.
function errorText(error) {
  if (!error) return 'Error — could not save'

  switch (error.code) {
    case 'doc-too-large':
      return error.message
    case 'invalid-argument':
      // What Firestore returns when the document exceeds 1,048,487 bytes.
      return 'Error — too much image data for one section. Run "Optimize images" or remove a slide.'
    case 'permission-denied':
      return 'Error — write denied. Sign in again, or check the Firestore rules.'
    case 'unauthenticated':
      return 'Error — your session expired. Sign in again.'
    case 'unavailable':
      return 'Error — no connection to Firestore. Check your internet and retry.'
    default:
      return `Error — ${error.message || 'could not save'}`
  }
}

function AdminToast({ status, error }) {
  if (!status) return null

  const text =
    status === 'saving' ? 'Saving…'
    : status === 'saved' ? '✓ Saved'
    : `✗ ${errorText(error)}`

  return <div className={`admin-toast admin-toast--${status}`}>{text}</div>
}

export default AdminToast
