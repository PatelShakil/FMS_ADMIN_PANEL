// pages/Responses/components/ServiceSelector/ServiceSelector.jsx - NEW FILE
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { serviceService } from '../../../../api/services/serviceService'
import { orgService } from '../../../../api/services/orgService'
import useResponseStore from '../../../../store/responseStore'
import {
    ChevronDownIcon,
    MagnifyingGlassIcon,
    BuildingOffice2Icon
} from '@heroicons/react/24/outline'
import {useAuthStore} from "../../../../store/authStore.js";

const ServiceSelector = () => {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const { selectedServiceId, setSelectedServiceId, filters, setFilters } = useResponseStore()
    const {user,role} = useAuthStore();
    // Get user's org
    const { data: orgData } = useQuery({
        queryKey: ['myOrg'],
        queryFn: () => role == "ORG_OWNER" ? orgService.getMyOrg() : orgService.getOrgById(user?.orgId)
    })

    const orgId = orgData?.data?.id

    // Fetch services
    const { data: servicesData, isLoading } = useQuery({
        queryKey: ['services', orgId],
        queryFn: () => serviceService.getServicesByOrg(orgId),
        enabled: !!orgId
    })

    const services = servicesData || []
    const selectedService = services.find((s) => s.id === selectedServiceId)

    // Filter services by search
    const filteredServices = services.filter((service) =>
        service.serviceName.toLowerCase().includes(search.toLowerCase()) ||
        service.serviceCode.toLowerCase().includes(search.toLowerCase())
    )

    const handleSelectService = (serviceId) => {
        setSelectedServiceId(serviceId)
        setFilters({ ...filters, serviceId, formId: null }) // Reset form when service changes
        setOpen(false)
        setSearch('')
    }

    const handleClearService = () => {
        setSelectedServiceId(null)
        setFilters({ ...filters, serviceId: null, formId: null })
    }

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <BuildingOffice2Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">
                        {selectedService?.serviceName || 'All Services'}
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-gray-600" />
                </button>

                {selectedServiceId && (
                    <button
                        onClick={handleClearService}
                        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
                        {/* Search */}
                        <div className="p-3 border-b">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Services List */}
                        <div className="overflow-y-auto flex-1 p-2">
                            {/* All Services Option */}
                            <button
                                onClick={() => handleSelectService(null)}
                                className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm font-medium text-gray-900"
                            >
                                All Services
                            </button>

                            <div className="h-px bg-gray-200 my-2" />

                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto" />
                                </div>
                            ) : filteredServices.length === 0 ? (
                                <p className="text-gray-500 text-center py-8 text-sm">No services found</p>
                            ) : (
                                filteredServices.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => handleSelectService(service.id)}
                                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                            selectedServiceId === service.id
                                                ? 'bg-primary-50 text-primary-700 font-medium'
                                                : 'hover:bg-gray-50 text-gray-900'
                                        }`}
                                    >
                                        <div className="font-medium">{service.serviceName}</div>
                                        <div className="text-xs text-gray-600 mt-0.5">
                                            {service.serviceCode}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ServiceSelector
