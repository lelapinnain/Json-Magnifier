import React, {useEffect,useCallback,useState,useRef} from 'react';
import './Table.css';

function parseIfJson(value) {
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
    }
    return value;
}



const RecursiveTable = ({ data, onRowCountChange,onUpdateData,keyPath = '', }) => {
    const [editState, setEditState] = useState({
        keyPath: null,
        value: ''
    });
    const activeCellRef = useRef(null);

    const handleEdit = (keyPath, value) => {
        setEditState({ keyPath, value });
        activeCellRef.current = null; // Clear the ref
    };

    const handleChange = (e) => {
        setEditState(prevState => ({ ...prevState, value: e.target.value }));
    };

    const handleBlur = useCallback(() => {
        onUpdateData(editState.keyPath, editState.value);
        setEditState({ keyPath: null, value: '' });
    }, [editState, onUpdateData]);

    // const parseIfJson=(value)=> {
    //     try {
    //         const parsedValue = JSON.parse(value);
    //         return typeof parsedValue === 'object' ? parsedValue : value;
    //     } catch (error) {
    //         return value;
    //     }
    // }
    

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (activeCellRef.current && !activeCellRef.current.contains(event.target)) {
                handleBlur();
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [handleBlur]);

    const renderCell = (fullKeyPath, value) => {
        // Parse the value if it's a JSON string
        const displayValue = parseIfJson(value);
    
        // Check if the displayValue is an object or array and render a RecursiveTable for it
        if (typeof displayValue === 'object' && displayValue !== null) {
            return (
                <RecursiveTable 
                    data={displayValue} 
                    onRowCountChange={() => {}} 
                    onUpdateData={onUpdateData}
                    keyPath={fullKeyPath}
                />
            );
        }
    
        // For simple values or unparseable strings, allow editing as before
        if (editState.keyPath === fullKeyPath) {
            return (
                <input 
                    type="text" 
                    className='edit-input'
                    value={editState.value} 
                    onChange={handleChange} 
                    onBlur={handleBlur} 
                    autoFocus
                    ref={activeCellRef}
                />
            );
        }
    
        return (
            <span onClick={() => handleEdit(fullKeyPath, JSON.stringify(displayValue))}>
                {JSON.stringify(displayValue, null, 2)}
            </span>
        );
    };
    
    
    
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
        return data.map((item, index) => (
            <RecursiveTable 
                key={index} 
                data={item} 
                onRowCountChange={() => {}} 
                onUpdateData={onUpdateData}
            />
        ));
    } else if (typeof data === 'object' && data !== null) {
        return (
            <table className="nested-table">
            <tbody>
                {Object.entries(data).map(([key, value], index) => {
                    let newKeyPath = keyPath ? `${keyPath}.${key}` : key;
                    return (
                        <tr key={index}>
                            <td>{key}</td>
                            <td>
                                {typeof value === 'object' && value !== null ? 
                                    <RecursiveTable 
                                        data={value} 
                                        keyPath={newKeyPath}
                                        onRowCountChange={() => {}} 
                                        onUpdateData={onUpdateData}
                                    /> : 
                                    renderCell(newKeyPath, value)}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        );
    } else {
        return <span>{data}</span>;
    }
};

export default RecursiveTable;