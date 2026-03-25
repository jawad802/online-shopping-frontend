import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { clearCartState } from '../redux/slice/cartSlice'
import { fetchOrderDetails } from '../redux/slice/orderSlice'

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderDetails, loading } = useSelector((state) => state.orders);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Get order ID from localStorage
    const orderId = localStorage.getItem("lastOrderId");
    
    if (orderId) {
      // Fetch order details
      dispatch(fetchOrderDetails(orderId)).then((result) => {
        if (result.payload) {
          setOrder(result.payload);
          // Clear cart after order is confirmed
          dispatch(clearCartState());
          localStorage.removeItem("cart");
          // Clear the stored order ID
          localStorage.removeItem("lastOrderId");
        } else {
          navigate("/my-orders");
        }
      });
    } else {
      // If no order ID, redirect to orders page
      navigate("/my-orders");
    }
  }, [dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className='max-w-4xl mx-auto p-6 bg-white text-center'>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white'>
      <h1 className='text-2xl font-bold text-center text-emerald-700 mb-8'>
        Thank You for Your Order!
      </h1>
      <div className='p-6 rounded-lg border border-gray-300'>
        <div className="flex justify-between mb-8">
          {/* Order ID and Date */}
          <div>
            <h2 className='text-xl font-semibold'>Order ID: {order._id}</h2>
            <p className='text-gray-500'>
              Order Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* Estimated Delivery */}
          <div className='text-emerald-700 text-sm'>
            Estimated Delivery: {calculateEstimatedDelivery(order.createdAt)}
          </div>
        </div>

        {/* Order Items */}
        <div className='mb-8'>
          <h3 className='text-lg font-semibold mb-4'>Order Items</h3>
          {order.orderItems && order.orderItems.map((item, index) => (
            <div key={index} className='flex items-center mb-4 pb-4 border-b'>
              <img 
                src={item.image} 
                alt={item.name} 
                className='w-16 h-16 object-cover rounded-md mr-4' 
              />
              <div className='flex-1'>
                <h4 className='text-md font-semibold'>{item.name}</h4>
                <p className='text-sm text-gray-500'>
                  {item.color} | {item.size}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-md font-semibold'>Rs: {item.price?.toLocaleString()}</p>
                <p className='text-sm text-gray-500'>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment and Delivery Info */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div>
            <h4 className='text-lg font-semibold mb-2'>Payment</h4>
            <p className='text-gray-600'>
              Method: {order.paymentMethod || 'N/A'}
            </p>
            <p className='text-gray-600'>
              Status: <span className='text-green-600 font-semibold'>{order.paymentStatus}</span>
            </p>
            {order.paidAt && (
              <p className='text-gray-600 text-sm'>
                Paid on: {new Date(order.paidAt).toLocaleDateString()}
              </p>
            )}
          </div>
          {/* Delivery Info */}
          <div>
            <h4 className='text-lg font-semibold mb-2'>Delivery Address</h4>
            {order.shippingAddress && (
              <>
                <p className='text-gray-600'>{order.shippingAddress.street || order.shippingAddress.address}</p>
                <p className='text-gray-600'>
                  {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p className='text-gray-600'>{order.shippingAddress.country}</p>
              </>
            )}
          </div>
        </div>

        {/* Order Total */}
        <div className='mt-8 pt-4 border-t'>
          <div className='flex justify-between items-center text-xl font-semibold'>
            <p>Total Amount</p>
            <p className='text-emerald-700'>Rs: {order.totalPrice?.toLocaleString()}</p>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <div className='mt-8 text-center'>
          <button
            onClick={() => navigate("/")}
            className='bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition'
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
