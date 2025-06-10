import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Edit, Trash2, Plus, X, Save, Package2 } from 'lucide-react';
import { db } from '../../firebase/config';
import { MenuItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';

const MenuManagement: React.FC<{ restaurantId: string }> = ({ restaurantId }) => {
  const { userProfile } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    preparationTime: 10,
    isAvailable: true,
    imageUrl: '',
    tags: [],
  });
  
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuItemsQuery = query(
          collection(db, 'menuItems'),
          where('restaurantId', '==', restaurantId)
        );
        
        const menuItemsSnapshot = await getDocs(menuItemsQuery);
        const menuItemsData = menuItemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as MenuItem[];
        
        setMenuItems(menuItemsData);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, [restaurantId]);
  
  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddingNew(false);
  };
  
  const handleSaveEdit = async () => {
    if (!editingItem) return;
    
    try {
      setLoading(true);
      const menuItemRef = doc(db, 'menuItems', editingItem.id);
      await updateDoc(menuItemRef, {
        name: editingItem.name,
        description: editingItem.description,
        price: Number(editingItem.price),
        category: editingItem.category,
        preparationTime: Number(editingItem.preparationTime),
        isAvailable: editingItem.isAvailable,
        imageUrl: editingItem.imageUrl,
        tags: editingItem.tags,
      });
      
      // Update local state
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating menu item:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      setLoading(true);
      const menuItemRef = doc(db, 'menuItems', id);
      await deleteDoc(menuItemRef);
      
      // Update local state
      setMenuItems(menuItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingItem(null);
  };
  
  const handleSaveNew = async () => {
    try {
      setLoading(true);
      
      const newItemData = {
        ...newItem,
        restaurantId,
        price: Number(newItem.price),
        preparationTime: Number(newItem.preparationTime),
        isAvailable: newItem.isAvailable || true,
        tags: newItem.tags || [],
      };
      
      const docRef = await addDoc(collection(db, 'menuItems'), newItemData);
      
      // Update local state
      const addedItem = {
        id: docRef.id,
        ...newItemData,
      } as MenuItem;
      
      setMenuItems([...menuItems, addedItem]);
      
      // Reset form
      setNewItem({
        name: '',
        description: '',
        price: 0,
        category: '',
        preparationTime: 10,
        isAvailable: true,
        imageUrl: '',
        tags: [],
      });
      
      setIsAddingNew(false);
    } catch (error) {
      console.error('Error adding menu item:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, 
    key: keyof MenuItem,
    isForNewItem: boolean = false
  ) => {
    const value = e.target.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : e.target.value;
    
    if (isForNewItem) {
      setNewItem({
        ...newItem,
        [key]: value,
      });
    } else if (editingItem) {
      setEditingItem({
        ...editingItem,
        [key]: value,
      });
    }
  };
  
  if (loading && menuItems.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // Check if user is authorized to manage menu
  if (userProfile?.role !== 'admin' && userProfile?.role !== 'vendor') {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        You don't have permission to manage menu items.
      </div>
    );
  }
  
  const renderItemForm = (
    item: Partial<MenuItem>,
    isNew: boolean,
    handleChange: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
      key: keyof MenuItem
    ) => void,
    handleSave: () => Promise<void>,
    handleCancel: () => void
  ) => (
    <div className="border rounded-md p-4 mb-4 bg-gray-50">
      <h3 className="text-lg font-medium mb-4">
        {isNew ? 'Add New Menu Item' : 'Edit Menu Item'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Name"
          value={item.name}
          onChange={(e) => handleChange(e, 'name')}
          fullWidth
          required
        />
        
        <Input
          label="Category"
          value={item.category}
          onChange={(e) => handleChange(e, 'category')}
          fullWidth
          required
        />
        
        <Input
          label="Price (₹)"
          type="number"
          value={item.price}
          onChange={(e) => handleChange(e, 'price')}
          fullWidth
          required
        />
        
        <Input
          label="Preparation Time (mins)"
          type="number"
          value={item.preparationTime}
          onChange={(e) => handleChange(e, 'preparationTime')}
          fullWidth
          required
        />
        
        <div className="md:col-span-2">
          <Input
            label="Image URL"
            value={item.imageUrl}
            onChange={(e) => handleChange(e, 'imageUrl')}
            fullWidth
            required
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={item.description}
            onChange={(e) => handleChange(e, 'description')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            required
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id={isNew ? 'newItemAvailable' : `itemAvailable-${item.id}`}
            checked={item.isAvailable}
            onChange={(e) => handleChange(e, 'isAvailable')}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label 
            htmlFor={isNew ? 'newItemAvailable' : `itemAvailable-${item.id}`}
            className="ml-2 block text-sm text-gray-700"
          >
            Available
          </label>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={handleCancel}
          leftIcon={<X className="h-4 w-4" />}
        >
          Cancel
        </Button>
        
        <Button
          variant="primary"
          onClick={handleSave}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save
        </Button>
      </div>
    </div>
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Menu Management</h2>
        
        <Button
          variant="primary"
          onClick={handleAddNew}
          leftIcon={<Plus className="h-5 w-5" />}
          disabled={isAddingNew}
        >
          Add Item
        </Button>
      </div>
      
      {isAddingNew && renderItemForm(
        newItem,
        true,
        (e, key) => handleInputChange(e, key, true),
        handleSaveNew,
        () => setIsAddingNew(false)
      )}
      
      {editingItem && renderItemForm(
        editingItem,
        false,
        handleInputChange,
        handleSaveEdit,
        () => setEditingItem(null)
      )}
      
      {menuItems.length === 0 && !isAddingNew ? (
        <Card>
          <CardBody className="text-center py-12">
            <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
            <p className="text-gray-500 mb-6">
              Add your first menu item to get started.
            </p>
            <Button
              variant="primary"
              onClick={handleAddNew}
              leftIcon={<Plus className="h-5 w-5" />}
            >
              Add First Item
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {menuItems.map(item => (
            <Card key={item.id} className={editingItem?.id === item.id ? 'opacity-50' : ''}>
              <CardBody className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 flex-shrink-0">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                
                <div className="flex-1 sm:ml-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.category}
                        </span>
                        
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {item.preparationTime} mins
                        </span>
                        
                        {item.isAvailable ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <span className="font-medium text-gray-900">
                      ₹{item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditItem(item)}
                      leftIcon={<Edit className="h-4 w-4" />}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      leftIcon={<Trash2 className="h-4 w-4" />}
                      className="text-red-500 border-red-200 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;