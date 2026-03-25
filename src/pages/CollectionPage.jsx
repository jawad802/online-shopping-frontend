import React, { useEffect, useRef, useState } from 'react'
import watch1 from '../assets/w3.png'
import { FaFilter } from 'react-icons/fa6';
import FilterSidebar from '../components/Products/FilterSidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchProductsByFilters } from '../redux/slice/productSlice';


const CollectionPage = () => {
  const {collection}=useParams();
  const [searchParams]=useSearchParams();
  const dispatch=useDispatch();
  const {products,loading,error}=useSelector((state)=>state.product);
  // const queryParams=Object.fromEntries([...searchParams]);




    // const [products,setProducts] = useState([]);
    const sidebarRef = useRef(null);
    const [isSidebarOpen,setIsSidebarOpen] =useState(false);
     // Convert URLSearchParams to object
  const filters = Object.fromEntries(searchParams.entries());
    useEffect(()=>{
      dispatch(fetchProductsByFilters({collection,...filters}));
    },[dispatch,collection,searchParams.toString()]);
    const toggleSidebar=()=>{
        setIsSidebarOpen(!isSidebarOpen);
    };
    const handleClickOutside=(e)=>{
        if(sidebarRef.current && !sidebarRef.current.contains(e.target)){
            setIsSidebarOpen(false)
        }
    };
    useEffect(()=>{
        document.addEventListener("mousedown",handleClickOutside);
        return()=>{
           document.removeEventListener("mousedown",handleClickOutside);

        };
    },[]);
   
  return (
    <div className='flex flex-col lg:flex-row'>
        {/* Mobile Filter Button */}
        <button onClick={toggleSidebar} className='lg:hidden border border-gray-300 p-2 flex justify-center items-center'>
            <FaFilter className='mr-2'/> Filters
        </button>
        {/* Filter SideBar */}
        <div ref={sidebarRef} className={`${isSidebarOpen ? "translate-x-0" :"-translate-x-full"} fixed inset-y-0 z-50 left-0 w-64 overflow-y-auto bg-gray-100 transition-transform duration-300 lg:static lg:translate-x-0`}> 
        <FilterSidebar/>
        </div>
        <div className='flex-grow p-4'>
            <h2 className='text-2xl uppercase mb-4'>All Collections</h2>
             {/* Sort Options */}
             <SortOptions/>

             {/* Product Grid */}
             <ProductGrid products={products} loading={loading} error={error}/>
        </div>
      
    </div>
  )
}

export default CollectionPage
