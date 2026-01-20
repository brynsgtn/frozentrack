
import { useEffect, useState, createContext } from 'react'
import './App.css'
import AddItem from './components/AddItem'
import ViewItem from './components/ViewItem'
import EditItem from './components/EditItem'
import DeleteItem from './components/DeleteItem'


export type Item = {
  name: string,
  category: 'vegetable' | 'pork' | 'beef' | 'chicken' | 'fish' | 'dessert',
  quantity: number,
  unit: 'pcs' | 'pack' | 'kg' | 'g' | 'bottle',
  dateFrozen: string,
  expirationDate: string,
  status: 'fresh' | 'expiringSoon' | 'expired'
}

type AppContext = {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddItem: (e: React.FormEvent<HTMLFormElement>) => void;
  addItem: Item;
  setAddItem: React.Dispatch<React.SetStateAction<Item>>;
  viewModal: boolean;
  openEditItemModal: (index: number, item: Item) => void;
  editModal: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<Item | null>>;
  handleEditItem: (index: number, selectedItem: Item) => void;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleteModal: boolean;
  selectedItem: Item | null;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteItem: (index: number) => void;
  selectedIndex: number | null;
};



export const AppContext = createContext<AppContext | null>(null);

export const formatDate = (date: string): string => {
  if (!date) return 'N/A';

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};


function App() {




  const ITEMS_PER_PAGE = 5;

  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories: string[] = ['all', 'vegetable', 'pork', 'beef', 'chicken', 'fish', 'dessert']

  const today: string = new Date().toISOString().split('T')[0];

  const itemsInStorage: string | null = localStorage.getItem('frozenItems');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const [items, setItems] = useState<Item[]>(itemsInStorage ? JSON.parse(itemsInStorage) : []);

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [filteredCategory, setFilteredCategory] = useState<string>('all');

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

    if (!addItem.name.trim()) return;

    const newItem: Item = {
      ...addItem,
      status: getItemStatus(addItem.expirationDate)
    };

    setItems(prev => [...prev, newItem]);

    setAddItem({
      name: '',
      category: 'vegetable',
      quantity: 1,
      unit: 'pcs',
      dateFrozen: today,
      expirationDate: '',
      status: 'fresh'
    });

    setIsModalOpen(false);
  };


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

  const handleCategoryClick = (category: string): void => {
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
    localStorage.setItem('frozenItems', JSON.stringify(items))
  }, [items])





  return (
    <AppContext.Provider value={{ isModalOpen, handleAddItem, addItem, setAddItem, setIsModalOpen, viewModal, selectedItem, openEditItemModal, setDeleteModal, setViewModal, selectedIndex, editModal, setSelectedItem, handleEditItem, setEditModal, deleteModal, handleDeleteItem }}>
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

          {paginatedItems.map((item, index) => {
            const realIndex = startIndex + index;

            return (
              <div
                className="flex items-center px-3 bg-gray-100 rounded-xl mb-4"
                key={realIndex}
              >
                <div>
                  <div className="font-semibold">{item.name.toUpperCase()}</div>
                </div>

                <div className="ms-2">
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

                <div className="ms-2">
                  <button
                    className="py-2 rounded-md hover:cursor-pointer"
                    onClick={() => handleSelectItem(realIndex, item)}
                  >
                    👁
                  </button>
                </div>

                <div className="flex justify-between items-center ms-auto">
                  <button
                    className="px-2 py-1 text-white rounded-md bg-blue-500 me-2"
                    onClick={() => handleAddQuantity(realIndex)}
                  >
                    +
                  </button>

                  <div className="py-5">
                    {item.quantity} {item.unit}
                  </div>

                  <button
                    className="px-2 py-1 text-white rounded-md bg-blue-500 ms-2"
                    onClick={() => handleMinusQuantity(realIndex)}
                  >
                    -
                  </button>
                </div>
              </div>
            );
          })}

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

        <AddItem />
        <ViewItem />
        <EditItem />
        <DeleteItem />
      </div>
    </AppContext.Provider>
  )
}

export default App


/*

TO DO LIST
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
