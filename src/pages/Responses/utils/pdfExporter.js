// pages/Responses/utils/pdfExporter.js - CORRECTED

import html2pdf from 'html2pdf.js'
import { format } from 'date-fns'
import ReactDOMServer from 'react-dom/server' // ✅ FIXED: Correct import
import React, {useEffect} from 'react' // ✅ ADDED: Need React for JSX

/**
 * Export response as beautiful PDF (client-side)
 */
export const exportResponsePDF = async (response, formData, orgName) => {
    try {
        const element = document.createElement('div')
        element.id = 'pdf-content'

        // Import template dynamically
        const { default: PremiumPDFTemplate } = await import(
            '../components/Export/PremiumPDFTemplate'
            )

        // Render React component to HTML string
        const templateHTML = ReactDOMServer.renderToStaticMarkup(
            React.createElement(PremiumPDFTemplate, {
                response,
                formData,
                orgName
            })
        )

        element.innerHTML = templateHTML
        document.body.appendChild(element)

        // PDF options
        const options = {
            margin: [0, 0, 0, 0],
            filename: `response_${response.responseId}_${format(new Date(), 'yyyy-MM-dd')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: {
                format: 'a4',
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        }

        // Generate and download PDF
        await html2pdf().set(options).from(element).save()

        // Clean up
        document.body.removeChild(element)

        return true
    } catch (error) {
        console.error('PDF export error:', error)
        throw error
    }
}

/**
 * Alternative: Using jsPDF + html2canvas (lighter)
 * This approach works with DOM elements directly
 */
export const exportResponsePDFLite = async (response, formData, orgName) => {
    try {
        // Check if libraries are loaded
        if (!window.jspdf || !window.html2canvas) {
            throw new Error('Required libraries not loaded. Please include jsPDF and html2canvas CDN scripts.')
        }

        const { jsPDF } = window.jspdf
        const html2canvas = window.html2canvas

        const element = document.getElementById('pdf-template')
        if (!element) throw new Error('PDF template element not found')

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })

        const imgWidth = 210 // A4 width in mm
        const pageHeight = 297 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        let position = 0

        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        // Add additional pages if content overflows
        while (heightLeft > 0) {
            position = heightLeft - imgHeight
            pdf.addPage()
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
        }

        // Download
        pdf.save(
            `response_${response.responseId}_${format(new Date(), 'yyyy-MM-dd')}.pdf`
        )

        return true
    } catch (error) {
        console.error('PDF export error:', error)
        throw error
    }
}

/**
 * Batch export multiple responses
 */
export const exportMultipleResponsesPDF = async (responses, formData, orgName) => {
    try {
        if (!window.jspdf || !window.html2canvas) {
            throw new Error('Required libraries not loaded')
        }

        const { jsPDF } = window.jspdf
        const html2canvas = window.html2canvas

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        })

        for (let i = 0; i < responses.length; i++) {
            const response = responses[i]

            // Create temporary element
            const tempElement = document.createElement('div')
            tempElement.style.width = '210mm'
            tempElement.style.padding = '20mm'
            tempElement.style.backgroundColor = '#ffffff'

            // Import and render template
            const { default: PremiumPDFTemplate } = await import(
                '../components/Export/PremiumPDFTemplate'
                )

            const templateHTML = ReactDOMServer.renderToStaticMarkup(
                React.createElement(PremiumPDFTemplate, {
                    response,
                    formData,
                    orgName
                })
            )

            tempElement.innerHTML = templateHTML
            document.body.appendChild(tempElement)

            // Convert to canvas
            const canvas = await html2canvas(tempElement, {
                scale: 2,
                useCORS: true,
                logging: false
            })

            const imgData = canvas.toDataURL('image/png')

            // Add new page for subsequent responses
            if (i > 0) pdf.addPage()

            // Calculate dimensions
            const imgWidth = 210
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, 297))

            // Clean up
            document.body.removeChild(tempElement)
        }

        pdf.save(`responses_batch_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
        return true
    } catch (error) {
        console.error('Batch PDF export error:', error)
        throw error
    }
}

/**
 * Batch export multiple responses as single PDF
 */
export const exportMultipleResponsesPDFV2 = async (responses, formData, orgName) => {
    try {
        // Create single container for all responses
        const container = document.createElement('div')
        container.style.cssText = `
            width: 210mm;
            font-family: 'Inter', 'Segoe UI', sans-serif;
            background-color: #ffffff;
        `

        // Add each response with page break
        responses.forEach((response, index) => {
            const responsePage = document.createElement('div')
            console.log(response)
            responsePage.style.cssText = `
                min-height: 297mm;
                padding: 20mm;
                page-break-after: always;
                ${index < responses.length - 1 ? 'border-bottom: 2px dashed #ccc;' : ''}
            `
            responsePage.innerHTML = buildPDFHTML(response, formData, orgName)
            container.appendChild(responsePage)
        })

        document.body.appendChild(container)

        // PDF options
        const options = {
            margin: 0,
            filename: `responses_batch_${responses.length}_${format(new Date(), 'yyyy-MM-dd')}.pdf`,
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            },
            jsPDF: {
                format: 'a4',
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        }

        // Generate PDF
        await html2pdf().set(options).from(container).save()

        // Clean up
        document.body.removeChild(container)

        return true
    } catch (error) {
        console.error('Batch PDF export error:', error)
        throw error
    }
}

/**
 * Helper: Create simple HTML for response (fallback)
 */
const createResponseHTML = (response, formData) => {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Response #${response.responseId?.slice(-8)}</h2>
            <div style="margin: 20px 0;">
                <p><strong>Status:</strong> ${response.status}</p>
                <p><strong>Submitted:</strong> ${format(new Date(response.submittedAt), 'MMM dd, yyyy HH:mm')}</p>
                <p><strong>Citizen:</strong> ${response.citizenEmail || 'Anonymous'}</p>
            </div>
            <h3>Answers:</h3>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px;">
                ${Object.entries(response.answers || {})
        .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
        .join('')}
            </div>
        </div>
    `
}
/**
 * Build HTML template for PDF
 */
const buildPDFHTML = (response, formData, orgName) => {
    const statusColors = {
        PENDING: { bg: '#fef3c7', text: '#92400e' },
        REVIEWED: { bg: '#dbeafe', text: '#1e40af' },
        RESOLVED: { bg: '#dcfce7', text: '#166534' },
        REJECTED: { bg: '#fee2e2', text: '#991b1b' },
        SPAM: { bg: '#fecaca', text: '#7f1d1d' }
    }

    const statusColor = statusColors[response.status] || statusColors.PENDING

    return `
        <div>
            <!-- Header -->
            <div style="margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #3b82f6;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 32px; font-weight: bold;">🔵</div>
                        <div>
                            <div style="font-size: 24px; font-weight: 700; color: #1a202c;">BoloIndia</div>
                            <div style="font-size: 11px; color: #6b7280;">Citizen Feedback System</div>
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 10px; color: #9ca3af; text-transform: uppercase;">Exported</div>
                        <div style="font-size: 12px; font-weight: 600; color: #1a202c; margin-top: 2px;">
                            ${format(new Date(), 'MMM dd, yyyy')}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Title -->
            <div style="margin-bottom: 25px;">
                <h1 style="font-size: 28px; font-weight: 700; color: #1a202c; margin: 0 0 10px 0; display: inline-block;">
                    Response #${response.responseId?.slice(-8) || 'N/A'}
                </h1>
                <span style="
                    display: inline-block;
                    margin-left: 15px;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    background-color: ${statusColor.bg};
                    color: ${statusColor.text};
                ">
                    ${response.status || 'PENDING'}
                </span>
            </div>

            <!-- Metadata Grid -->
            <div style="
                display: grid;
                grid-template-columns: 1fr 1fr 1fr 1fr;
                gap: 15px;
                margin-bottom: 30px;
                padding: 15px;
                background-color: #f3f4f6;
                border-radius: 8px;
            ">
                <div style="padding: 10px;">
                    <div style="font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Response ID</div>
                    <div style="font-size: 13px; font-weight: 600; color: #1a202c; word-break: break-all;">${response.responseId}</div>
                </div>
                <div style="padding: 10px;">
                    <div style="font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Submitted</div>
                    <div style="font-size: 13px; font-weight: 600; color: #1a202c;">
                        ${format(new Date(response.submittedAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                </div>
                <div style="padding: 10px;">
                    <div style="font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Citizen</div>
                    <div style="font-size: 13px; font-weight: 600; color: #1a202c;">
                        ${response.citizenEmail || response.citizenPhone || 'Anonymous'}
                    </div>
                </div>
                <div style="padding: 10px;">
                    <div style="font-size: 10px; color: #6b7280; text-transform: uppercase; margin-bottom: 4px;">Status</div>
                    <div style="font-size: 13px; font-weight: 600; color: #1a202c;">${response.status || 'PENDING'}</div>
                </div>
            </div>

            <!-- Location -->
            ${response.location ? `
                <div style="margin-bottom: 25px;">
                    <h3 style="font-size: 14px; font-weight: 700; color: #1a202c; margin-bottom: 12px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
                        📍 Location
                    </h3>
                    <div style="padding: 12px 15px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px; font-size: 12px;">
                        <div><strong>${response.location.city || 'N/A'}</strong>${response.location.state ? `, ${response.location.state}` : ''}</div>
                        ${response.location.address ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">${response.location.address}</div>` : ''}
                    </div>
                </div>
            ` : ''}

            <!-- Answers -->
            <div style="margin-bottom: 25px;">
                <h3 style="font-size: 14px; font-weight: 700; color: #1a202c; margin-bottom: 12px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
                    📝 Response Details
                </h3>
                ${Object.entries(response.answers || {}).map(([fieldId, answer]) => {
        const field = formData?.fields?.find(f => f.fieldId === fieldId)
        return `
                        <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e5e7eb;">
                            <div style="font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">
                                ${field?.fieldLabel || fieldId}${field?.required ? '<span style="color: #dc2626;">*</span>' : ''}
                            </div>
                            <div style="font-size: 12px; color: #1a202c; padding: 10px 12px; background-color: #f9fafb; border-radius: 4px; word-break: break-word;">
                                ${typeof answer === 'object' ? JSON.stringify(answer, null, 2) : String(answer)}
                            </div>
                        </div>
                    `
    }).join('')}
            </div>

            <!-- Replies -->
            ${response.orgReplies && response.orgReplies.length > 0 ? `
                <div style="margin-bottom: 25px;">
                    <h3 style="font-size: 14px; font-weight: 700; color: #1a202c; margin-bottom: 12px; border-bottom: 2px solid #3b82f6; padding-bottom: 8px;">
                        💬 Organization Replies
                    </h3>
                    ${response.orgReplies.map(reply => `
                        <div style="margin-bottom: 12px; padding-left: 15px; border-left: 3px solid #10b981;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
                                <strong>${reply.repliedByEmail}</strong>
                                <span style="color: #9ca3af; font-size: 11px;">
                                    ${format(new Date(reply.repliedAt), 'MMM dd, yyyy')}
                                </span>
                            </div>
                            <div style="font-size: 12px; color: #374151; line-height: 1.5;">${reply.message}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <!-- Footer -->
            <div style="margin-top: 40px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af;">
                <div style="margin-bottom: 4px;">Generated by BoloIndia Response Management System</div>
                <div style="font-size: 9px; color: #d1d5db;">
                    ${format(new Date(), "EEEE, MMMM dd, yyyy 'at' HH:mm:ss")}
                </div>
            </div>
        </div>
    `
}

export { buildPDFHTML }
