// import React, { useState } from 'react';

// const CollapsibleJsonViewer = ({ data, parentKey = '' }) => {
//   const [collapsedStates, setCollapsedStates] = useState({});

//   const toggleCollapse = (key) => {
//     setCollapsedStates(prev => ({ ...prev, [key]: !prev[key] }));
//   };

//   const renderContent = (data, currentKey) => {
//     if (Array.isArray(data)) {
//       return data.map((item, index) => (
//         <CollapsibleJsonViewer key={index} data={item} parentKey={`${currentKey}[${index}]`} />
//       ));
//     } else if (typeof data === 'object' && data !== null) {
//       return Object.entries(data).map(([key, value]) => {
//         const fullKey = `${currentKey}.${key}`;
//         const isCollapsed = collapsedStates[fullKey];

//         return (
//           <div key={key} style={{ marginLeft: '20px' }}>
//             <span onClick={() => toggleCollapse(fullKey)} style={{ cursor: 'pointer' }}>
//               {isCollapsed ? '[+]' : '[-]'}
//             </span>
//             <strong>{key}:</strong> {isCollapsed || renderContent(value, fullKey)}
//           </div>
//         );
//       });
//     } else {
//       return <span>{JSON.stringify(data)}</span>;
//     }
//   };

//   return (
//     <div>
//       {renderContent(data, parentKey)}
//     </div>
//   );
// };

// export default CollapsibleJsonViewer;
import React, { useState } from 'react';

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
          <div key={key} style={{ marginLeft: '20px' }}>
            {canCollapse && (
              <span onClick={() => toggleCollapse(fullKey)} style={{ cursor: 'pointer' }}>
                {isCollapsed ? '[+]' : '[-]'}
              </span>
            )}
            <strong>{key}:</strong> {isCollapsed || renderContent(value, fullKey)}
          </div>
        );
      });
    } else {
      return <span>{JSON.stringify(data)}</span>;
    }
  };

  return (
    <div>
      {renderContent(data, parentKey)}
    </div>
  );
};

export default CollapsibleJsonViewer;

