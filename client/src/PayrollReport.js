import React, { useState } from 'react';

const PayrollReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [message, setMessage] = useState('');

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/generate-excel-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'payroll_report.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        setMessage('Excel file downloaded successfully');
      } else {
        setMessage('An error occurred while downloading the file');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Generate Payroll Report</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="button" onClick={handleDownloadExcel}>
          Download Excel Report
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PayrollReport;