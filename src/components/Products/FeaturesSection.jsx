import React from 'react'
import { FaShoppingBag } from "react-icons/fa";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { MdFactCheck } from "react-icons/md";
const FeaturesSection = () => {
  return (
    <section className='py-16 px-4 bg-white'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
            {/* Feature1 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <FaShoppingBag className='text-xl w-7 h-7'/>

                </div>
                <h4 className='tracking-tighter mb-2'>Free Shipping</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                    On all orders over Rs1000
                </p>
            </div>
              {/* Feature2 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <HiArrowPathRoundedSquare className='text-xl w-7 h-7'/>

                </div>
                <h4 className='tracking-tighter mb-2'>2 Days Return</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                    Money Back Guarantee
                </p>
            </div>
              {/* Feature3 */}
            <div className='flex flex-col items-center'>
                <div className='p-4 rounded-full mb-4'>
                    <MdFactCheck className='text-xl w-7 h-7'/>

                </div>
                <h4 className='tracking-tighter mb-2'>Scure Checkout</h4>
                <p className='text-gray-600 text-sm tracking-tighter'>
                  100%  Scure Checkout Process
                </p>
            </div>
        </div>

    </section>
  )
}

export default FeaturesSection
