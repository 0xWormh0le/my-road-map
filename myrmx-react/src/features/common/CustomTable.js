import React, { useState, useEffect, useCallback } from 'react';
import orderBy from 'lodash/orderBy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortAmountDown, faSortAmountUp } from '@fortawesome/pro-light-svg-icons';
// import PropTypes from 'prop-types';

const getUpdatedSortBy = (currentSortBy, field) => {
  if (currentSortBy === field) {
    return `-${field}`;
  } else if (currentSortBy === `-${field}`) {
    return null;
  } else {
    return field;
  }
}

const CustomTable = ({
  columns,
  data: dt,
  sortMode = 'remote',
  onSortChange
}) => {
  const [sortBy, setSortBy] = useState(null);

  const [data, setData] = useState(dt)
  
  const sortData = useCallback(d => {
    if (sortBy) {
      const direction = sortBy[0] === '-' ? 'desc' : 'asc'
      return orderBy(
        d,
        [direction === 'desc' ? sortBy.slice(1) : sortBy],
        direction
      )
    } else {
      return d
    }
  }, [sortBy])

  useEffect(() => {
    setData(() => {
      if (sortMode === 'local') {
        return sortData(dt)
      } else {
        return dt
      }
    })
  }, [dt, sortData, sortBy, sortMode])

  const handleColumnClick = useCallback(
    field => () => {
      const newSortBy = getUpdatedSortBy(sortBy, field);
      setSortBy(newSortBy);
      onSortChange && onSortChange(newSortBy);
    }, 
    [sortBy, onSortChange]
  );

  const getSortIcon = useCallback(field => {
    if (sortBy === field) {
      return faSortAmountUp;
    } else if (sortBy === `-${field}`) {
      return faSortAmountDown;
    } else {
      return faSort;
    }
  }, [sortBy])

  return (
    <table className="common-custom-table" size="sm" >
      <thead>
        <tr>
          {columns.map(col => (
            <th
              key={col.id}
              className={col.className}
              onClick={handleColumnClick(col.id)}
            >
              {col.title}
              {col.sortable && (
                <FontAwesomeIcon icon={getSortIcon(col.id)} size="1x" />
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data && data.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td
                key={col.id}
                className={col.className}
              >
                {col.cell ? col.cell(row) : row[col.id]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CustomTable;

CustomTable.propTypes = {};
CustomTable.defaultProps = {};
