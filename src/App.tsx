
import { useEffect, useState } from 'react'
import './App.css'

function App() {

  type Item = {
    name: string,
    category: 'vegetables' | 'pork' | 'beef' | 'chicken' | 'fish' | 'desserts',
    quantity: number,
    dateFrozen: string,
    expirationDate: string,
    status: 'fresh' | 'expiringSoon' | 'expired'
  }

  const today: string = new Date().toISOString().split('T')[0];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const [items, setItems] = useState<Item[]>([]);

  const [addItem, setAddItem] = useState<Item>({
    name: '',
    category: 'vegetables',
    quantity: 0,
    dateFrozen: '',
    expirationDate: '',
    status: 'fresh'
  });

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (addItem) {
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
      setAddItem(newItem)
      setIsModalOpen(false)
    }
  }


  useEffect(() => {
    console.log('Adding item:', addItem)
  }, [addItem])



  return (
    <div className='bg-gray-100 min-h-screen p-4 grid place-items-center'>
      <div className='bg-white mx-auto max-w-sm p-4 rounded-xl shadow-md'>
        <h1 className='text-3xl font-bold mb-4'>Frozen Track</h1>
        <h3 className='text-xl font-semibold mb-2'>Inventory</h3>
        <button className='bg-blue-500 text-white px-4 py-2 rounded-md mb-4 w-full hover:bg-blue-600 hover:cursor-pointer' onClick={() => setIsModalOpen(true)}>Add Item</button>
        <input type="text" placeholder="Search" className='border border-gray-300 px-4 py-2 rounded-md mb-4 w-full' />
        <table className='w-full'>
          <thead>
            <tr className='border-b-2 border-gray-300'>
              <th className='text-left font-normal py-3'>Name</th>
              <th className='text-left font-normal py-3'>Qty</th>
              <th className='text-left font-normal py-3'>Status</th>
              <th className='text-left font-normal py-3'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr className='border-b-2 border-gray-300' key={index}>
                <td className='py-3'>{item.name}</td>
                <td className='py-3'>{item.quantity}</td>
                <td className='py-3'>{item.status}</td>
                <td>
                  <button className='px-2 py-1 rounded-md hover:cursor-pointer'><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32zm-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9z"></path></svg></button>
                  <button className='px-2 py-1 rounded-md hover:cursor-pointer'><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200 0H360v-72h304v72z"></path></svg></button></td>
              </tr>
            ))}
          </tbody>

        </table>
        <div className='w-full mt-4 flex items-center justify-between px-4 py-2'>
          <div>1-5 of 7</div>
          <div >1 2 3 4 5</div>
        </div>
      </div>
      {/* Add Item Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className='bg-white p-4 rounded-xl shadow-md w-full max-w-sm'>
            <h1 className='text-3xl font-bold mb-4'>Add Item</h1>
            <form onSubmit={handleAddItem}>
              <input type="text" placeholder='Name' className='border-2 border-gray-300 p-2 rounded-md w-full mb-4' value={addItem?.name || ''} onChange={(e) => setAddItem({ ...addItem, name: e.target.value })} />
              <select
                className="border-2 border-gray-300 p-2 rounded-md w-full mb-4"
                value={addItem.category}
                onChange={(e) =>
                  setAddItem({
                    ...addItem,
                    category: e.target.value as 'vegetables' | 'pork' | 'beef' | 'chicken' | 'fish' | 'desserts',
                  })
                }
              >
                <option value="vegetables">Vegetables</option>
                <option value="pork">Pork</option>
                <option value="beef">Beef</option>
                <option value="chicken">Chicken</option>
                <option value="fish">Fish</option>
                <option value="desserts">Desserts</option>
              </select>

              <input type="number" placeholder='Quantity' className='border-2 border-gray-300 p-2 rounded-md w-full mb-4' value={addItem?.quantity.toString() || ''} onChange={(e) => setAddItem({ ...addItem, quantity: parseInt(e.target.value) || 0 })} />
              <input type="date" placeholder='Expiration Date' className='border-2 border-gray-300 p-2 rounded-md w-full mb-4' value={addItem?.expirationDate || ''} onChange={(e) => setAddItem({ ...addItem, expirationDate: e.target.value })} />
              <div className='flex justify-end'>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600' type='submit' >Add</button>
                <button className='bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 ms-2' onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </form>
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

Add Frozen Items
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
