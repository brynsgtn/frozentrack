import { useContext } from 'react'
import { AppContext } from '../App'
import type { Item } from '../App'


const AddItem  = () => {

  const {isModalOpen, handleAddItem, addItem, setAddItem, setIsModalOpen} = useContext(AppContext)!;

    return (
        <div>
            {/* Add Item Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className='bg-white px-4 py-6 rounded-xl shadow-md w-full max-w-sm'>
                        <h1 className='text-3xl font-bold mb-4'>Add Item</h1>
                        <form onSubmit={handleAddItem}>
                            <label className="text-md font-semibold mb-2 block">Name</label>
                            <input type="text" placeholder='Name' className='border-2 border-gray-300 p-2 rounded-md w-full mb-2' value={addItem?.name || ''} onChange={(e) => setAddItem({ ...addItem, name: e.target.value })} required />
                            <label className="text-md font-semibold mb-2 block">Category</label>
                            <select
                                className="border-2 border-gray-300 p-2 rounded-md w-full mb-2"
                                value={addItem.category}
                                onChange={(e) =>
                                    setAddItem({
                                        ...addItem,
                                        category: e.target.value as 'vegetable' | 'pork' | 'beef' | 'chicken' | 'fish' | 'dessert',
                                    })
                                }
                                required
                            >
                                <option value="vegetables">Vegetable</option>
                                <option value="pork">Pork</option>
                                <option value="beef">Beef</option>
                                <option value="chicken">Chicken</option>
                                <option value="fish">Fish</option>
                                <option value="desserts">Dessert</option>
                            </select>
                            <label className="text-md font-semibold block mb-2">Quantity</label>
                            <div className="flex gap-2 mb-4">

                                <input
                                    type="number"
                                    min={1}
                                    className="border-2 border-gray-300 p-2 rounded-md w-2/3"
                                    value={addItem.quantity}
                                    onChange={(e) =>
                                        setAddItem({ ...addItem, quantity: Number(e.target.value) })
                                    }
                                    required
                                />

                                <select
                                    className="border-2 border-gray-300 p-2 rounded-md w-1/3"
                                    value={addItem.unit}
                                    onChange={(e) =>
                                        setAddItem({ ...addItem, unit: e.target.value as Item['unit'] })
                                    }
                                    required
                                >
                                    <option value="pcs">pcs</option>
                                    <option value="pack">pack</option>
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                    <option value="bottle">bottle</option>
                                </select>
                            </div>

                            <label className="text-md font-semibold mb-2 block">Expiration Date</label>
                            <input type="date" placeholder='Expiration Date' className='border-2 border-gray-300 p-2 rounded-md w-full mb-4' value={addItem?.expirationDate || ''} onChange={(e) => setAddItem({ ...addItem, expirationDate: e.target.value })} required />
                            <div className='flex justify-end mt-2'>
                                <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 hover:cursor-pointer' type='submit' >Add</button>
                                <button className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 ms-2 hover:cursor-pointer' onClick={() => setIsModalOpen(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AddItem