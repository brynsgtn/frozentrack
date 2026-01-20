import { useContext } from "react";
import { AppContext } from "../App";

const EditItem = () => {
    const { editModal, selectedItem, setSelectedItem, handleEditItem, setEditModal, selectedIndex } = useContext(AppContext)!;
    return (
        <div>
            {editModal && selectedItem && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white px-4 py-6 rounded-xl shadow-md w-full max-w-sm">
                        <h1 className="text-3xl font-bold mb-4">Edit Item</h1>

                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={selectedItem.name}
                                    onChange={(e) =>
                                        setSelectedItem({ ...selectedItem, name: e.target.value })
                                    }
                                    className="border-2 border-gray-200 p-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    value={selectedItem.category}
                                    onChange={(e) =>
                                        setSelectedItem({ ...selectedItem, category: e.target.value as 'vegetable' | 'pork' | 'beef' | 'chicken' | 'fish' | 'dessert', })
                                    }
                                    className="border-2 border-gray-200 p-2 rounded-md w-full capitalize"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    value={selectedItem.quantity}
                                    min={1}
                                    onChange={(e) =>
                                        setSelectedItem({ ...selectedItem, quantity: Number(e.target.value) })
                                    }
                                    className="border-2 border-gray-200 p-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                                    Freeze Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedItem.dateFrozen || ''}
                                    onChange={(e) =>
                                        setSelectedItem({ ...selectedItem, dateFrozen: e.target.value })
                                    }
                                    className="border-2 border-gray-200 p-2 rounded-md w-full"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-gray-600 mb-1 block">
                                    Expiration Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedItem.expirationDate || ''}
                                    onChange={(e) =>
                                        setSelectedItem({ ...selectedItem, expirationDate: e.target.value })
                                    }
                                    className="border-2 border-gray-200 p-2 rounded-md w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 gap-1.5">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:cursor-pointer"
                                onClick={() => handleEditItem(selectedIndex!, selectedItem)}
                            >
                                Save
                            </button>

                            <button
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 hover:cursor-pointer"
                                onClick={() => setEditModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditItem