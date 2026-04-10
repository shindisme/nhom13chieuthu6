import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename) => {
  if (!data || data.length === 0) {
    alert("Không có dữ liệu để xuất");
    return;
  }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  const colWidths = Object.keys(data[0] || {}).map(key => ({ wch: Math.max(key.length, 15) }));
  ws['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  XLSX.writeFile(wb, `${filename}.xlsx`);
};
