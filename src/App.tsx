
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  type Item = {
    name: string,
    category: 'vegetable' | 'pork' | 'beef' | 'chicken' | 'fish' | 'dessert',
    quantity: number,
    unit: '' | 'pcs' | 'pack' | 'kg' | 'g' | 'bottle',
    dateFrozen: string,
    expirationDate: string,
    status: 'fresh' | 'expiringSoon' | 'expired'
  }

  const categories: String[] = ['vegetable', 'pork', 'beef', 'chicken', 'fish', 'dessert']

  const today: string = new Date().toISOString().split('T')[0];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const [items, setItems] = useState<Item[]>([]);

  const [addItem, setAddItem] = useState<Item>({
    name: '',
    category: 'vegetable',
    quantity: 1,
    unit: '',
    dateFrozen: today,
    expirationDate: '',
    status: 'fresh'
  });

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)


  const [viewModal, setViewModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);


  const handleAddItem = (e: React.FormEvent<HTMLFormElement>): void => {

    e.preventDefault();

    if (addItem) {
      console.log('Adding item:', addItem)
      setItems([...items, addItem])
      setAddItem({
        name: '',
        category: 'vegetables',
        quantity: 0,
        dateFrozen: today,
        expirationDate: '',
        status: 'fresh'
      })
      setIsModalOpen(false)
    } else {
      console.log('No item added')
    }
  }

  const handleAddQuantity = (index: number): void => {
    setItems(prevItems =>
      prevItems.map((item, i) => i === index ? { ...item, quantity: item.quantity + 1 } : item)
    );

  }

  const handleMinusQuantity = (index: number): void => {
    setItems(prevItems =>
      prevItems.map((item, i) => i === index ? { ...item, quantity: item.quantity - 1 } : item).filter(item => item.quantity > 0)
    );

  }

  const handleDeleteItem = (index: number): void => {
    setItems(prevItems => prevItems.filter((_, i) => i !== index))
    setSelectedItem(null)
    setSelectedIndex(null)
  }

  const handleSelectItem = (index: number, item: Item): void => {
    console.log('Selected item at index', index, ':', item)
    setSelectedItem(item)
    setSelectedIndex(index)
    setViewModal(true)
  }

  const openEditItemModal = (index: number, item: Item): void => {
    setViewModal(false)
    setEditModal(true)
    setSelectedItem(item)
    setSelectedIndex(index)
  }

  const handleEditItem = (index: number, selectedItem: Item): void => {
    setItems(prevItems =>
      prevItems.map((item, i) => i === index ? selectedItem : item)
    );
    setEditModal(false)
    setSelectedItem(null)
    setSelectedIndex(null)
  }

  useEffect(() => {
    console.log('Adding item:', addItem)
  }, [addItem])



  return (
    <div className='bg-gray-100 min-h-screen p-4 grid place-items-center'>
      <div className='bg-white mx-auto max-w-sm p-4 rounded-xl shadow-md'>
        <h1 className='text-3xl font-bold mb-4'>Frozen Track</h1>

        <button className='bg-blue-500 text-white px-4 py-2 rounded-md mb-4 w-full hover:bg-blue-600 hover:cursor-pointer' onClick={() => setIsModalOpen(true)}>Add Item</button>
        <input type="text" placeholder="Search" className='border border-gray-300 px-4 py-2 rounded-md mb-4 w-full' />
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category, index) => (
            <button
              key={index}
              className="inline-flex items-center rounded-xl bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700
                 hover:bg-blue-200 hover:scale-105 transition-all duration-200 shadow-sm hover:cursor-pointer"
            >
              {category}
            </button>
          ))}
        </div>
        <div className='flex items-center mb-2'>
          <h3 className='text-lg font-medium '>All Items</h3>
          {/* <button className='ms-auto text-sm hover:cursor-pointer transition-transform duration-150 active:scale-90 hover:text-blue-500'>Edit</button> */}
        </div>

        <div className='w-full'>
          {items.length > 0 ? (
            <div>
              {items.map((item, index) => (
                <div className='flex items-center px-3 bg-gray-100 rounded-xl mb-4' key={index}>
                  <div className=''>
                    <div className='font-semibold'>{item.name.toUpperCase()}</div>

                  </div>
                  <div className='ms-2'>
                    <span className="inline-flex items-center rounded-xl bg-green-400/10 px-1.5 py-0.5  text-xs font-medium text-green-400 inset-ring inset-ring-green-500/20">
                      {item.status}
                    </span>
                  </div>
                  <div className='ms-2'>
                    <button
                      className='py-2 rounded-md hover:cursor-pointer'
                      onClick={() => handleSelectItem(index, item)}>
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M396 512a112 112 0 1 0 224 0 112 112 0 1 0-224 0zm546.2-25.8C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM508 688c-97.2 0-176-78.8-176-176s78.8-176 176-176 176 78.8 176 176-78.8 176-176 176z"></path></svg>
                    </button>
                  </div>

                  {/* <div>
                  <button className='px-2 py-1 rounded-md hover:cursor-pointer'><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32zm-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9z"></path></svg></button>
                  <button className='px-2 py-1 rounded-md hover:cursor-pointer'><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200 0H360v-72h304v72z"></path></svg></button>
                </div> */}
                  <div className='flex justify-between items-center ms-auto'>
                    <button className='px-1 py-1 text-white rounded-md hover:cursor-pointer bg-blue-500 me-2  transition-transform duration-150 active:scale-90   hover:bg-blue-600'
                      onClick={() => handleAddQuantity(index)}>
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" version="1.1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><defs></defs><path d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z" ></path><path d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z" ></path></svg>
                    </button>
                    <div className='py-5 ms-auto'>{item.quantity} {item.unit}</div>
                    <button className='px-1 py-1 ms-2  text-white rounded-md hover:cursor-pointer  bg-blue-500 me-2  transition-transform duration-150 active:scale-90   hover:bg-blue-600'
                      onClick={() => handleMinusQuantity(index)}>
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg>
                    </button>

                  </div>

                  {/* <div className='py-5'>{item.expirationDate}</div> */}

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 h-20 grid place-items-center">
              <p className="text-gray-500">No items found</p>
            </div>
          )}


        </div>
        <div className='w-full mt-4 flex items-center justify-between px-4 py-2'>
          <div>1-5 of 7</div>
          <div >1 2 3 4 5</div>
        </div>
      </div>
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
                  <option value="" disabled >Select</option>
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
                <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600' type='submit' >Add</button>
                <button className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 ms-2' onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Item Modal */}
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
                  {selectedItem.dateFrozen || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Expiration Date
                </p>
                <p className="border-2 border-gray-200 p-2 rounded-md">
                  {selectedItem.expirationDate || 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-1.5">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => openEditItemModal(selectedIndex!, selectedItem)}
              >
                Edit
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                onClick={() => {
                  if (selectedIndex === null) return

                  if (confirm('Delete this item?')) {
                    handleDeleteItem(selectedIndex)
                    setViewModal(false)
                  }
                }}

              >
                Delete
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Edit Item Modal */}
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
                  Status
                </label>
                <select
                  value={selectedItem.status}
                  onChange={(e) =>
                    setSelectedItem({ ...selectedItem, status: e.target.value as 'fresh' | 'expiringSoon' | 'expired' })
                  }
                  className="border-2 border-gray-200 p-2 rounded-md w-full"
                >
                  <option value="fresh">Fresh</option>
                  <option value="expiringSoon">Expiring</option>
                  <option value="expired">Expired</option>
                </select>
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
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => handleEditItem(selectedIndex!, selectedItem)}
              >
                Save
              </button>

              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
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

export default App


/*
=====================================
FrozenTrack Features
=====================================

Core Features (MVP)

Add Frozen Items DONE
- Name: string 
- Category: vegetables | meat | meals | desserts
- Quantity: number
- Date frozen: Date
- Expiration date: Date

Inventory List
- Typed item list using interfaces or types
- Sort by expiration date or quantity
- Filter by category

Edit and Delete Items
- Controlled forms with proper typing
- Confirmation modal for deletion

Expiration Alerts (UI-based)
- Highlight items expiring soon
- Status labels:
  - Fresh
  - Expiring Soon
  - Expired

-------------------------------------

Intermediate Features
Focus: Stronger TypeScript practice

Strict Typing
- Enums for categories and item status
- Utility types: Partial, Pick, Omit
- Custom hooks with generics

Search Functionality
- Typed search input
- Case-insensitive matching

Local Storage Persistence
- Typed storage helpers
- Restore state safely on reload

Reusable Components
- Typed table, form, modal, badge components
- Props validation using TypeScript instead of PropTypes

-------------------------------------

Advanced Features
Focus: Portfolio-ready features

Notifications Logic
- Days-before-expiry setting
- Computed reminders using date utilities

Analytics Dashboard
- Total items count
- Expired vs usable items
- Category breakdown

Batch Actions
- Select multiple items
- Delete or update quantities in bulk

Optional Backend or Auth
- Firebase or simple Express API
- User-specific inventories

=====================================
*/
