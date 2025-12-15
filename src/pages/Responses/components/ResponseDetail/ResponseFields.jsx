// pages/Responses/components/ResponseDetail/ResponseFields.jsx
import {
    PhotoIcon,
    VideoCameraIcon,
    SpeakerWaveIcon,
    DocumentIcon,
    MapPinIcon,
    StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

const ResponseFields = ({ response, formData }) => {
    const answers = response.answers || {}
    const fields = formData?.fields || []

    // Sort fields by order
    const sortedFields = [...fields].sort((a, b) => a.order - b.order)

    return (
        <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Response Details</h4>

            {sortedFields.map((field) => {
                const answer = answers[field.fieldId]
                if (!answer) return null

                return (
                    <FieldRenderer
                        key={field.fieldId}
                        field={field}
                        answer={answer}
                    />
                )
            })}
        </div>
    )
}

const FieldRenderer = ({ field, answer }) => {
    const renderFieldValue = () => {
        switch (field.fieldType.toLowerCase()) {
            case 'image':
                return (
                    <div className="mt-2">
                        <img
                            src={answer}
                            alt={field.fieldLabel}
                            className="max-w-full h-auto rounded-lg border border-gray-200"
                        />
                    </div>
                )

            case 'video':
                return (
                    <div className="mt-2">
                        <video
                            src={answer}
                            controls
                            className="max-w-full h-auto rounded-lg border border-gray-200"
                        />
                    </div>
                )

            case 'audio':
                return (
                    <div className="mt-2">
                        <audio src={answer} controls className="w-full" />
                    </div>
                )

            case 'file':
                return (
                    <a
                        href={answer}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                    >
                        <DocumentIcon className="w-5 h-5" />
                        Download File
                    </a>
                )

            case 'location':
                const location = typeof answer === 'string' ? JSON.parse(answer) : answer
                return (
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-900 font-medium">
                            {location.address || 'Location captured'}
                        </p>
                        {location.coordinates && (
                            <p className="text-xs text-gray-600 mt-1">
                                Lat: {location.coordinates.lat.toFixed(6)}, Lng:{' '}
                                {location.coordinates.lng.toFixed(6)}
                            </p>
                        )}
                    </div>
                )

            case 'rating':
                return (
                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => {
                            const StarComponent = i < answer ? StarIconSolid : StarIcon
                            return (
                                <StarComponent
                                    key={i}
                                    className={`w-6 h-6 ${
                                        i < answer ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                />
                            )
                        })}
                        <span className="ml-2 text-sm font-medium text-gray-700">
                            {answer} / 5
                        </span>
                    </div>
                )

            case 'checkbox':
                const checkboxAnswers = Array.isArray(answer) ? answer : [answer]
                return (
                    <div className="mt-2 space-y-1">
                        {checkboxAnswers.map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 text-sm text-gray-700"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-600" />
                                {item}
                            </div>
                        ))}
                    </div>
                )

            case 'textarea':
                return (
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-900 whitespace-pre-wrap">{answer}</p>
                    </div>
                )

            default:
                return (
                    <p className="mt-2 text-sm text-gray-900 font-medium">
                        {answer?.toString()}
                    </p>
                )
        }
    }

    return (
        <div className="p-4 bg-white border border-gray-200 rounded-lg">
            <label className="text-sm font-semibold text-gray-700">
                {field.fieldLabel}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderFieldValue()}
        </div>
    )
}

export default ResponseFields
