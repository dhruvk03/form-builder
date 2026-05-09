import React, { useRef } from 'react';
import type { FieldPlugin } from '../types';
import type { FileUploadField } from '../../types/schema';
import { FIELD_TYPES, UI_STRINGS, DEPENDENCY_OPERATORS, FILE_EXTENSIONS } from '../../constants';
import styles from '../../components/builder/FieldEditorCard.module.css';
import rendererStyles from '../../components/fill/FormRenderer.module.css';

export const FileUploadPlugin: FieldPlugin<FileUploadField> = {
  type: FIELD_TYPES.FILE_UPLOAD,
  label: UI_STRINGS.FIELD_TYPE_LABELS[FIELD_TYPES.FILE_UPLOAD],
  
  defaultState: (baseId: string) => ({
    id: baseId,
    type: FIELD_TYPES.FILE_UPLOAD,
    label: '',
    description: '',
    required: false,
    maxFiles: 1,
    allowedFileTypes: [],
  }),

  validateConfig: () => {
    return null; // Basic numeric constraints are handled natively by input type="number"
  },

  validateValue: (field, value) => {
    const isEmpty = value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);
    
    if (isEmpty) return null;
    
    if (field.maxFiles && Array.isArray(value) && value.length > field.maxFiles) {
      return `No more than ${field.maxFiles} files allowed`;
    }
    
    // In a real app we would also validate file extensions here
    
    return null;
  },

  getOperators: () => [
    { value: DEPENDENCY_OPERATORS.EQUALS, label: 'Equals' },
    { value: DEPENDENCY_OPERATORS.NOT_EQUALS, label: 'Not Equals' },
  ],

  BuilderConfigComponent: ({ field, onChange }) => {
    const allowedTypes = field.allowedFileTypes || [];
    
    return (
      <div className={styles.configGrid}>
        <div className={styles.inputGroup}>
          <label>Max Files</label>
          <input
            type="number"
            min="1"
            value={field.maxFiles ?? 1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ maxFiles: parseInt(e.target.value, 10) || 1 })}
          />
        </div>
        <div className={styles.inputGroupFull}>
          <label>Allowed Extensions</label>
          <div className={styles.checkboxListHorizontal}>
            {FILE_EXTENSIONS.map(ext => (
              <label key={ext} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={allowedTypes.includes(ext)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const next = e.target.checked
                      ? [...allowedTypes, ext]
                      : allowedTypes.filter(t => t !== ext);
                    onChange({ allowedFileTypes: next });
                  }}
                />
                {ext}
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  },

  FillerComponent: ({ field, value, onChange, error, required, readOnly }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const files = value || [];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []).map(f => ({
        name: f.name,
        size: f.size,
        type: f.type
      }));
      onChange(selectedFiles);
    };

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className={rendererStyles.fieldContainer}>
        <label className={rendererStyles.label}>
          {field.label} {required && <span className={rendererStyles.required}>*</span>}
        </label>
        {field.description && <p className={rendererStyles.description}>{field.description}</p>}
        
        {readOnly ? (
          <div className={rendererStyles.fileList}>
            {files.map((f: any, i: number) => (
              <div key={i} className={rendererStyles.fileItem}>{f.name}</div>
            ))}
            {files.length === 0 && <p className={rendererStyles.noValue}>No files uploaded</p>}
          </div>
        ) : (
          <div className={rendererStyles.fileUploadContainer}>
            <input
              type="file"
              ref={fileInputRef}
              className={rendererStyles.hiddenFileInput}
              multiple={(field.maxFiles || 1) > 1}
              accept={field.allowedFileTypes?.length ? field.allowedFileTypes.join(',') : undefined}
              onChange={handleFileChange}
            />
            <button 
              type="button"
              className={rendererStyles.uploadButton}
              onClick={handleButtonClick}
            >
              <span className={rendererStyles.uploadIcon}>↑</span>
              {files.length > 0 ? 'Change Files' : 'Add File'}
            </button>
            
            {files.length > 0 && (
              <div className={rendererStyles.fileList}>
                {files.map((f: any, i: number) => (
                  <div key={i} className={rendererStyles.fileItemPreview}>
                    <span className={rendererStyles.fileName}>{f.name}</span>
                    <button 
                      type="button" 
                      className={rendererStyles.removeFile}
                      onClick={() => {
                        const next = files.filter((_: any, index: number) => index !== i);
                        onChange(next);
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <p className={rendererStyles.uploadLimit}>
              {field.maxFiles ? `Max ${field.maxFiles} files` : 'Single file'}
              {field.allowedFileTypes?.length ? ` (${field.allowedFileTypes.join(', ')})` : ''}
            </p>
          </div>
        )}
        {error && <div className={rendererStyles.error}>{error}</div>}
      </div>
    );
  },
};