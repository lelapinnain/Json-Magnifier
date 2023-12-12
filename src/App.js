import React, { useState, useEffect } from 'react';
import jsonData from './data.json';
import './Table.css';

const App = () => {
    const [tableData, setTableData] = useState([]);
    const [editStatus, setEditStatus] = useState({ rowKey: null, cellName: null });
    const [searchQuery, setSearchQuery] = useState('');
    

    useEffect(() => {
        setTableData(parseJsonData(jsonData));
    }, []);

    const parseJsonData = (data) => {
        let parsedData = [];
        Object.keys(data).forEach(mainKey => {
            Object.keys(data[mainKey]).forEach(subKey => {
                parsedData.push({
                    mainKey: mainKey,
                    subKey: subKey,
                    value: data[mainKey][subKey]
                });
            });
        });
        return parsedData;
    };

    const handleEdit = (index, key) => {
        setEditStatus({ rowKey: index, cellName: key });
    };

    const handleEditChange = (e, index, key) => {
        const newData = [...tableData];
        newData[index][key] = e.target.value;
        setTableData(newData);
    };

    const saveData = () => {
        const newData = reconstructJson(tableData);
        console.log("Saved Data:", newData);
    };

    const reconstructJson = (tableData) => {
        let newJson = {};
        tableData.forEach(item => {
            if (!newJson[item.mainKey]) {
                newJson[item.mainKey] = {};
            }
            newJson[item.mainKey][item.subKey] = item.value;
        });
        return newJson;
    };

    // const exportToCSV = () => {
    //     let csvContent = "data:text/csv;charset=utf-8,";
    //     csvContent += "Main Key, Sub Key, Value\n";
    //     tableData.forEach(row => {
    //         let rowContent = `${row.mainKey}, ${row.subKey}, ${row.value}\n`;
    //         csvContent += rowContent;
    //     });
    //     const encodedUri = encodeURI(csvContent);
    //     window.open(encodedUri);
    // };
    const exportToCSV = () => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Main Key, Sub Key, Value\n";
      tableData.forEach(row => {
          let rowContent = `"${row.mainKey}", "${row.subKey}", "${row.value}"\n`;
          csvContent += rowContent;
      });
  
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "my_data.csv");
      document.body.appendChild(link); // Required for FF
  
      link.click(); // This will download the data file named "my_data.csv".
  
      document.body.removeChild(link); // Clean up
  };
  

    const copyToClipboard = () => {
        const jsonStr = JSON.stringify(reconstructJson(tableData), null, 2);
        navigator.clipboard.writeText(jsonStr).then(() => {
            alert("JSON copied to clipboard!");
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <div>
           <div className="header">
            <h1>Editable JSON Data Table</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>
            <div className="table-container">
              <div className='buttonsContainer'>
                <button onClick={exportToCSV}>Export to CSV</button>
                <button onClick={copyToClipboard}>Copy JSON to Clipboard</button>
                <button onClick={saveData}>Save Changes</button>
                </div>
                <div className='table'>
                <table>
                    <thead>
                        <tr>
                            <th>Main Key</th>
                            <th>Sub Key</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.filter(row => 
                            row.mainKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            row.subKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            row.value.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((row, index) => (
                            <tr key={index}>
                                <td>{row.mainKey}</td>
                                <td>{row.subKey}</td>
                                <td onClick={() => handleEdit(index, 'value')}>
                                    {editStatus.rowKey === index && editStatus.cellName === 'value' ? 
                                        <input 
                                            type="text" 
                                            value={row.value} 
                                            onChange={(e) => handleEditChange(e, index, 'value')}
                                            className="edit-input"
                                        />
                                        : row.value
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}

export default App;
