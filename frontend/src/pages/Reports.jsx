import { useEffect, useMemo, useState } from 'react';
import client from '../api/client';
import ErrorMessage from '../components/ErrorMessage';
import LoadingState from '../components/LoadingState';
import PageContainer from '../components/PageContainer';
import { getErrorMessage } from '../utils/errors';

export default function Reports() {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState('');

  const rows = useMemo(() => getReportRows(reportData), [reportData]);
  const columns = useMemo(() => getReportColumns(rows), [rows]);

  useEffect(() => {
    async function loadReport() {
      setIsLoading(true);
      setError('');

      try {
        const { data } = await client.get('/reports/esg-summary');
        setReportData(data);
      } catch (err) {
        setError(getErrorMessage(err, 'Unable to load ESG summary'));
      } finally {
        setIsLoading(false);
      }
    }

    loadReport();
  }, []);

  async function handleExportCsv() {
    setIsExporting(true);
    setError('');

    try {
      const response = await client.get('/reports/esg-summary/csv', {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'esg-summary.csv';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to export ESG summary CSV'));
    } finally {
      setIsExporting(false);
    }
  }

  if (isLoading) {
    return <LoadingState label="Loading ESG report..." />;
  }

  return (
    <PageContainer
      eyebrow="Reports"
      title="ESG Summary"
      actions={
        <button type="button" disabled={isExporting} onClick={handleExportCsv}>
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </button>
      }
    >
      <ErrorMessage message={error} />

      <section className="panel">
        <div className="panel-heading">
          <h2>Summary Table</h2>
          <p>Read-only ESG report from the backend</p>
        </div>

        {rows.length === 0 ? (
          <p className="empty-state">No ESG summary data available yet.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column}>{formatHeader(column)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id || row.departmentId || index}>
                    {columns.map((column) => (
                      <td key={column}>{formatReportValue(row[column])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageContainer>
  );
}

function getReportRows(reportData) {
  if (Array.isArray(reportData)) {
    return reportData;
  }

  if (!reportData || typeof reportData !== 'object') {
    return [];
  }

  const firstArray = Object.values(reportData).find((value) =>
    Array.isArray(value)
  );
  return firstArray || [];
}

function getReportColumns(rows) {
  return Array.from(
    rows.reduce((columns, row) => {
      if (row && typeof row === 'object') {
        Object.keys(row).forEach((key) => columns.add(key));
      }
      return columns;
    }, new Set())
  );
}

function formatHeader(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase());
}

function formatReportValue(value) {
  if (value === null || value === undefined) return '-';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
