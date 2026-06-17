import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Star, Filter, Plus, X } from 'lucide-react';
import { useCart } from '../Components/CartModal.jsx';
import { supabase } from '@/supabase';

const getProductEmoji = (name, category) => {
    const n = name.toLowerCase();
    const c = category.toLowerCase();
    if (n.includes('mango')) return '🥭';
    if (n.includes('eggplant')) return '🍆';
    if (n.includes('egg')) return '🥚';
    if (n.includes('parsley') || n.includes('herb')) return '🌿';
    if (n.includes('banana')) return '🍌';
    if (n.includes('honey')) return '🍯';
    if (c.includes('fruit')) return '🍎';
    if (c.includes('veg')) return '🥬';
    return '📦';
};

const getProductDescription = (name) => {
    return `Premium quality ${name.toLowerCase()}, freshly harvested and sourced directly from local Filipino farms.`;
};

const getProductOrigin = (name) => {
    const n = name.toLowerCase();
    if (n.includes('mango')) return 'Guimaras';
    if (n.includes('eggplant')) return 'Nueva Ecija';
    if (n.includes('egg')) return 'Tarlac';
    if (n.includes('parsley')) return 'Benguet';
    if (n.includes('banana')) return 'Davao';
    if (n.includes('honey')) return 'Mountain Province';
    return 'Luzon Farms';
};

export default function Shop() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { addToCart } = useCart(); 
    const [dbProducts, setDbProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const { data, error } = await supabase.from('products').select('*');
            if (data) {
                setDbProducts(data);
            } else if (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    const enrichedProducts = dbProducts.map(product => {
        const name = product.name || '';
        const category = product.category || '';
        return {
            ...product,
            image: getProductEmoji(name, category),
            description: getProductDescription(name),
            from: getProductOrigin(name),
            rating: 5
        };
    });

    const filters = [
        {
            name: 'Category',
            options: ['Vegetables', 'Fruits', 'Herbs', 'Grains'],
        },
        {
            name: 'Origin',
            options: ['Benguet', 'Zambales', 'Davao', 'Nueva Ecija'],
        },
    ];

    const FilterModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <div 
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => setIsModalOpen(false)}
            ></div>
            
            <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl transition-all">
                
                <div className="flex items-center justify-between mb-6">
                    <h3 className="flex items-center text-2xl font-bold text-green-900">
                        <Filter className="w-6 h-6 mr-2 text-green-800" />
                        Filters
                    </h3>
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-6">
                    {filters.map((filter) => (
                        <div key={filter.name}>
                            <h4 className="font-semibold text-gray-700 mb-3">{filter.name}</h4>
                            <div className="space-y-2">
                                {filter.options.map((option) => (
                                    <div key={option} className="flex items-center">
                                        <input
                                            id={option}
                                            name={filter.name}
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300 text-green-800 focus:ring-green-700"
                                        />
                                        <label htmlFor={option} className="ml-3 text-sm text-gray-600">
                                            {option}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => setIsModalOpen(false)}
                    className="mt-8 w-full bg-green-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
                >
                    Apply Filters
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-white">
            <section className="py-20 bg-gradient-to-br from-green-50 to-amber-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold text-green-900 mb-4">
                        Our Fresh Products
                    </h1>
                    <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                        Browse our selection of vegetables and fruits, sourced directly from local Filipino farms.
                    </p>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex justify-end mb-8">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center bg-white text-green-800 px-6 py-3 rounded-full font-semibold border-2 border-green-800 hover:bg-green-50 transition shadow-sm hover:shadow-md"
                        >
                            <Filter className="w-5 h-5 mr-2" />
                            Show Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {enrichedProducts.map((product) => (
                            <div 
                                key={product.id} 
                                className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300"
                            >
                                <div className="bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center py-10">
                                    <span className="text-8xl">{product.image}</span>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="text-xl font-bold text-green-900">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-amber-500 fill-current" />
                                            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                        <MapPin className="w-4 h-4 mr-1.5" />
                                        {product.from}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-6 flex-grow">
                                        {product.description}
                                    </p>
                                    
                                    <div className="flex justify-between items-center mt-auto">
                                        <span className="text-2xl font-bold text-green-800">
                                            ₱{product.price.toFixed(2)}
                                        </span>
                                        <button
                                            onClick={() => addToCart(product)}
                                            className="inline-flex items-center justify-center bg-green-800 text-white p-3 rounded-full font-semibold hover:bg-green-700 transition shadow group"
                                            title="Add to Cart"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {isModalOpen && <FilterModal />}
        </div>
    );
}