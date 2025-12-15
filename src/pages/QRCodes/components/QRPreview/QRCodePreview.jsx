import React from 'react'
import { Box, Paper, Typography, Button, IconButton, Tooltip, ButtonGroup } from '@mui/material'
import {
    Download as DownloadIcon,
    ContentCopy as CopyIcon,
    OpenInNew as OpenIcon,
    Image as ImageIcon,
    PictureAsPdf as PdfIcon,
    Code as SvgIcon,
} from '@mui/icons-material'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import { API_CONFIG } from "../../../../config/api.config.js"

export const QRCodePreview = ({ qrCode, size = 256 }) => {
    if (!qrCode) return null

    const qrUrl = `${API_CONFIG.CITIZEN_PORTAL}/fill/${qrCode.qrCodeSlug}`

    // Download as SVG
    const handleDownloadSVG = () => {
        try {
            const svg = document.getElementById(`qr-${qrCode.qrCodeId}`)
            const svgData = new XMLSerializer().serializeToString(svg)
            const blob = new Blob([svgData], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = url
            link.download = `${qrCode.qrCodeName}-QR.svg`
            link.click()

            URL.revokeObjectURL(url)
            toast.success('QR Code downloaded as SVG!')
        } catch (error) {
            toast.error('Failed to download SVG')
            console.error(error)
        }
    }

    // Download as PNG
    const handleDownloadPNG = () => {
        try {
            const svg = document.getElementById(`qr-${qrCode.qrCodeId}`)
            const svgData = new XMLSerializer().serializeToString(svg)

            // Create canvas
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()

            // Convert SVG to data URL
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
            const url = URL.createObjectURL(svgBlob)

            img.onload = () => {
                // Set canvas size (higher resolution for better quality)
                canvas.width = size * 2
                canvas.height = size * 2

                // Draw white background
                ctx.fillStyle = 'white'
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                // Draw QR code
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                // Convert to PNG and download
                canvas.toBlob((blob) => {
                    const pngUrl = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = pngUrl
                    link.download = `${qrCode.qrCodeName}-QR.png`
                    link.click()

                    URL.revokeObjectURL(pngUrl)
                    URL.revokeObjectURL(url)
                    toast.success('QR Code downloaded as PNG!')
                }, 'image/png')
            }

            img.onerror = () => {
                toast.error('Failed to convert QR code to PNG')
                URL.revokeObjectURL(url)
            }

            img.src = url
        } catch (error) {
            toast.error('Failed to download PNG')
            console.error(error)
        }
    }

    // Download as PDF
    const handleDownloadPDFV1 = () => {
        try {
            const svg = document.getElementById(`qr-${qrCode.qrCodeId}`)
            const svgData = new XMLSerializer().serializeToString(svg)

            // Create canvas
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()

            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
            const url = URL.createObjectURL(svgBlob)

            img.onload = () => {
                // Set canvas size
                canvas.width = size * 2
                canvas.height = size * 2

                // Draw white background
                ctx.fillStyle = 'white'
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                // Draw QR code
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                // Convert canvas to image data
                const imgData = canvas.toDataURL('image/png')

                // Create PDF
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                })

                // Add title
                pdf.setFontSize(16)
                pdf.setFont('helvetica', 'bold')
                pdf.text(qrCode.qrCodeName, 105, 20, { align: 'center' })

                // Add QR code (centered)
                const qrSize = 80 // Size in mm
                const xPos = (210 - qrSize) / 2 // Center on A4 width (210mm)
                pdf.addImage(imgData, 'PNG', xPos, 40, qrSize, qrSize)

                // Add URL
                pdf.setFontSize(10)
                pdf.setFont('helvetica', 'normal')
                pdf.text('Scan to access:', 105, 130, { align: 'center' })
                pdf.setFontSize(9)
                pdf.setTextColor(100, 100, 100)
                pdf.text(qrUrl, 105, 138, { align: 'center', maxWidth: 180 })

                // Add footer
                pdf.setFontSize(8)
                pdf.setTextColor(150, 150, 150)
                pdf.text('Generated by BoloIndia Platform', 105, 280, { align: 'center' })

                // Save PDF
                pdf.save(`${qrCode.qrCodeName}-QR.pdf`)

                URL.revokeObjectURL(url)
                toast.success('QR Code downloaded as PDF!')
            }

            img.onerror = () => {
                toast.error('Failed to convert QR code to PDF')
                URL.revokeObjectURL(url)
            }

            img.src = url
        } catch (error) {
            toast.error('Failed to download PDF')
            console.error(error)
        }
    }
// Enhanced PDF generation function
    const handleDownloadPDF = () => {
        try {
            const svg = document.getElementById(`qr-${qrCode.qrCodeId}`)
            const svgData = new XMLSerializer().serializeToString(svg)

            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()

            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
            const url = URL.createObjectURL(svgBlob)

            img.onload = () => {
                canvas.width = size * 2
                canvas.height = size * 2
                ctx.fillStyle = 'white'
                ctx.fillRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                const imgData = canvas.toDataURL('image/png')
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4',
                })

                // Header with gradient background
                pdf.setFillColor(102, 126, 234) // Primary color
                pdf.rect(0, 0, 210, 30, 'F')

                // Title
                pdf.setTextColor(255, 255, 255)
                pdf.setFontSize(20)
                pdf.setFont('helvetica', 'bold')
                pdf.text('BoloIndia QR Code', 105, 15, { align: 'center' })

                pdf.setFontSize(12)
                pdf.setFont('helvetica', 'normal')
                pdf.text(qrCode.qrCodeName, 105, 23, { align: 'center' })

                // QR Code with border
                const qrSize = 90
                const xPos = (210 - qrSize) / 2
                const yPos = 45

                // Add shadow/border
                pdf.setDrawColor(200, 200, 200)
                pdf.setLineWidth(0.5)
                pdf.rect(xPos - 2, yPos - 2, qrSize + 4, qrSize + 4, 'D')

                pdf.addImage(imgData, 'PNG', xPos, yPos, qrSize, qrSize)

                // Instructions box
                pdf.setFillColor(245, 247, 250)
                pdf.rect(20, 150, 170, 40, 'F')

                pdf.setTextColor(0, 0, 0)
                pdf.setFontSize(11)
                pdf.setFont('helvetica', 'bold')
                pdf.text('How to use:', 25, 158)

                pdf.setFontSize(9)
                pdf.setFont('helvetica', 'normal')
                pdf.text('1. Open camera or QR scanner app', 25, 165)
                pdf.text('2. Point camera at the QR code', 25, 171)
                pdf.text('3. Tap notification to open feedback form', 25, 177)
                pdf.text('4. Submit your valuable feedback', 25, 183)

                // URL section
                pdf.setFontSize(10)
                pdf.setFont('helvetica', 'bold')
                pdf.text('Direct URL:', 105, 200, { align: 'center' })

                pdf.setFontSize(8)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(100, 100, 100)
                pdf.text(qrUrl, 105, 207, { align: 'center', maxWidth: 180 })

                // QR Code Details
                pdf.setFontSize(9)
                pdf.setFont('helvetica', 'normal')
                pdf.setTextColor(120, 120, 120)
                pdf.text(`QR Code ID: ${qrCode.qrCodeId}`, 20, 220)
                pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 227)

                if (qrCode.location) {
                    pdf.text(`Location: ${qrCode.location}`, 20, 234)
                }

                // Footer
                pdf.setDrawColor(220, 220, 220)
                pdf.line(20, 270, 190, 270)

                pdf.setFontSize(8)
                pdf.setTextColor(150, 150, 150)
                pdf.text('Powered by BoloIndia Platform', 105, 278, { align: 'center' })
                pdf.text('Making citizen feedback accessible and actionable', 105, 284, { align: 'center' })

                pdf.save(`${qrCode.qrCodeName}-QR.pdf`)

                URL.revokeObjectURL(url)
                toast.success('QR Code downloaded as PDF!')
            }

            img.onerror = () => {
                toast.error('Failed to convert QR code to PDF')
                URL.revokeObjectURL(url)
            }

            img.src = url
        } catch (error) {
            toast.error('Failed to download PDF')
            console.error(error)
        }
    }

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(qrUrl)
        toast.success('QR URL copied to clipboard!')
    }

    const handleOpenUrl = () => {
        window.open(qrUrl, '_blank')
    }

    return (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
                QR Code Preview
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                {qrCode.qrCodeName}
            </Typography>

            {/* QR Code */}
            <Box
                sx={{
                    display: 'inline-block',
                    p: 2,
                    bgcolor: 'white',
                    borderRadius: 2,
                    boxShadow: 2,
                    mb: 2,
                }}
            >
                <QRCodeSVG
                    id={`qr-${qrCode.qrCodeId}`}
                    value={qrUrl}
                    size={size}
                    level="H"
                    includeMargin
                />
            </Box>

            {/* URL Display */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    justifyContent: 'center',
                    mb: 2,
                    p: 1,
                    bgcolor: 'background.default',
                    borderRadius: 1,
                }}
            >
                <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
                    {qrUrl}
                </Typography>
                <Tooltip title="Copy URL">
                    <IconButton size="small" onClick={handleCopyUrl}>
                        <CopyIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Open in new tab">
                    <IconButton size="small" onClick={handleOpenUrl}>
                        <OpenIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Download Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                <Typography variant="subtitle2" color="text.secondary">
                    Download Options:
                </Typography>

                <ButtonGroup variant="outlined" size="medium">
                    <Tooltip title="Best for web and scaling">
                        <Button
                            startIcon={<SvgIcon />}
                            onClick={handleDownloadSVG}
                        >
                            SVG
                        </Button>
                    </Tooltip>

                    <Tooltip title="Best for images and social media">
                        <Button
                            startIcon={<ImageIcon />}
                            onClick={handleDownloadPNG}
                        >
                            PNG
                        </Button>
                    </Tooltip>

                    <Tooltip title="Best for printing and documents">
                        <Button
                            startIcon={<PdfIcon />}
                            onClick={handleDownloadPDF}
                        >
                            PDF
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                Distributor can customize design on Android app
            </Typography>
        </Paper>
    )
}
