import React, { useState } from 'react';
import RecursiveTable from './RecursiveTable'
import './Table.css';
import {filterData , formatForCSV} from './utils'
import CollapsibleJsonViewer from './CollapsibleJsonViewer';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [tableData, setTableData] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [viewMode, setViewMode] = useState('table');
  const [showLoadBtn, setShowLoadBtn] = useState(true);



  


  const handleRowCountChange = (newCount) => {
      setRowCount(newCount);
  };


  const handleJsonInputChange = (e) => {
      setJsonInput(e.target.value);
  };
  const handleReset = () => {
    setTableData([]);
    setJsonInput('');
    setSearchQuery('')
    setShowLoadBtn(true)
    filteredData=""
};

  const handleParseJson = () => {
      try {
          const parsedData = JSON.parse(jsonInput);
          setTableData(parsedData);
          setShowLoadBtn(false)
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


const updateTableData = (keyPath, newValue) => {
  setTableData(prevData => {
      // Deep clone the previous data to avoid mutating state directly
      let updatedData = JSON.parse(JSON.stringify(prevData));

      // Split the keyPath and iterate to find the nested data
      const keys = keyPath.split('.');
      let nested = updatedData;

      for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];
          if (!nested[key]) nested[key] = {}; // Create new object if key doesn't exist
          nested = nested[key];
      }

      // Update the value at the last key
      nested[keys[keys.length - 1]] = newValue;

      // Convert updated data back to JSON string
      const updatedJsonString = JSON.stringify(updatedData, null, 2);
      setJsonInput(updatedJsonString); // Update the jsonInput state

      return updatedData; // Return the updated data
  });
};


const handleChangeViewMode = (e) => {
  setViewMode(e.target.value);
};



  let filteredData = searchQuery ? filterData(tableData, searchQuery) : tableData;

  return (
      <div className='container'>
          <div className="header">
              <h1>JSON Magnifier</h1>
              <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className="search-input"
              />
          </div>
          <div className="view-mode-selector">
            <select className="view-mode-dropdown" value={viewMode} onChange={handleChangeViewMode}>
              <option value="table">Table View</option>
              <option value="json">JSON View</option>
            </select>
          </div>
          <div>
              <textarea
                  value={jsonInput}
                  onChange={handleJsonInputChange}
                  placeholder="Paste your JSON here"
                  rows={10}
                  className="json-input-textarea"
              />
              {showLoadBtn&& (
              <div className="button-container">
                  <button className='btn' onClick={handleParseJson}>Load JSON</button>
                 
              </div>
              )}
          </div>
         
          {filteredData && jsonInput&&tableData&& viewMode === 'table'&&(
           
              <div className="table-container">
                 <div className='buttonsContainer'>
                  <button className='btn-save' onClick={handleCopyJson}>Copy JSON</button>
                  <button className='btn-export' onClick={exportToCSV}>Export as CSV</button>
                  <button className='btn-reset' onClick={handleReset}>Reset</button> 
              </div>
              <p>Number of Rows: {rowCount}</p>
              <RecursiveTable 
            data={filteredData} 
            onRowCountChange={handleRowCountChange} 
            onUpdateData={updateTableData} 
        />
              </div>
          )}
            {viewMode === 'json' && (
        <div className="json-viewer">
          <CollapsibleJsonViewer data={filteredData} />
        </div>
      )}
      </div>
  );
}

export default App;

