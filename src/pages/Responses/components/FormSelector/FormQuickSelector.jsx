// pages/Responses/components/FormSelector/FormQuickSelector.jsx
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { feedbackService } from '../../../../api/services/feedbackService'
import { orgService } from '../../../../api/services/orgService'
import useResponseStore from '../../../../store/responseStore'
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    DocumentTextIcon,
    ClockIcon
} from '@heroicons/react/24/outline'
import {useAuthStore} from "../../../../store/authStore.js";

const FormQuickSelector = ({ compact = false }) => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const { selectedFormId, setSelectedFormId } = useResponseStore()
    const {user,role} = useAuthStore();

    // Get user's org
    const { data: orgData } = useQuery({
        queryKey: ['myOrg'],
        queryFn: () => role == "ORG_OWNER" ? orgService.getMyOrg() : orgService.getOrgById(user?.orgId),
    })

    const orgId = orgData?.data?.id

    // Fetch all forms for the org
    const { data: formsData, isLoading } = useQuery({
        queryKey: ['forms', orgId],
        queryFn: () => feedbackService.getAllForms({ orgId, status: 'ACTIVE' }),
        enabled: !!orgId
    })

    const forms = formsData?.data || []
    const selectedForm = forms.find((f) => f.formId === selectedFormId)

    // Filter forms by search
    const filteredForms = forms.filter((form) =>
        form.formName.toLowerCase().includes(search.toLowerCase())
    )

    // Get recent forms from localStorage
    const getRecentForms = () => {
        try {
            const recent = localStorage.getItem('recentForms')
            return recent ? JSON.parse(recent) : []
        } catch {
            return []
        }
    }

    const addToRecent = (formId) => {
        const recent = getRecentForms()
        const updated = [formId, ...recent.filter((id) => id !== formId)].slice(0, 5)
        localStorage.setItem('recentForms', JSON.stringify(updated))
    }

    const handleSelectForm = (formId) => {
        setSelectedFormId(formId)
        addToRecent(formId)
        setOpen(false)
        setSearch('')
    }

    const recentFormIds = getRecentForms()
    const recentForms = forms.filter((f) => recentFormIds.includes(f.formId))

    if (compact) {
        return (
            <div className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <DocumentTextIcon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                        {selectedForm?.formName || 'Select Form'}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                </button>

                {open && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpen(false)}
                        />
                        <FormDropdown
                            forms={filteredForms}
                            recentForms={recentForms}
                            search={search}
                            setSearch={setSearch}
                            onSelect={handleSelectForm}
                            isLoading={isLoading}
                        />
                    </>
                )}
            </div>
        )
    }

    // Full view (non-compact)
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Form</h2>

            {/* Search */}
            <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search forms..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
            </div>

            {/* Recent Forms */}
            {recentForms.length > 0 && !search && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <ClockIcon className="w-4 h-4 text-gray-500" />
                        <h3 className="text-sm font-semibold text-gray-700">Recent</h3>
                    </div>
                    <div className="space-y-2">
                        {recentForms.map((form) => (
                            <FormCard
                                key={form.formId}
                                form={form}
                                onSelect={handleSelectForm}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* All Forms */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    {search ? 'Search Results' : 'All Forms'}
                </h3>
                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto" />
                    </div>
                ) : filteredForms.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No forms found</p>
                ) : (
                    <div className="space-y-2">
                        {filteredForms.map((form) => (
                            <FormCard
                                key={form.formId}
                                form={form}
                                onSelect={handleSelectForm}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

const FormCard = ({ form, onSelect }) => {
    return (
        <button
            onClick={() => onSelect(form.formId)}
            className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-primary-700">
                        {form.formName}
                    </h4>
                    {form.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {form.description}
                        </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{form.fields?.length || 0} fields</span>
                        <span>•</span>
                        <span className="capitalize">{form.status?.toLowerCase()}</span>
                    </div>
                </div>
                <DocumentTextIcon className="w-6 h-6 text-gray-400 group-hover:text-primary-600" />
            </div>
        </button>
    )
}

const FormDropdown = ({ forms, recentForms, search, setSearch, onSelect, isLoading }) => {
    return (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
            {/* Search */}
            <div className="p-3 border-b">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search forms..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        autoFocus
                    />
                </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
                {/* Recent */}
                {recentForms.length > 0 && !search && (
                    <div className="p-3 border-b bg-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                            <ClockIcon className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs font-semibold text-gray-700">Recent</span>
                        </div>
                        <div className="space-y-1">
                            {recentForms.map((form) => (
                                <button
                                    key={form.formId}
                                    onClick={() => onSelect(form.formId)}
                                    className="w-full text-left px-3 py-2 rounded hover:bg-white text-sm"
                                >
                                    {form.formName}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Forms */}
                <div className="p-2">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto" />
                        </div>
                    ) : forms.length === 0 ? (
                        <p className="text-gray-500 text-center py-8 text-sm">No forms found</p>
                    ) : (
                        forms.map((form) => (
                            <button
                                key={form.formId}
                                onClick={() => onSelect(form.formId)}
                                className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm"
                            >
                                <div className="font-medium text-gray-900">{form.formName}</div>
                                {form.description && (
                                    <div className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                                        {form.description}
                                    </div>
                                )}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default FormQuickSelector
