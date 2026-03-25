import React from 'react'
import { FaMeta, FaSquareInstagram } from "react-icons/fa6";
import { BsTwitterX } from "react-icons/bs";

const Topbar = () => {
  return (
    <div className='bg-[#ea2e0e] text-white'>
        <div className='container mx-auto flex justify-between items-center py-3 px-4 '>
            <div className=' hidden md:flex items-center space-x-4'>
                <a href="#" className='hover:text-gray-300'>
                    <FaMeta className='h-6 w-6'/>
                </a>
                <a href="#" className='hover:text-gray-300'>
                    <FaSquareInstagram className='h-6 w-6'/>
                </a>
                <a href="#" className='hover:text-gray-300'>
                    <BsTwitterX className='h-4 w-4'/>
                </a>
            </div>
            <div className='text-sm text-center flex-grow'>
                <span>We Ship Worldwide Fast And Reliable Shipping</span>
            </div>
            <div className='text-sm hidden md:block'>
                <a href="tel:+923495153015" className='hover-text-gray-300'>+923495153015</a>
            </div>
        </div>
      
    </div>
  )
}

export default Topbar
