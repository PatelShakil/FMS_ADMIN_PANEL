// store/responseStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useResponseStore = create(
    persist(
        (set, get) => ({
            // Selected Form
            selectedFormId: null,
            selectedServiceId: null, // ADD THIS

            setSelectedFormId: (formId) => set({ selectedFormId: formId }),
            setSelectedServiceId: (serviceId) => set({ selectedServiceId: serviceId }),
            // View Mode
            viewMode: 'table', // 'compact', 'table', 'grid'
            setViewMode: (mode) => set({ viewMode: mode }),

            // Filters
            filters: {
                status: null,
                startDate: null,
                endDate: null,
                isFlagged: null,
                qrCodeId: null,
                search: '',
                page: 1,
                pageSize: 20,
                sortBy: 'submittedAt',
                sortOrder: 'desc'
            },
            setFilters: (newFilters) =>
                set((state) => ({
                    filters: { ...state.filters, ...newFilters, page: 1 }
                })),
            resetFilters: () =>
                set({
                    filters: {
                        status: null,
                        startDate: null,
                        endDate: null,
                        isFlagged: null,
                        qrCodeId: null,
                        search: '',
                        page: 1,
                        pageSize: 20,
                        sortBy: 'submittedAt',
                        sortOrder: 'desc'
                    }
                }),

            // Selected Responses (for bulk actions)
            selectedResponses: [],
            toggleResponseSelection: (responseId) =>
                set((state) => ({
                    selectedResponses: state.selectedResponses.includes(responseId)
                        ? state.selectedResponses.filter((id) => id !== responseId)
                        : [...state.selectedResponses, responseId]
                })),
            selectAllResponses: (responseIds) =>
                set({ selectedResponses: responseIds }),
            clearSelection: () => set({ selectedResponses: [] }),

            // Detail Drawer
            detailDrawerOpen: false,
            selectedResponseId: null,
            openDetailDrawer: (responseId) =>
                set({ detailDrawerOpen: true, selectedResponseId: responseId }),
            closeDetailDrawer: () =>
                set({ detailDrawerOpen: false, selectedResponseId: null })
        }),
        {
            name: 'response-store',
            partialize: (state) => ({
                viewMode: state.viewMode,
                filters: state.filters,
                selectedFormId: state.selectedFormId
            })
        }
    )
)

export default useResponseStore
