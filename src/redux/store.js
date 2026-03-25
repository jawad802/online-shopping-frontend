import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import productReducer from './slice/productSlice';
import cartReducer from './slice/cartSlice';
import checkOutReducer from './slice/checkOutSlice';
import orderReducer from './slice/orderSlice';
import adminReducer from './slice/adminSlice';
import adminProductReducer from './slice/adminProductSlice';
import adminOrderReducer from './slice/adminOrderSlice'
const store = configureStore({
    reducer:{
        auth: authReducer,
        product: productReducer,
        cart: cartReducer,
        checkout: checkOutReducer,
        orders: orderReducer,
        admin: adminReducer,
        adminProducts: adminProductReducer,
        adminOrders:adminOrderReducer,
    },
});
export default store;