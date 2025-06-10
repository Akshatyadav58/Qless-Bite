import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';

interface RestaurantManagementProps {
  restaurant: any;
  onUpdate: () => void;
}

const RestaurantManagement: React.FC<RestaurantManagementProps> = ({
  restaurant,
  onUpdate
}) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: restaurant.name,
    description: restaurant.description,
    location: restaurant.location,
    imageUrl: restaurant.imageUrl,
    openingHours: {
      open: restaurant.openingHours.open,
      close: restaurant.openingHours.close
    }
  });

  const handleSave = async () => {
    try {
      const restaurantRef = doc(db, 'restaurants', restaurant.id);
      await updateDoc(restaurantRef, formData);
      onUpdate();
      setEditing(false);
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  if (!editing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Restaurant Settings</h2>
            <Button variant="primary" onClick={() => setEditing(true)}>
              Edit Restaurant
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Name</h3>
              <p>{restaurant.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Description</h3>
              <p>{restaurant.description}</p>
            </div>
            <div>
              <h3 className="font-medium">Location</h3>
              <p>{restaurant.location}</p>
            </div>
            <div>
              <h3 className="font-medium">Opening Hours</h3>
              <p>{restaurant.openingHours.open} - {restaurant.openingHours.close}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold">Edit Restaurant</h2>
      </CardHeader>
      <CardBody>
        <form className="space-y-4">
          <Input
            label="Restaurant Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          
          <Input
            label="Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Opening Time"
              value={formData.openingHours.open}
              onChange={(e) => setFormData({
                ...formData,
                openingHours: { ...formData.openingHours, open: e.target.value }
              })}
            />
            
            <Input
              label="Closing Time"
              value={formData.openingHours.close}
              onChange={(e) => setFormData({
                ...formData,
                openingHours: { ...formData.openingHours, close: e.target.value }
              })}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default RestaurantManagement;