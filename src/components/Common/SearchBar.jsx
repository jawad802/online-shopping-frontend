import React, { useState, useEffect, useRef } from 'react'
import { BsSearch } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProductsByFilters, setFilters } from '../../redux/slice/productSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef(null);
    const resultsRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.product);

    // Debounced search function
    useEffect(() => {
        if (!isOpen || !searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        const debounceTimer = setTimeout(async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/products?search=${encodeURIComponent(searchTerm)}&limit=8`
                );
                setSearchResults(response.data);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300); // 300ms debounce delay

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, isOpen]);

    // Handle click outside to close search
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target) &&
                resultsRef.current &&
                !resultsRef.current.contains(event.target)
            ) {
                setIsOpen(false);
                setSearchTerm("");
                setSearchResults([]);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleSearchToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setSearchTerm("");
            setSearchResults([]);
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            dispatch(setFilters({ search: searchTerm }));
            dispatch(fetchProductsByFilters({ search: searchTerm }));
            navigate(`/collections/all?search=${searchTerm}`);
            setIsOpen(false);
            setSearchTerm("");
            setSearchResults([]);
        }
    }

    const handleProductClick = () => {
        setIsOpen(false);
        setSearchTerm("");
        setSearchResults([]);
    }

    return (
        <div className="relative z-50">
            {isOpen ? (
                <div className="absolute top-12 right-0 w-96 bg-white shadow-lg rounded-lg z-[100] border border-gray-200" ref={searchRef}>
                    <form onSubmit={handleSearch} className='relative flex items-center w-full p-4 border-b border-gray-200'>
                        <div className='relative flex-1'>
                            <input
                                type="text"
                                placeholder='Search products...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='bg-gray-100 px-4 py-2 pl-2 pr-10 rounded-lg focus:outline-none w-full placeholder:text-gray-700'
                                autoFocus
                            />
                            {/* search icon */}
                            <button
                                type="submit"
                                className='absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800'
                            >
                                <BsSearch className='h-5 w-5'/>
                            </button>
                        </div>
                        {/* close icon */}
                        <button
                            type='button'
                            onClick={handleSearchToggle}
                            className='ml-2 text-gray-600 hover:text-gray-800'
                        >
                            <IoCloseSharp className='h-6 w-6'/>
                        </button>
                    </form>

                    {/* Search Results Dropdown */}
                    {searchTerm.trim() && (
                        <div
                            ref={resultsRef}
                            className="max-h-96 overflow-y-auto border-t border-gray-200"
                        >
                            {isSearching ? (
                                <div className="p-4 text-center text-gray-500">
                                    Searching...
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="p-2">
                                    <div className="px-4 py-2 text-sm font-semibold text-gray-700 border-b">
                                        Search Results ({searchResults.length})
                                    </div>
                                    {searchResults.map((product) => (
                                        <Link
                                            key={product._id}
                                            to={`/product/${product._id}`}
                                            onClick={handleProductClick}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="w-16 h-16 flex-shrink-0">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                                        <span className="text-xs text-gray-400">No Image</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-medium text-gray-900 truncate">
                                                    {product.name}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    Rs {product.price}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                    {searchResults.length >= 8 && (
                                        <button
                                            onClick={handleSearch}
                                            className="w-full p-3 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                                        >
                                            View All Results
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-500">
                                    No products found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={handleSearchToggle} className="hover:text-black">
                    <BsSearch className='h-5 w-5'/>
                </button>
            )}
        </div>
    )
}

export default SearchBar
