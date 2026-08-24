import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileArchive,
  ArrowRight,
  RefreshCw,
  Info
} from 'lucide-react';
import adminApi from '../../services/adminApi';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../services/emiHelper';

const AdminBulkImportPage = () => {
  const [activeStep, setActiveStep] = useState(1); // 1: Upload, 2: Preview & Validation, 3: Success
  const [file, setFile] = useState(null);
  const [zipFile, setZipFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [zipUploading, setZipUploading] = useState(false);

  // Validation results
  const [validationResult, setValidationResult] = useState(null);
  const [importSuccessResult, setImportSuccessResult] = useState(null);
  const [zipResult, setZipResult] = useState(null);

  const { addToast } = useToast();

  const handleDownloadTemplate = async () => {
    try {
      const response = await adminApi.get('/bulk/template', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'agro-product-import-template.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      addToast('Spreadsheet starter template downloaded!', 'success');
    } catch (e) {
      addToast('Failed to download template', 'error');
    }
  };

  const handleFileParse = async (e) => {
    e.preventDefault();
    if (!file) {
      addToast('Please select an XLSX or CSV spreadsheet file to upload.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setParsing(true);
    try {
      const res = await adminApi.post('/bulk/validate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setValidationResult(res.data);
        setActiveStep(2);
        addToast(`Parsed ${res.data.totalRows} rows: ${res.data.validCount} Valid, ${res.data.errorCount} Errors`, res.data.errorCount > 0 ? 'warning' : 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to parse spreadsheet file.', 'error');
    } finally {
      setParsing(false);
    }
  };

  const handleConfirmImport = async () => {
    if (!validationResult?.rows) return;
    const validRows = validationResult.rows.filter(r => r.isValid).map(r => r.data);

    if (validRows.length === 0) {
      addToast('No valid product rows to import.', 'warning');
      return;
    }

    setImporting(true);
    try {
      const res = await adminApi.post('/bulk/confirm-import', {
        products: validRows,
        updateExisting: true
      });
      if (res.data.success) {
        setImportSuccessResult(res.data);
        setActiveStep(3);
        addToast(`Successfully imported ${res.data.createdCount + res.data.updatedCount} products into MongoDB!`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Import execution failed.', 'error');
    } finally {
      setImporting(false);
    }
  };

  const handleZipUpload = async (e) => {
    e.preventDefault();
    if (!zipFile) {
      addToast('Please select a ZIP image archive.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('zipFile', zipFile);

    setZipUploading(true);
    try {
      const res = await adminApi.post('/bulk/bulk-images-zip', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setZipResult(res.data);
        addToast(`Extracted and mapped ${res.data.mappedCount} images across products!`, 'success');
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'ZIP image mapping failed', 'error');
    } finally {
      setZipUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800 }}>
            Bulk Machinery Import & Spreadsheet Ingestion
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Production-grade 7-step XLSX/CSV import wizard with multi-pass validation & ZIP SKU image mapper
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="btn btn-secondary btn-sm"
          style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
        >
          <Download size={15} />
          <span>Download Starter Template (.xlsx)</span>
        </button>
      </div>

      {/* Wizard Progress Steps Header */}
      <div className="admin-card" style={{ padding: '1rem 1.5rem' }}>
        <div className="flex items-center justify-between" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="flex items-center gap-2" style={{ color: activeStep >= 1 ? '#34d399' : '#64748b' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: activeStep >= 1 ? '#166534' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>1</div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Upload Spreadsheet</span>
          </div>

          <div style={{ flex: 1, height: '2px', background: activeStep >= 2 ? '#166534' : '#1e2e4f', margin: '0 1rem' }} />

          <div className="flex items-center gap-2" style={{ color: activeStep >= 2 ? '#34d399' : '#64748b' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: activeStep >= 2 ? '#166534' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>2</div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Validate & Preview</span>
          </div>

          <div style={{ flex: 1, height: '2px', background: activeStep >= 3 ? '#166534' : '#1e2e4f', margin: '0 1rem' }} />

          <div className="flex items-center gap-2" style={{ color: activeStep >= 3 ? '#34d399' : '#64748b' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: activeStep >= 3 ? '#166534' : '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>3</div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Database Ingestion</span>
          </div>
        </div>
      </div>

      {/* STEP 1: UPLOAD FORM */}
      {activeStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Spreadsheet Upload Box */}
          <div className="admin-card lg:col-span-2">
            <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              Step 1: Upload Machinery Catalog Spreadsheet
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
              Supported formats: Microsoft Excel (<code>.xlsx</code>), CSV (<code>.csv</code>). Column headers are automatically mapped to all 15 technical specifications and EMI attributes.
            </p>

            <form onSubmit={handleFileParse} className="flex flex-col gap-4">
              <div style={{
                background: '#070d1a',
                border: '2px dashed #1e2e4f',
                borderRadius: '12px',
                padding: '2.5rem',
                textAlign: 'center'
              }}>
                <FileSpreadsheet size={40} color="#34d399" style={{ margin: '0 auto 0.75rem auto' }} />
                <input
                  type="file"
                  id="excel-file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: 'none' }}
                />
                <label htmlFor="excel-file" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>
                    {file ? file.name : 'Click to select .XLSX or .CSV file from computer'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Maximum file size: 50MB (Up to 10,000 products)'}
                  </span>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!file || parsing}
                  className="btn btn-primary"
                >
                  <span>{parsing ? 'Parsing Spreadsheet...' : 'Parse & Validate Rows'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Side ZIP Image Mapper */}
          <div className="admin-card">
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FileArchive size={18} color="#f59e0b" />
              <span>Bulk Image ZIP Mapper</span>
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '1rem' }}>
              Upload a ZIP file containing machine photos named by SKU (e.g. <code>AV708-01.jpg</code>, <code>AV708-02.jpg</code>). The system automatically attaches them to the matching SKU!
            </p>

            <form onSubmit={handleZipUpload} className="flex flex-col gap-3">
              <input
                type="file"
                accept=".zip"
                onChange={(e) => setZipFile(e.target.files[0])}
                className="input-field"
                style={{ background: '#070d1a', borderColor: '#1e2e4f', color: '#ffffff' }}
              />
              <button
                type="submit"
                disabled={!zipFile || zipUploading}
                className="btn btn-secondary btn-sm"
                style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
              >
                <span>{zipUploading ? 'Extracting & Mapping...' : 'Upload & Map ZIP to SKUs'}</span>
              </button>
            </form>

            {zipResult && (
              <div style={{ marginTop: '1rem', background: '#070d1a', padding: '0.75rem', borderRadius: '8px', border: '1px solid #1e2e4f', fontSize: '0.75rem', color: '#34d399' }}>
                ✓ Mapped {zipResult.mappedCount} images to {zipResult.affectedProducts?.length || 0} machinery listings.
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: PREVIEW & ERROR VALIDATION MATRIX */}
      {activeStep === 2 && validationResult && (
        <div className="flex flex-col gap-4">
          {/* Metrics summary */}
          <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="flex items-center gap-4">
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Total Rows:</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>{validationResult.totalRows}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Valid Rows:</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>{validationResult.validCount}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>Rows with Errors:</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444' }}>{validationResult.errorCount}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="btn btn-secondary btn-sm"
                style={{ background: '#1e293b', borderColor: '#334155', color: '#ffffff' }}
              >
                Re-upload File
              </button>

              <button
                type="button"
                disabled={validationResult.validCount === 0 || importing}
                onClick={handleConfirmImport}
                className="btn btn-primary btn-sm"
              >
                <span>{importing ? 'Ingesting Rows...' : `Confirm & Import ${validationResult.validCount} Valid Products`}</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Validation Rows Grid */}
          <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="admin-table-container" style={{ border: 'none' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Status</th>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Selling Price</th>
                    <th>Stock</th>
                    <th>Validation Notes / Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {validationResult.rows.map((row) => (
                    <tr key={row.rowNumber} style={{ background: row.isValid ? 'transparent' : 'rgba(239, 68, 68, 0.08)' }}>
                      <td><strong>#{row.rowNumber}</strong></td>
                      <td>
                        {row.isValid ? (
                          <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <CheckCircle2 size={13} /> VALID
                          </span>
                        ) : (
                          <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <XCircle size={13} /> ERROR
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, color: '#ffffff' }}>{row.data?.name || '—'}</td>
                      <td><code>{row.data?.sku || '—'}</code></td>
                      <td>{row.data?.category || '—'}</td>
                      <td>{row.data?.brand || '—'}</td>
                      <td style={{ color: '#34d399', fontWeight: 700 }}>{row.data?.sellingPrice ? formatINR(row.data.sellingPrice) : '—'}</td>
                      <td>{row.data?.stockQuantity ?? '—'}</td>
                      <td>
                        {row.errors && row.errors.length > 0 ? (
                          <div style={{ color: '#ef4444', fontSize: '0.75rem' }}>
                            {row.errors.join('; ')}
                          </div>
                        ) : (
                          <div style={{ color: '#34d399', fontSize: '0.75rem' }}>
                            Passed all technical schema constraints.
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SUCCESS INGESTION SUMMARY */}
      {activeStep === 3 && importSuccessResult && (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#166534',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            <CheckCircle2 size={36} color="#86efac" />
          </div>

          <h2 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '0.5rem' }}>
            Bulk Ingestion Completed Successfully!
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            All valid products have been committed to MongoDB with full technical attributes, reducing-balance EMI plans, and inventory transaction logs.
          </p>

          <div style={{ background: '#070d1a', border: '1px solid #1e2e4f', borderRadius: '12px', padding: '1.25rem', maxWidth: '450px', margin: '0 auto 2rem auto', textAlign: 'left' }}>
            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>New Products Created:</span>
              <strong style={{ color: '#34d399' }}>{importSuccessResult.createdCount}</strong>
            </div>
            <div className="flex justify-between" style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#94a3b8' }}>Existing Products Updated:</span>
              <strong style={{ color: '#38bdf8' }}>{importSuccessResult.updatedCount}</strong>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#94a3b8' }}>Skipped (Errors):</span>
              <strong style={{ color: '#ef4444' }}>{importSuccessResult.errorCount}</strong>
            </div>
          </div>

          <button
            onClick={() => setActiveStep(1)}
            className="btn btn-primary"
          >
            Import Another Spreadsheet
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminBulkImportPage;
