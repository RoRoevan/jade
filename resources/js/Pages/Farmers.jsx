import { Link } from '@inertiajs/react';
import { Leaf } from 'lucide-react';
import alingliza from '../../assets/Aling liza.jpg';
import delacruz from '../../assets/DelaCruz.jpg';

export default function OurFarmers() {
    
    const farmers = [
        {
            title: "A Family's Legacy",
            name: 'The De La Cruz Farm',
            image: alingliza,
            story: "For the De La Cruz family of Tarlac, farming isn't just a job—it's a legacy that has been passed down for three generations. Tatay Ben and Nanay Rosa started with one hectare of rice, and today, their children manage a diversified farm that grows vegetables, fruits, and herbs.\nWhen their daughter Mika, an IT graduate, came back home after working in the city, she introduced her parents to the RuRi marketplace. At first, they were hesitant—technology felt intimidating. But when their first online order came in, everything changed. Now, the De La Cruz family uses tech to handle bulk orders for restaurants and community markets. Mina manages the online side while her parents oversee planting and harvesting. 'It brought us closer,' says Mika. 'We each have a role, and we're all part of something meaningful.'\nThrough RuRi, the De La Cruz family found a way to honor tradition while embracing innovation. 'Farming built our family,' Tatay Ben says, 'and now technology helps us keep it alive.'"
        },
        {
            title: 'Seeds of Tomorrow',
            name: 'The Story of Aling Liza',
            image: delacruz,
            story: "In the rolling hills of Batangas, Aling Liza, a 41-year-old mother of three, wakes up before dawn to tend to her small vegetable garden. What started as a few rows of pechay to feed her family has grown into a thriving micro-farm that now supports them. When her husband lost his job during the pandemic, Aling Liza turned to farming full time.\n'Walang madali, pero 'pag may sipag, may biyaya,' she says, as she carefully inspects her plants. ('Nothing is easy, but if you work hard, there are blessings.') Today, she not only sells her produce at the local market but is a proud partner of RuRi, supplying fresh, organic pechay, sitaw, and ampalaya to the city. Her children help her pack the orders after school. 'This is our future,' she says, pointing to her garden, 'These are our seeds of tomorrow.'"
        }
    ];

    return (
        <div className="bg-white">
            <section className="py-20 bg-gradient-to-br from-green-50 to-amber-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-block bg-green-800 text-white p-3 rounded-full mb-4">
                        <Leaf className="w-8 h-8" />
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-bold text-green-900">
                        Farmer's Story
                    </h1>
                    <p className="mt-4 text-xl text-gray-700 max-w-2xl mx-auto">
                        Meet the hardworking farmers behind your fresh produce
                    </p>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-16">

                        {farmers.map((farmer, index) => (
                            <article key={index}>
                                <h2 className="text-3xl font-bold text-green-900 mb-6">
                                    {farmer.title}: {farmer.name}
                                </h2>

                                <div className="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-lg overflow-hidden">
                                    
                                    <img 
                                        src={farmer.image} 
                                        alt={farmer.name} 
                                        className="w-full float-none md:float-left md:w-1/3 mr-0 md:mr-6 mb-4 md:mb-3 rounded-lg shadow-md" 
                                    />
                                    
                                    <div className="text-gray-700 leading-relaxed space-y-4">
                                        {farmer.story.split('\n').map((paragraph, pIndex) => (
                                            <p key={pIndex}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            </article>
                        ))}

                    </div>
                </div>
            </section>
        </div>
    );
}