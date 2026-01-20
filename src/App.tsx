
import { useEffect, useState, createContext } from 'react'
import './App.css'
import AddItem from './components/AddItem'
import ViewItem from './components/ViewItem'


export type Item = {
  name: string,
  category: 'vegetable' | 'pork' | 'beef' | 'chicken' | 'fish' | 'dessert',
  quantity: number,
  unit: 'pcs' | 'pack' | 'kg' | 'g' | 'bottle',
  dateFrozen: string,
  expirationDate: string,
  status: 'fresh' | 'expiringSoon' | 'expired'
}

type AddItemContext = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddItem: (e: React.FormEvent<HTMLFormElement>) => void;
  addItem: Item;
  setAddItem: React.Dispatch<React.SetStateAction<Item>>;
};

type ViewItemContext = {
  viewModal: boolean;
  selectedItem: Item | null;
  openEditItemModal: (index: number, item: Item) => void;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedIndex?: number | null;
};

export const AddItemContext = createContext<AddItemContext | null>(null)
export const ViewItemContext = createContext<ViewItemContext | null>(null)


export const formatDate = (date: string): string => {
  if (!date) return 'N/A';

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};


function App() {




  const ITEMS_PER_PAGE: number = 5;

  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories: String[] = ['all', 'vegetable', 'pork', 'beef', 'chicken', 'fish', 'dessert']

  const today: string = new Date().toISOString().split('T')[0];

  const itemsInStorage: string | null = localStorage.getItem('frozenItems');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const [items, setItems] = useState<Item[]>(itemsInStorage ? JSON.parse(itemsInStorage) : []);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [filteredCategory, setFilteredCategory] = useState<String>('all');

  const [addItem, setAddItem] = useState<Item>({
    name: '',
    category: 'vegetable',
    quantity: 1,
    unit: 'pcs',
    dateFrozen: today,
    expirationDate: '',
    status: 'fresh'
  });

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)


  const [viewModal, setViewModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);




  const handleAddItem = (e: React.FormEvent<HTMLFormElement>): void => {

    e.preventDefault();

    if (addItem) {
      console.log('Adding item:', addItem)
      setItems([...items, addItem])
      setAddItem({
        name: '',
        category: 'vegetable',
        quantity: 0,
        dateFrozen: today,
        expirationDate: '',
        unit: 'pcs',
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
    const updatedItem = {
      ...selectedItem,
      status: getItemStatus(selectedItem.expirationDate)
    };

    setItems(prevItems =>
      prevItems.map((item, i) => (i === index ? updatedItem : item))
    );
    setEditModal(false)
    setSelectedItem(null)
    setSelectedIndex(null)
  }




  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filteredCategory === 'all' || item.category === filteredCategory)
  );

  const handleCategoryClick = (category: String): void => {
    setFilteredCategory(category);
  }

  const getItemStatus = (expirationDate: string): 'fresh' | 'expiringSoon' | 'expired' => {
    if (!expirationDate) return 'fresh';

    const today = new Date();
    const expDate = new Date(expirationDate);

    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'expired';
    if (diffDays <= 7) return 'expiringSoon';

    return 'fresh';
  };


  const totalItems: number = filteredItems.length;
  const totalPages: number = Math.ceil(totalItems / ITEMS_PER_PAGE)

  const startIndex: number = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex: number = startIndex + ITEMS_PER_PAGE

  const paginatedItems = filteredItems.slice(startIndex, endIndex)



  useEffect(() => {
    console.log('Adding item:', addItem)
    console.log('Current items:', items)
    console.log('Paginated items:', paginatedItems)
    console.log('Category filter:', filteredCategory)
  }, [addItem, items, paginatedItems, filteredCategory])

  useEffect(() => {
    setItems(prevItems =>
      prevItems.map(item => ({
        ...item,
        status: getItemStatus(item.expirationDate)
      }))
    );
  }, [items.length]);

  useEffect(() => {
    localStorage.setItem('frozenItems', JSON.stringify(items))
  }, [items])





  return (
    <div className='bg-gray-100 min-h-screen p-4 grid place-items-center'>
      <div className='bg-white mx-auto max-w-sm p-4 rounded-xl shadow-md'>
        <h1 className='text-3xl font-bold mb-4'>Frozen Track</h1>

        <button className='bg-blue-500 text-white px-4 py-2 rounded-md mb-4 w-full hover:bg-blue-600 hover:cursor-pointer' onClick={() => setIsModalOpen(true)}>Add Item</button>
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 1024 1024"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
          </svg>

          <input
            type="text"
            placeholder="Search"
            className="border border-gray-300 pl-10 pr-4 py-2 rounded-md w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`inline-flex items-center rounded-xl bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700
                 hover:bg-blue-200 hover:scale-105 transition-all duration-200 shadow-sm hover:cursor-pointer ${category === filteredCategory ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className='flex items-center mb-2'>
          <h3 className='text-lg font-medium '>{filteredCategory === 'all' ? 'ALL ITEMS' : `${filteredCategory.toUpperCase()} ITEMS`}</h3>
          {/* <button className='ms-auto text-sm hover:cursor-pointer transition-transform duration-150 active:scale-90 hover:text-blue-500'>Edit</button> */}
        </div>

        <div className='w-full'>
          {paginatedItems.length > 0 ? (
            <div>
              {paginatedItems.map((item, realIndex) => (
                <div className='flex items-center px-3 bg-gray-100 rounded-xl mb-4' key={realIndex}>
                  <div className=''>
                    <div className='font-semibold'>{item.name.toUpperCase()}</div>

                  </div>
                  <div className='ms-2'>
                    <span
                      className={`inline-flex items-center rounded-xl px-1.5 py-0.5 text-xs font-medium
    ${item.status === 'fresh' && 'bg-green-400/10 text-green-500'}
    ${item.status === 'expiringSoon' && 'bg-yellow-400/10 text-yellow-600'}
    ${item.status === 'expired' && 'bg-red-400/10 text-red-500'}
  `}
                    >
                      {item.status}
                    </span>

                  </div>
                  <div className='ms-2'>
                    <button
                      className='py-2 rounded-md hover:cursor-pointer'
                      onClick={() => handleSelectItem(realIndex, item)}>
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M396 512a112 112 0 1 0 224 0 112 112 0 1 0-224 0zm546.2-25.8C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 0 0 0 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM508 688c-97.2 0-176-78.8-176-176s78.8-176 176-176 176 78.8 176 176-78.8 176-176 176z"></path></svg>
                    </button>
                  </div>

                  {/* <div>
                  <button className='px-2 py-1 rounded-md hover:cursor-pointer'><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32zm-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9z"></path></svg></button>
                  <button className='px-2 py-1 rounded-md hover:cursor-pointer'><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200 0H360v-72h304v72z"></path></svg></button>
                </div> */}
                  <div className='flex justify-between items-center ms-auto'>
                    <button className='px-1 py-1 text-white rounded-md hover:cursor-pointer bg-blue-500 me-2  transition-transform duration-150 active:scale-90   hover:bg-blue-600'
                      onClick={() => handleAddQuantity(realIndex)}>
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" version="1.1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><defs></defs><path d="M474 152m8 0l60 0q8 0 8 8l0 704q0 8-8 8l-60 0q-8 0-8-8l0-704q0-8 8-8Z" ></path><path d="M168 474m8 0l672 0q8 0 8 8l0 60q0 8-8 8l-672 0q-8 0-8-8l0-60q0-8 8-8Z" ></path></svg>
                    </button>
                    <div className='py-5 ms-auto'>{item.quantity} {item.unit}</div>
                    <button className='px-1 py-1 ms-2  text-white rounded-md hover:cursor-pointer  bg-blue-500 me-2  transition-transform duration-150 active:scale-90   hover:bg-blue-600'
                      onClick={() => handleMinusQuantity(realIndex)}>
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
        {paginatedItems.length > 0 && <div className='w-full mt-4 flex items-center justify-between px-4 py-2 text-sm'>
          <div>
            Total items: {totalItems}
          </div>

          {totalItems > 5 &&
            <div className='flex gap-2'>
              {currentPage > 1 && <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className='px-2 py-1 rounded-md bg-transparent disabled:opacity-50 hover:cursor-pointer'
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" strokeWidth="2" points="7 2 17 12 7 22" transform="matrix(-1 0 0 1 24 0)"></polyline></svg>
              </button>}

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-2 py-1 rounded-md hover:cursor-pointer ${currentPage === i + 1
                    ? 'text-blue-500'
                    : 'text-gray-700'
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className='px-2 py-1 rounded-md bg-transparent disabled:opacity-50 hover:cursor-pointer'
              >
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#000" strokeWidth="2" points="7 2 17 12 7 22"></polyline></svg>
              </button>
            </div>
          }

        </div>}

      </div>

      <AddItemContext.Provider value={{ isModalOpen, handleAddItem, addItem, setAddItem, setIsModalOpen }}>
        <AddItem />
      </AddItemContext.Provider>
      <ViewItemContext.Provider value={{ viewModal, selectedItem, openEditItemModal, setDeleteModal, setViewModal, selectedIndex }}>
        <ViewItem />
      </ViewItemContext.Provider>



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

      {/* Delete Item Modal */}
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

export default App


/*

TO DO LIST
- Separate components on different files DONE (AddItem)
- Add local storage to save items on browser refresh(DONE)
- Deploy to AWS
- Add unit tests

-------------------------------------

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

Inventory List DONE
- Display all items
- Pagination (5 items per page)

Search and Filter DONE
- Search by name
- Filter by category

Edit and Delete Items DONE
- Controlled forms with proper typing
- Confirmation modal for deletion

Expiration Updates (UI-based) DONE
- Automatic status update based on current date
- Status labels:
  - Fresh
  - Expiring Soon
  - Expired

-------------------------------------

*/
