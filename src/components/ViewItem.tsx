
import { useContext } from 'react'
import { AppContext, formatDate } from '../App'


const ViewItem = () => {
     const { viewModal, selectedItem, openEditItemModal, setDeleteModal, setViewModal, selectedIndex } = useContext(AppContext)!;
     
    return (
        <div>
            {viewModal && selectedItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white px-4 py-6 rounded-xl shadow-md w-full max-w-sm">
                        <h1 className="text-3xl font-bold mb-4">Item Details</h1>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">Name</p>
                                <p className="border-2 border-gray-200 p-2 rounded-md">
                                    {selectedItem.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">Category</p>
                                <p className="border-2 border-gray-200 p-2 rounded-md capitalize">
                                    {selectedItem.category}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">Status</p>
                                <p className="border-2 border-gray-200 p-2 rounded-md capitalize">
                                    {selectedItem.status}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">Quantity</p>
                                <p className="border-2 border-gray-200 p-2 rounded-md">
                                    {selectedItem.quantity} {selectedItem.unit}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">
                                    Freeze Date
                                </p>
                                <p className="border-2 border-gray-200 p-2 rounded-md">
                                    {formatDate(selectedItem.dateFrozen) || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-1">
                                    Expiration Date
                                </p>
                                <p className="border-2 border-gray-200 p-2 rounded-md">
                                    {formatDate(selectedItem.expirationDate) || 'N/A'}
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 gap-1.5">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:cursor-pointer"
                                onClick={() => openEditItemModal(selectedIndex!, selectedItem)}
                            >
                                Edit
                            </button>

                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:cursor-pointer"
                                onClick={() => {
                                    if (selectedIndex === null) return
                                    setDeleteModal(true)
                                }}

                            >
                                Delete
                            </button>
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 hover:cursor-pointer"
                                onClick={() => setViewModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ViewItem