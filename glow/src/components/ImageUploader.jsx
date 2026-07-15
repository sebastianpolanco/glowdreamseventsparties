import { useState, useRef } from 'react'

const MAX_PX = 900
const QUALITY = 0.62

function compressToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = (e) => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        let { width, height } = img
        if (width > MAX_PX || height > MAX_PX) {
          if (width >= height) {
            height = Math.round((height * MAX_PX) / width)
            width = MAX_PX
          } else {
            width = Math.round((width * MAX_PX) / height)
            height = MAX_PX
          }
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', QUALITY))
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

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
      const b64 = await compressToBase64(file)
      onChange(b64)
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
