// pages/Responses/components/ResponseList/ViewModeSwitcher.jsx
import useResponseStore from '../../../../store/responseStore'
import { VIEW_MODES } from '../../constants/viewModes'
import {
    ListBulletIcon,
    TableCellsIcon,
    Squares2X2Icon
} from '@heroicons/react/24/outline'

const ViewModeSwitcher = () => {
    const { viewMode, setViewMode } = useResponseStore()

    const modes = [
        { key: VIEW_MODES.COMPACT, icon: ListBulletIcon, label: 'Compact' },
        { key: VIEW_MODES.TABLE, icon: TableCellsIcon, label: 'Table' },
        { key: VIEW_MODES.GRID, icon: Squares2X2Icon, label: 'Grid' }
    ]

    return (
        <div className="inline-flex bg-gray-100 rounded-lg p-1">
            {modes.map((mode) => {
                const Icon = mode.icon
                const isActive = viewMode === mode.key
                return (
                    <button
                        key={mode.key}
                        onClick={() => setViewMode(mode.key)}
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            isActive
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title={mode.label}
                    >
                        <Icon className="w-5 h-5" />
                    </button>
                )
            })}
        </div>
    )
}

export default ViewModeSwitcher
