export const downloadCsv = (rows: string[][], fileName: string) => {
  if (!rows.length) return;

  const csvContent = rows
    .map((row) =>
      row
        .map((value) => {
          const stringValue = value ?? "";
          const escaped = `"${stringValue.replace(/"/g, '""')}"`;
          return escaped;
        })
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
