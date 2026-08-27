import { useState, useRef } from 'react'
import { compressFile } from '../imageCompression'

function ImageUploader({ value, onChange }) {
  const [compressing, setCompressing] = useState(false)
  const [error, setError] = useState(null)
  const [imgError, setImgError] = useState(false)
  const inputRef = useRef(null)

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setError(null)
    setCompressing(true)
    try {
      onChange(await compressFile(file))
    } catch {
      setError('Could not process image. Try another file.')
    } finally {
      setCompressing(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  // Reset the broken-image flag whenever the source changes.
  const [prevValue, setPrevValue] = useState(value)
  if (value !== prevValue) {
    setPrevValue(value)
    setImgError(false)
  }

  return (
    <div
      className={`img-uploader${compressing ? ' img-uploader--busy' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {value && (
        <div className="img-uploader__preview">
          {imgError ? (
            <div className="img-uploader__missing">
              <span>Image not found</span>
              <small>Upload a file from your device</small>
            </div>
          ) : (
            <img src={value} alt="" onError={() => setImgError(true)} />
          )}
          <button
            type="button"
            className="img-uploader__clear"
            onClick={() => onChange('')}
            title="Remove image"
          >✕</button>
        </div>
      )}

      <div className="img-uploader__row">
        <button
          type="button"
          className="img-uploader__btn img-uploader__btn--block"
          onClick={() => inputRef.current?.click()}
          disabled={compressing}
        >
          {compressing ? 'Compressing…' : value ? '↑ Change image' : '↑ Upload image'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && <p className="img-uploader__error">{error}</p>}
    </div>
  )
}

export default ImageUploader
