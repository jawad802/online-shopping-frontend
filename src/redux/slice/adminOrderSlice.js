import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_DO_NOT_USE_ActionTypes, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
  }
);


//update order delivery status (admin only)
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({id,status}, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        {status},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
  }
);

//Delete an order
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return id;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
  }
);

const adminOrderSlice = createSlice({
    name:"adminOrders",
    initialState:{
        orders:[],
        totalOrders:0,
        loading:false,
        totalSales:0,
        error:null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        //Fetch all orders
        .addCase(fetchAllOrders.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllOrders.fulfilled,(state,action)=>{
            state.loading = false;
            state.orders = action.payload;
            state.totalOrders = action.payload.length;
            //Calculate total sales
            const totalSales = action.payload.reduce((acc,order)=>{
                return acc + order.totalPrice;
            },0);
            state.totalSales = totalSales;
        })
        .addCase(fetchAllOrders.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload.message || 'Failed to fetch orders';
        })
        //update order status
        .addCase(updateOrderStatus.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(updateOrderStatus.fulfilled,(state,action)=>{
            state.loading = false;
            const updatedOrder = action.payload;
            const index = state.orders.findIndex(order=>order._id === updatedOrder._id);
            if(index !== -1){
                state.orders[index] = updatedOrder;
            }
        })
        .addCase(updateOrderStatus.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || 'Failed to update order status';
        })
        //Delete Order
        .addCase(deleteOrder.fulfilled,(state,action)=>{
            state.orders = state.orders.filter(order=>order._id !== action.payload);
        });
    },
});
export default adminOrderSlice.reducer;