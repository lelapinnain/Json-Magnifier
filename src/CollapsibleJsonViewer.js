
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons';
import './CollapsibleJsonViewer.css'; // Import your custom CSS

const CollapsibleJsonViewer = ({ data, parentKey = '' }) => {
  const [collapsedStates, setCollapsedStates] = useState({});
  
  const toggleCollapse = (key) => {
    setCollapsedStates(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isCollapsible = (data) => {
    return typeof data === 'object' && data !== null && !(data instanceof Date);
  };

  const renderContent = (data, currentKey) => {
    if (Array.isArray(data)) {
      return data.map((item, index) => (
        <CollapsibleJsonViewer key={index} data={item} parentKey={`${currentKey}[${index}]`} />
      ));
    } else if (isCollapsible(data)) {
      return Object.entries(data).map(([key, value]) => {
        const fullKey = `${currentKey}.${key}`;
        const isCollapsed = collapsedStates[fullKey];
        const canCollapse = isCollapsible(value);

      
        return (
          <>
            <div key={key} className="json-viewer-item">
                      {canCollapse && (
                        <span onClick={() => toggleCollapse(fullKey)} className="collapse-toggle">
                        <FontAwesomeIcon icon={isCollapsed ? faPlusSquare : faMinusSquare} className="fa-icon" />
                        </span>
                      )}
                      <strong className="json-key">{key}:</strong> {isCollapsed || renderContent(value, fullKey)}
            </div>
    </>
          
        );
      });
    } else {
      return <span className="json-value">{JSON.stringify(data)}</span>;
    }
  };

  return (
    <div className="json-viewer-container">
      {renderContent(data, parentKey)}
    </div>
  );
};

export default CollapsibleJsonViewer;


