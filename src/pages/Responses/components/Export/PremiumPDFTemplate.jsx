// pages/Responses/components/Export/PremiumPDFTemplate.jsx
import React from 'react'
import { format } from 'date-fns'

const PremiumPDFTemplate = React.forwardRef(({ response, formData, orgName }, ref) => {
    return (
        <div
            ref={ref}
            style={{
                width: '210mm',
                height: '297mm',
                padding: '20mm',
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
                backgroundColor: '#ffffff',
                color: '#1a202c',
                lineHeight: '1.6'
            }}
        >
            {/* Header with Branding */}
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.logo}>
                        <div style={styles.logoBall}>🔵</div>
                        <div>
                            <div style={styles.brandName}>BoloIndia</div>
                            <div style={styles.brandTagline}>Citizen Feedback System</div>
                        </div>
                    </div>
                    <div style={styles.headerMeta}>
                        <div style={styles.metaItem}>
                            <span style={styles.label}>Exported</span>
                            <span style={styles.value}>{format(new Date(), 'MMM dd, yyyy')}</span>
                        </div>
                        <div style={styles.metaItem}>
                            <span style={styles.label}>Org</span>
                            <span style={styles.value}>{orgName}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div style={styles.divider} />

            {/* Response Title Section */}
            <div style={styles.section}>
                <h1 style={styles.responseTitle}>
                    Response #{response.responseId?.slice(-8) || 'N/A'}
                </h1>
                <div style={styles.statusBadge} className={`status-${response.status?.toLowerCase()}`}>
                    {response.status || 'PENDING'}
                </div>
            </div>

            {/* Metadata Grid */}
            <div style={styles.metadataGrid}>
                <div style={styles.metadataBox}>
                    <div style={styles.metadataLabel}>Response ID</div>
                    <div style={styles.metadataValue}>{response.responseId}</div>
                </div>
                <div style={styles.metadataBox}>
                    <div style={styles.metadataLabel}>Submitted</div>
                    <div style={styles.metadataValue}>
                        {format(new Date(response.submittedAt), 'MMM dd, yyyy HH:mm')}
                    </div>
                </div>
                <div style={styles.metadataBox}>
                    <div style={styles.metadataLabel}>Citizen</div>
                    <div style={styles.metadataValue}>
                        {response.citizenEmail || response.citizenPhone || 'Anonymous'}
                    </div>
                </div>
                <div style={styles.metadataBox}>
                    <div style={styles.metadataLabel}>Status</div>
                    <div style={styles.metadataValue}>{response.status || 'PENDING'}</div>
                </div>
            </div>

            {/* Location Info */}
            {response.location && (
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>📍 Location</h3>
                    <div style={styles.locationBox}>
                        <div>
                            <strong>{response.location.city || 'N/A'}</strong>
                            {response.location.state && `, ${response.location.state}`}
                        </div>
                        {response.location.address && (
                            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                {response.location.address}
                            </div>
                        )}
                        {response.location.coordinates && (
                            <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                                {response.location.coordinates.lat.toFixed(4)}, {response.location.coordinates.lng.toFixed(4)}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Responses/Answers */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>📝 Response Details</h3>
                {Object.entries(response.answers || {}).map(([fieldId, answer], idx) => {
                    const field = formData?.fields?.find(f => f.fieldId === fieldId)
                    return (
                        <div key={idx} style={styles.answerBox}>
                            <div style={styles.answerLabel}>
                                {field?.fieldLabel || fieldId}
                                {field?.required && <span style={{ color: '#dc2626' }}>*</span>}
                            </div>
                            <div style={styles.answerValue}>
                                {typeof answer === 'object' ? JSON.stringify(answer, null, 2) : String(answer)}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Replies Section */}
            {response.orgReplies && response.orgReplies.length > 0 && (
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>💬 Organization Replies</h3>
                    {response.orgReplies.map((reply, idx) => (
                        <div key={idx} style={styles.replyBox}>
                            <div style={styles.replyHeader}>
                                <strong>{reply.repliedByEmail}</strong>
                                <span style={styles.replyDate}>
                                    {format(new Date(reply.repliedAt), 'MMM dd, yyyy')}
                                </span>
                            </div>
                            <div style={styles.replyMessage}>{reply.message}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Footer */}
            <div style={styles.footer}>
                <div style={styles.footerText}>
                    Generated by BoloIndia Response Management System
                </div>
                <div style={styles.footerDate}>
                    {format(new Date(), 'EEEE, MMMM dd, yyyy \'at\' HH:mm:ss')}
                </div>
            </div>
        </div>
    )
})

PremiumPDFTemplate.displayName = 'PremiumPDFTemplate'

// Inline Styles (all styling here)
const styles = {
    header: {
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '3px solid #3b82f6'
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    logoBall: {
        fontSize: '32px',
        fontWeight: 'bold'
    },
    brandName: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a202c',
        letterSpacing: '0.5px'
    },
    brandTagline: {
        fontSize: '11px',
        color: '#6b7280',
        marginTop: '2px'
    },
    headerMeta: {
        display: 'flex',
        gap: '20px',
        textAlign: 'right'
    },
    metaItem: {
        display: 'flex',
        flexDirection: 'column'
    },
    label: {
        fontSize: '10px',
        color: '#9ca3af',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    value: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#1a202c',
        marginTop: '2px'
    },
    divider: {
        height: '1px',
        backgroundColor: '#e5e7eb',
        margin: '20px 0'
    },
    section: {
        marginBottom: '25px'
    },
    responseTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a202c',
        margin: '0 0 10px 0',
        display: 'inline-block'
    },
    statusBadge: {
        display: 'inline-block',
        marginLeft: '15px',
        paddingLeft: '8px',
        paddingRight: '8px',
        paddingTop: '4px',
        paddingBottom: '4px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        // Will be modified by className below
    },
    metadataGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '15px',
        marginBottom: '30px',
        padding: '15px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px'
    },
    metadataBox: {
        padding: '10px'
    },
    metadataLabel: {
        fontSize: '10px',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '4px'
    },
    metadataValue: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#1a202c'
    },
    sectionTitle: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#1a202c',
        marginBottom: '12px',
        borderBottom: '2px solid #3b82f6',
        paddingBottom: '8px'
    },
    locationBox: {
        padding: '12px 15px',
        backgroundColor: '#eff6ff',
        borderLeft: '4px solid #3b82f6',
        borderRadius: '4px',
        fontSize: '12px'
    },
    answerBox: {
        marginBottom: '15px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e5e7eb'
    },
    answerLabel: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '6px'
    },
    answerValue: {
        fontSize: '12px',
        color: '#1a202c',
        padding: '10px 12px',
        backgroundColor: '#f9fafb',
        borderRadius: '4px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
    },
    replyBox: {
        marginBottom: '12px',
        paddingLeft: '15px',
        borderLeft: '3px solid #10b981'
    },
    replyHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px',
        fontSize: '12px'
    },
    replyDate: {
        color: '#9ca3af',
        fontSize: '11px'
    },
    replyMessage: {
        fontSize: '12px',
        color: '#374151',
        lineHeight: '1.5'
    },
    footer: {
        marginTop: '40px',
        paddingTop: '15px',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center',
        fontSize: '10px',
        color: '#9ca3af'
    },
    footerText: {
        marginBottom: '4px'
    },
    footerDate: {
        fontSize: '9px',
        color: '#d1d5db'
    }
}

// Status-specific styling
const statusStyles = `
    .status-pending { background: #fef3c7; color: #92400e; }
    .status-reviewed { background: #dbeafe; color: #1e40af; }
    .status-resolved { background: #dcfce7; color: #166534; }
    .status-rejected { background: #fee2e2; color: #991b1b; }
    .status-spam { background: #fecaca; color: #7f1d1d; }
`

export default PremiumPDFTemplate
