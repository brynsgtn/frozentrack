import { useContext } from 'react'
import { AppContext } from '../App'


const DeleteItem = () => {

    const { deleteModal, selectedItem, setDeleteModal, setViewModal, handleDeleteItem, selectedIndex } = useContext(AppContext)!;
    return (
        <div>
            {deleteModal && selectedItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white px-4 py-6 rounded-xl shadow-md w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-2 text-red-600">
                            Delete Item
                        </h2>

                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete
                            <span className="font-semibold"> {selectedItem.name}</span>?
                            This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 hover:cursor-pointer"
                                onClick={() => setDeleteModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 hover:cursor-pointer"
                                onClick={() => {
                                    if (selectedIndex === null) return
                                    handleDeleteItem(selectedIndex)
                                    setDeleteModal(false)
                                    setViewModal(false)
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}

export default DeleteItem