// pages/Responses/constants/exportFormats.js

export const EXPORT_FORMATS = {
    CSV: 'csv',
    EXCEL: 'excel',
    PDF: 'pdf',
    JSON: 'json'
}

export const EXPORT_FORMAT_CONFIG = {
    csv: {
        key: 'csv',
        label: 'CSV',
        description: 'Comma-separated values',
        icon: '📊',
        extension: '.csv',
        mimeType: 'text/csv',
        maxRecords: null, // unlimited
        features: ['Lightweight', 'Excel compatible', 'Easy import']
    },
    excel: {
        key: 'excel',
        label: 'Excel',
        description: 'Microsoft Excel format',
        icon: '📗',
        extension: '.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        maxRecords: null,
        features: ['Formatted sheets', 'Charts & formulas', 'Professional']
    },
    pdf: {
        key: 'pdf',
        label: 'PDF',
        description: 'Portable document format',
        icon: '📄',
        extension: '.pdf',
        mimeType: 'application/pdf',
        maxRecords: 100,
        features: ['Print-ready', 'Professional layout', 'Limited to 100 records']
    },
    json: {
        key: 'json',
        label: 'JSON',
        description: 'Raw data format',
        icon: '📋',
        extension: '.json',
        mimeType: 'application/json',
        maxRecords: null,
        features: ['Developer-friendly', 'Full data', 'API integration']
    }
}

export const getFormatConfig = (format) => {
    return EXPORT_FORMAT_CONFIG[format] || EXPORT_FORMAT_CONFIG.csv
}

export const downloadFile = (blob, filename, extension) => {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}${extension}`
    document.body.appendChild(link)
    link.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
}
