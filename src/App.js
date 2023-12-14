import React, { useState } from 'react';
import RecursiveTable from './RecursiveTable'
import './Table.css';
import {filterData , formatForCSV} from './utils'

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [tableData, setTableData] = useState([]);
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

//   const updateTableData = (rowKey, cellKey, newValue) => {
//     console.log("Updating data:", rowKey, cellKey, newValue);

//     setTableData(prevData => {
//         // Check if prevData is an array
//         if (Array.isArray(prevData)) {
//             return prevData.map((item, index) => {
//                 if (index === rowKey) {
//                     return { ...item, [cellKey]: newValue };
//                 }
//                 return item;
//             });
//         }
//         // If prevData is an object
//         else if (typeof prevData === 'object' && prevData !== null) {
//             return {
//                 ...prevData,
//                 [rowKey]: {
//                     ...prevData[rowKey],
//                     [cellKey]: newValue
//                 }
//             };
//         }
//         // If prevData is neither an array nor an object
//         else {
//             console.error('Unexpected data type for tableData:', prevData);
//             return prevData; // Or handle this case as needed
//         }
//     });
// };
// const updateTableData = (keyPath, newValue) => {
//   setTableData(prevData => {
//       const keys = keyPath.split('.');
//       const lastKey = keys.pop();
//       let nested = prevData;

//       keys.forEach(key => {
//           if (!nested[key]) nested[key] = {}; 
//           nested = nested[key];
//       });

//       nested[lastKey] = newValue;
//       return { ...prevData };
//   });
// };
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
              <RecursiveTable 
            data={filteredData} 
            onRowCountChange={handleRowCountChange} 
            onUpdateData={updateTableData} 
        />
              </div>
          )}
      </div>
  );
}

export default App;
