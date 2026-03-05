/**
 * Export a list of objects to a downloadable CSV file.
 * @param {Object[]} rows - Array of plain objects (each key = column header)
 * @param {string} filename - File name without extension
 */
export function exportToCSV(rows, filename = 'export') {
    if (!rows || rows.length === 0) return

    const headers = Object.keys(rows[0])

    const escape = (val) => {
        const str = val === null || val === undefined ? '' : String(val)
        // Wrap in quotes if contains comma, quote, or newline
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`
        }
        return str
    }

    const csvContent = [
        headers.map(escape).join(','),
        ...rows.map(row => headers.map(h => escape(row[h])).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
