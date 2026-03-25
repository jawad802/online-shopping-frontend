import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'; 
import axios from 'axios';

//helper function to load cart from local storage
const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : {products:[]};
};

//helper function to save cart to local storage
const saveCartToLocalStorage = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

//fetch cart for user or guest
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async({userId,guestId},{rejectWithValue})=>{
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cart`,{
                params:{userId,guestId},
            }
        );
        
            return response.data;

        } catch (error) {
            console.error(error);
            return rejectWithValue(error.response.data);

            
        }
    }
);

//add an item to cart for user or guest
export const addToCart = createAsyncThunk(
    "cart/addToCart",async({userId,guestId,productId,quantity,size,color},{rejectWithValue})=>{
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/`,{
                productId,
                quantity,
                size,
                color,
                guestId,
                userId,
            }
        );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);

            
        }

    }

);

//update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk(
    "cart/updateCartItemQuantity", async({productId,quantity,userId,guestId,size,color},{rejectWithValue})=>{
        try {
            const response= await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cart/`,{
                productId,
                quantity,
                userId,
                guestId,
                size,
                color,

            }
        );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);       
        }
    }
);

//Remove an item from the cart
export const removeCartItem = createAsyncThunk(
    "cart/removeCartItem", async({productId,userId,guestId,size,color},{rejectWithValue})=>{
        try {
            const response= await axios({
                method:"DELETE",
                url:`${import.meta.env.VITE_BACKEND_URL}/api/cart/`,
                data:{productId,userId,guestId,size,color},
            });
            return response.data;
            
        } catch (error) {
            return rejectWithValue(error.response.data);
            
        }
    }
);

//Merge guest cart with user cart
export const mergeCart = createAsyncThunk(
    "cart/mergeCart", async({guestId},{rejectWithValue})=>{
        try {
            const response= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,{guestId},
                {
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem('userToken')}`,
                    },
                }
            );
            return response.data;

        } catch (error) {
            return rejectWithValue(error.response?.data || {message: 'Failed to merge cart'});
            
        }
    }
);
const cartSlice = createSlice({
    name:"cart",
    initialState:{
        cart: loadCartFromLocalStorage(),
        loading:false,
        error:null,
    },
    reducers:{
        clearCartState:(state)=>{
            state.cart={products:[]};
            localStorage.removeItem('cart');
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchCart.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCart.fulfilled,(state,action)=>{
            state.loading = false;
            state.cart = action.payload;
            saveCartToLocalStorage(action.payload);

        })
        .addCase(fetchCart.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.error.message || 'Failed to fetch cart';

        })

           .addCase(addToCart.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(addToCart.fulfilled,(state,action)=>{
            state.loading = false;
            state.cart = action.payload;
            saveCartToLocalStorage(action.payload);

        })
        .addCase(addToCart.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || 'Failed to Add to cart';

        })
           .addCase(updateCartItemQuantity.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(updateCartItemQuantity.fulfilled,(state,action)=>{
            state.loading = false;
            state.cart = action.payload;
            saveCartToLocalStorage(action.payload);

        })
        .addCase(updateCartItemQuantity.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || 'Failed to update cart item quantity';

        })

           .addCase(removeCartItem.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(removeCartItem.fulfilled,(state,action)=>{
            state.loading = false;
            state.cart = action.payload;
            saveCartToLocalStorage(action.payload);

        })
        .addCase(removeCartItem.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || 'Failed to remove item from cart';

        })

           .addCase(mergeCart.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(mergeCart.fulfilled,(state,action)=>{
            state.loading = false;
            state.cart = action.payload;
            saveCartToLocalStorage(action.payload);

        })
        .addCase(mergeCart.rejected,(state,action)=>{
            state.loading = false;
            // Only set error if cart is empty (merge was critical)
            // If cart has items, merge failure is non-critical
            if (!state.cart || !state.cart.products || state.cart.products.length === 0) {
                state.error = action.payload?.message || 'Failed to merge cart';
            } else {
                // Clear error if cart has items (merge was optional)
                state.error = null;
            }

        })

    }
});

export const {clearCartState}=cartSlice.actions;
export default cartSlice.reducer;