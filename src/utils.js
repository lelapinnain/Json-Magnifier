export const filterData = (data, query) => {
    if (!query) return data;
  
    // Handle null or undefined data
    if (data === null || data === undefined) return null;
  
    // Check if data is an array
    if (Array.isArray(data)) {
        return data.map(item => filterData(item, query)).filter(item => item !== null);
    } 
    // Check if data is an object
    else if (typeof data === 'object') {
        let matches = {};
        for (let key in data) {
            let value = data[key];
  
            // Check if the key matches the query
            if (key.toLowerCase().includes(query.toLowerCase())) {
                matches[key] = value;
            } 
            // Check if the value is an object or matches the query
            else if (value !== null && value !== undefined) {
                if (typeof value === 'object') {
                    let result = filterData(value, query);
                    if (result) matches[key] = result;
                } else if (value.toString().toLowerCase().includes(query.toLowerCase())) {
                    matches[key] = value;
                }
            }
        }
        return Object.keys(matches).length > 0 ? matches : null;
    } 
    // Check if data is a primitive type and matches the query
    else {
        return data.toString().toLowerCase().includes(query.toLowerCase()) ? data : null;
    }
  };
  
  
  
  export const formatForCSV = (data, level = 0) => {
    let csvData = '';
    if (Array.isArray(data)) {
        data.forEach(item => {
            csvData += formatForCSV(item, level + 1);
        });
    } else if (typeof data === 'object' && data !== null) {
        Object.entries(data).forEach(([key, value]) => {
            const indentation = ', '.repeat(level);
            if (typeof value === 'object') {
                csvData += `${indentation}${key}\n`;
                csvData += formatForCSV(value, level + 1);
            } else {
                // Check for null or undefined before calling toString()
                const valueString = value === null || value === undefined ? '' : value.toString();
                csvData += `${indentation}${key}, ${valueString}\n`;
            }
        });
    } else {
        // Check for null or undefined before calling toString()
        const dataString = data === null || data === undefined ? '' : data.toString();
        csvData += ', '.repeat(level) + dataString + '\n';
    }
    return csvData;
  };
  