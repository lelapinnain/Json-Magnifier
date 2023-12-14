import React, { useState } from 'react';
import RecursiveTable from './RecursiveTable'
import './Table.css';
import {filterData , formatForCSV} from './utils'

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [tableData, setTableData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rowCount, setRowCount] = useState(0);

  const handleRowCountChange = (newCount) => {
      setRowCount(newCount);
  };


  const handleJsonInputChange = (e) => {
      setJsonInput(e.target.value);
  };
  const handleReset = () => {
    setTableData(null);
    setJsonInput('');
    setSearchQuery('')
    filteredData=""
};

  const handleParseJson = () => {
      try {
          const parsedData = JSON.parse(jsonInput);
          setTableData(parsedData);
      } catch (error) {
          alert('Invalid JSON');
      }
  };

  const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
  };

  const handleCopyJson = () => {
      navigator.clipboard.writeText(jsonInput).then(() => {
          alert('JSON copied to clipboard!');
      }, (err) => {
          console.error('Could not copy text: ', err);
      });
  };

  const exportToCSV = () => {
      // Get current date 
      const now = new Date();
      const formattedDate = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`;
      const csvData = formatForCSV(tableData);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `data_${formattedDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  let filteredData = searchQuery ? filterData(tableData, searchQuery) : tableData;

  return (
      <div className='container'>
          <div className="header">
              <h1>Convert JSON to Table</h1>
              <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className="search-input"
              />
          </div>
          <div>
              <textarea
                  value={jsonInput}
                  onChange={handleJsonInputChange}
                  placeholder="Paste your JSON here"
                  rows={10}
                  className="json-input-textarea"
              />
              <div className="button-container">
                  <button className='btn' onClick={handleParseJson}>Load JSON</button>
                 
              </div>
          </div>
         
          {filteredData && jsonInput&&tableData&&(
           
              <div className="table-container">
                 <div className='buttonsContainer'>
            <button className='btn-save' onClick={handleCopyJson}>Copy JSON</button>
            <button className='btn-export' onClick={exportToCSV}>Export as CSV</button>
            <button className='btn-reset' onClick={handleReset}>Reset</button> 
              </div>
              <p>Number of Rows: {rowCount}</p>
                  <RecursiveTable data={filteredData} onRowCountChange={handleRowCountChange} />
              </div>
          )}
      </div>
  );
}

export default App;
