import React, {useEffect,useCallback} from 'react';
import './Table.css';

const RecursiveTable = ({ data, onRowCountChange }) => {
    // Define countRows using useCallback to memoize it
    const countRows = useCallback((data) => {
        if (Array.isArray(data)) {
            return data.reduce((acc, item) => acc + countRows(item), 0);
        } else if (typeof data === 'object' && data !== null) {
            return Object.entries(data).reduce((acc, [, value]) => acc + (typeof value === 'object' ? countRows(value) : 1), 0);
        } else {
            return 1;
        }
    }, []); // Empty dependency array since countRows doesn't rely on external variables

    // useEffect to update row count whenever data changes
    useEffect(() => {
        const rowCount = countRows(data);
        onRowCountChange(rowCount);
    }, [data, onRowCountChange, countRows]);

    // Recursive rendering logic
    if (Array.isArray(data)) {
        return data.map((item, index) => <RecursiveTable key={index} data={item} onRowCountChange={() => {}} />);
    } else if (typeof data === 'object' && data !== null) {
        return (
            <table className="nested-table">
                <tbody>
                    {Object.entries(data).map(([key, value], index) => (
                        <tr key={index}>
                            <td>{key}</td>
                            <td>{typeof value === 'object' ? <RecursiveTable data={value} onRowCountChange={() => {}} /> : value.toString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    } else {
        return <span>{data}</span>;
    }
};

export default RecursiveTable;