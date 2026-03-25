import React from 'react'
import { IoIosCall } from "react-icons/io";
import { FaMeta } from "react-icons/fa6";
import { IoLogoInstagram } from 'react-icons/io5';
import { RiTwitterXFill } from 'react-icons/ri';
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
   <footer className='border-t border-gray-300 py-12'>
    <div className='container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0'>
        <div>
            <h3 className='text-lg text-gray-800 mb-4'>NewsLetter</h3>
            <p className='text-gray-500 mb-4'>Be The First Hear About New Products,Exclusive Events , And Online Offers.</p>
            <p className='font-medium text-sm text-gray-600 mb-6'>SignUP  And Get 10% Off Your First Order.</p>

            {/* Newsletter Form */}
            <form className='flex'>
                <input type="email" placeholder='Enter Your Email' className='p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all'
                required />
                <button type="submit" className='bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all cursor-pointer'>Subscribe</button>
            </form>

        </div>

        {/* Shop Links */}
        <div>
            <h3 className='text-lg text-gray-800 mb-4 '>Shop</h3>
            <ul className='space-y-2 text-gray-600'>
                <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>Mens,s Top Wear</Link>

                </li>
                   <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>Womens,s Top Wear</Link>

                </li>
                   <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>Mens,s Bottom Wear</Link>

                </li>
                   <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>Womens,s Bottom Wear</Link>

                </li>

            </ul>
        </div>

        {/* Support Links */}
        <div>
            <h3 className='text-lg text-gray-800 mb-4 '>Support</h3>
            <ul className='space-y-2 text-gray-600'>
                <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>Contact Us</Link>

                </li>
                   <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>About Us</Link>

                </li>
                   <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>FAQs</Link>

                </li>
                   <li>
                    <Link to="#" className='hover:text-gray-500 transition-colors'>Features</Link>

                </li>

            </ul>
        </div>

        {/* Follow Us */}
        <div>
            <h3 className='text-lg text-gray-800 mb-4'>Follow Us</h3>
            <div className='flex items-center space-x-4 mb-6'>
                <a href="" target='_blank' rel="noopener noreferrer" className='hover:text-gray-500'>
                    <FaMeta className='w-6 h-6'/>

                </a>
                  <a href="" target='_blank' rel="noopener noreferrer" className='hover:text-gray-500'>
                    <IoLogoInstagram className='w-6 h-6'/>

                </a>
                  <a href="" target='_blank' rel="noopener noreferrer" className='hover:text-gray-500'>
                    <RiTwitterXFill className='w-6 h-6'/>

                </a>
            </div>
            <p className='text-gray-500'>Call Us</p>
            <p>
              <IoIosCall className=' inline-block mr-2 w-6 h-6'/>
              +923495153025
            </p>
        </div>
    </div>

    {/* Footer Bottom */}
    <div className='container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-300 pt-6'>
        <p className='text-gray-500 text-sm tracking-tighter text-center'> 2025, CompileTab. All Right Reserved.</p>
    </div>

   </footer>
  )
}

export default Footer
