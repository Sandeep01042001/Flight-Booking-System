import React from 'react';
import PropTypes from 'prop-types';

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  rowKey = 'id',
  onRowClick,
  hover = true,
  striped = true,
  responsive = true,
  ...props
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  const tableClasses = [
    'min-w-full divide-y divide-gray-200',
    responsive && 'block md:table',
    className
  ].filter(Boolean).join(' ');

  const theadClasses = [
    responsive ? 'hidden md:table-header-group' : '',
    'bg-gray-50'
  ].filter(Boolean).join(' ');

  const tbodyClasses = [
    responsive ? 'block md:table-row-group' : '',
    'bg-white divide-y divide-gray-200'
  ].filter(Boolean).join(' ');

  const trClasses = (row, index) => [
    hover && 'hover:bg-gray-50',
    striped && index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
    onRowClick && 'cursor-pointer',
    responsive && 'block md:table-row md:flex md:flex-row md:flex-no-wrap',
    responsive && 'mb-4 md:mb-0 shadow-md md:shadow-none',
    'transition-colors duration-150'
  ].filter(Boolean).join(' ');

  const thClasses = (column, index) => [
    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
    column.align === 'right' ? 'text-right' : 'text-left',
    column.className || ''
  ].filter(Boolean).join(' ');

  const tdClasses = (column, index) => [
    'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
    column.align === 'right' ? 'text-right' : 'text-left',
    column.className || '',
    responsive && 'block md:table-cell',
    responsive && 'text-right md:text-left',
    responsive && 'before:content-[attr(data-label)] before:block before:font-medium before:text-gray-500 before:uppercase before:text-xs',
    responsive && 'md:before:content-none',
    responsive && 'flex justify-between md:table-cell',
    'leading-5'
  ].filter(Boolean).join(' ');

  const handleRowClick = (row) => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <div className={`${responsive ? 'overflow-x-auto' : ''}`}>
      <table className={tableClasses} {...props}>
        <thead className={theadClasses}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key || column.dataIndex || index}
                scope="col"
                className={thClasses(column, index)}
                style={column.style || {}}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={tbodyClasses}>
          {data.map((row, rowIndex) => (
            <tr
              key={row[rowKey] || rowIndex}
              className={trClasses(row, rowIndex)}
              onClick={() => handleRowClick(row)}
            >
              {columns.map((column, colIndex) => {
                const cellValue = column.render 
                  ? column.render(row[column.dataIndex], row, rowIndex)
                  : row[column.dataIndex];
                
                return (
                  <td
                    key={column.key || column.dataIndex || colIndex}
                    className={tdClasses(column, colIndex)}
                    data-label={column.title}
                    style={column.style || {}}
                  >
                    {cellValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.node.isRequired,
      dataIndex: PropTypes.string.isRequired,
      key: PropTypes.string,
      render: PropTypes.func,
      align: PropTypes.oneOf(['left', 'right', 'center']),
      className: PropTypes.string,
      style: PropTypes.object,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  loading: PropTypes.bool,
  emptyMessage: PropTypes.node,
  className: PropTypes.string,
  rowKey: PropTypes.string,
  onRowClick: PropTypes.func,
  hover: PropTypes.bool,
  striped: PropTypes.bool,
  responsive: PropTypes.bool,
};

export default Table;
