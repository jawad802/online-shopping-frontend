import React from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRupeeSign } from "react-icons/fa6";
import shirt1 from '../../assets/s1.png'
import shirt2 from '../../assets/s2.png'
import { useDispatch } from 'react-redux';
import { removeCartItem,mergeCart } from "../../redux/slice/cartSlice";





const CartContent = ({cart,userId,guestId}) => {
    const dispatch=useDispatch();
// Handle adding and subtracting to cart
const handleAddToCart=(productId,delta,quantity,size,color)=>{
    const newQuantity=quantity+delta;
    if(newQuantity>=1){
        dispatch(
            updataCartItemQuantity({
                productId,
                quantity:newQuantity,
                guestId,
                userId,
                size,
                color,

            })
        );
    }
}; 
const handleRemoveFromCart=(productId,size,color)=>{
    dispatch(removeCartItem({productId,userId,guestId,size,color}));
};  
  return (
    <div>
        {
            cart.products.map((product,index)=>(
                <div key={index} className='flex items-start justify-between py-4 border-b border-gray-400'>
                    <div>
                        <img src={product.image} alt={product.name} className='w-20 h-24 object-cover mr-4 rounded' />
                        <div>
                            <h3>{product.name}</h3>
                            <p className='text-sm text-gray-500'>
                                size:{product.size} | color:{product.color}
                            </p>
                            <div className='flex items-center mt-2'>

                                <button onClick={()=>handleAddToCart(product.productId,-1,product.quantity,product.size,product.color)} className='border border-gray-300 rounded px-2 py-1 text-xl font-medium'>-</button>
                                <span className='mx-4'>{product.quantity}</span>
                                <button onClick={()=>handleAddToCart(product.productId,1,product.quantity,product.size,product.color)}  className='border border-gray-300 rounded px-2 py-1 text-xl font-medium'>+</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p>Rs:{product.price.toLocaleString()}</p>
                        <button onClick={()=>handleRemoveFromCart(product.productId,product.size,product.color)}>
                            <RiDeleteBin6Line  className='h-6 w-6 mt-2 text-red-600'/>
                        </button>
                    </div>
                </div>

            ))

            
        }
      
    </div>
  )
}

export default CartContent
