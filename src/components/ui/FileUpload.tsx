"use client";

import { useState, useCallback } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Upload, CircleAlert, ImageIcon, FileText, X } from "lucide-react";

const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "application/pdf": [".pdf"],
};
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;

function fmtSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileEntry {
  file: File;
}

interface FileUploadProps {
  onChange: (files: File[]) => void;
}

export default function FileUpload({ onChange }: FileUploadProps) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  function remove(i: number) {
    const next = entries.filter((_, idx) => idx !== i);
    setEntries(next);
    onChange(next.map((e) => e.file));
    setError(null);
  }

  const onDrop = useCallback((accepted: File[], rejected: FileRejection[]) => {
    if (rejected.length > 0) {
      setError(rejected[0].errors[0]?.message ?? "File not accepted.");
      return;
    }
    const next = [...entries, ...accepted.map((file) => ({ file }))];
    const total = next.reduce((s, e) => s + e.file.size, 0);
    if (total > MAX_TOTAL_BYTES) {
      setError("Total size exceeds 20 MB.");
      return;
    }
    setError(null);
    setEntries(next);
    onChange(next.map((e) => e.file));
  }, [entries, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
  });

  return (
    <div className="fu3-root">
      <div className="fu3-label-row">
        <span className="fu3-label">Attach references</span>
        <span className="fu3-optional">Optional</span>
      </div>

      <div
        {...getRootProps()}
        className={`fu3-zone${isDragActive ? " fu3-zone--active" : ""}${error ? " fu3-zone--error" : ""}`}
      >
        <input {...getInputProps()} />
        <span className="fu3-zone-icon" aria-hidden>
          <Upload size={18} strokeWidth={1.6} />
        </span>
        <span className="fu3-zone-body">
          <span className="fu3-zone-text">
            {isDragActive ? "Drop to attach" : "Browse or drag photos, sketches, PDFs"}
          </span>
          <span className="fu3-zone-sub">JPG · PNG · WebP · PDF · 20 MB total</span>
        </span>
      </div>

      {error && (
        <p className="fu3-error">
          <CircleAlert size={12} strokeWidth={2.5} />
          {error}
        </p>
      )}

      {entries.length > 0 && (
        <ul className="fu3-list">
          {entries.map((entry, i) => (
            <li key={i} className="fu3-file">
              <span className={`fu3-file-thumb ${entry.file.type.startsWith("image/") ? "fu3-file-thumb--img" : "fu3-file-thumb--pdf"}`}>
                {entry.file.type.startsWith("image/") ? (
                  <ImageIcon size={14} strokeWidth={1.5} />
                ) : (
                  <FileText size={14} strokeWidth={1.5} />
                )}
              </span>
              <span className="fu3-file-info">
                <span className="fu3-file-name">{entry.file.name}</span>
                <span className="fu3-file-meta">{fmtSize(entry.file.size)}</span>
              </span>
              <button
                type="button"
                className="fu3-file-remove"
                onClick={() => remove(i)}
                aria-label={`Remove ${entry.file.name}`}
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
