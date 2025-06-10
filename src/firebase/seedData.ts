import { collection, addDoc } from 'firebase/firestore';
import { db } from './config';

export const addRestaurant = async (vendorId: string) => {
  try {
    const restaurantData = {
      name: "Campus Cafe",
      description: "Your favorite campus dining destination serving fresh, delicious meals daily.",
      imageUrl: "https://images.pexels.com/photos/2159065/pexels-photo-2159065.jpeg",
      vendorId: vendorId,
      location: "Main Building, Ground Floor",
      openingHours: {
        open: "8:00 AM",
        close: "6:00 PM"
      },
      tags: ["Breakfast", "Lunch", "Snacks", "Beverages"]
    };

    const docRef = await addDoc(collection(db, 'restaurants'), restaurantData);
    console.log("Restaurant added with ID: ", docRef.id);
    
    // Add some menu items
    const menuItems = [
      {
        name: "Classic Burger",
        description: "Juicy beef patty with fresh lettuce, tomatoes, and our special sauce",
        price: 149.99,
        imageUrl: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg",
        category: "Burgers",
        isAvailable: true,
        preparationTime: 15,
        restaurantId: docRef.id,
        tags: ["Lunch", "Popular"]
      },
      {
        name: "Chicken Sandwich",
        description: "Grilled chicken breast with avocado and honey mustard",
        price: 129.99,
        imageUrl: "https://images.pexels.com/photos/1647163/pexels-photo-1647163.jpeg",
        category: "Sandwiches",
        isAvailable: true,
        preparationTime: 12,
        restaurantId: docRef.id,
        tags: ["Lunch", "Healthy"]
      },
      {
        name: "Caesar Salad",
        description: "Fresh romaine lettuce, parmesan cheese, croutons, and caesar dressing",
        price: 99.99,
        imageUrl: "https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg",
        category: "Salads",
        isAvailable: true,
        preparationTime: 8,
        restaurantId: docRef.id,
        tags: ["Healthy", "Vegetarian"]
      }
    ];

    for (const item of menuItems) {
      await addDoc(collection(db, 'menuItems'), item);
    }
    
    console.log("Menu items added successfully");
    return docRef.id;
  } catch (error) {
    console.error("Error adding restaurant: ", error);
    throw error;
  }
};