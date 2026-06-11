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

function ImageUploader({ value, onChange, placeholder = 'Paste URL or upload a file…' }) {
  const [compressing, setCompressing] = useState(false)
  const [error, setError] = useState(null)
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

  const isBase64 = value?.startsWith('data:')

  return (
    <div
      className={`img-uploader${compressing ? ' img-uploader--busy' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {value && (
        <div className="img-uploader__preview">
          <img src={value} alt="" />
          <button
            type="button"
            className="img-uploader__clear"
            onClick={() => onChange('')}
            title="Remove image"
          >✕</button>
        </div>
      )}

      <div className="img-uploader__row">
        <input
          type="text"
          value={isBase64 ? '(uploaded image)' : (value || '')}
          onChange={(e) => !isBase64 && onChange(e.target.value)}
          readOnly={isBase64}
          className="admin-input"
          placeholder={placeholder}
        />
        <button
          type="button"
          className="img-uploader__btn"
          onClick={() => inputRef.current?.click()}
          disabled={compressing}
        >
          {compressing ? 'Compressing…' : '↑ Upload'}
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
