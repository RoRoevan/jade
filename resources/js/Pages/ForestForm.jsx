import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ForestForm() {
    const { data, setData, post, processing, reset } = useForm({
        business_name: '',
        contact_person: '',
        email: '',
        phone: '',
        preferred_date: '',
        proposal_description: '', 
    });

    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        post('/forest-form', {
            onSuccess: () => {
                setShowModal(true);
                reset();
                setTimeout(() => {
                    router.visit('/');
                }, 2000);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center px-4 py-20">
            <div className="max-w-2xl w-full bg-white p-10 rounded-2xl shadow-xl">
                <h1 className="text-3xl font-bold text-green-900 mb-6 mt-6 text-center">
                    Business Partnership Request
                </h1>
                <p className="text-gray-600 text-center">
                    Fill out this form to schedule a meeting with us. We'll get in touch shortly.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6 p-8">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Business Name</label>
                        <input
                            type="text"
                            value={data.business_name}
                            onChange={(e) => setData('business_name', e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Contact Person</label>
                        <input
                            type="text"
                            value={data.contact_person}
                            onChange={(e) => setData('contact_person', e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Phone</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                            />
                        </div>
                    </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Short Proposal Description</label>
                            <textarea
                                value={data.proposal_description}
                                onChange={(e) => setData('proposal_description', e.target.value)}
                                rows="4"
                                required
                                placeholder="Briefly describe your partnership idea..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                            ></textarea>
                        </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Preferred Date</label>
                        <input
                            type="date"
                            value={data.preferred_date}
                            onChange={(e) => setData('preferred_date', e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-700"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-800 text-white py-3 rounded-full font-semibold hover:bg-green-700 transition shadow-md"
                    >
                        {processing ? 'Submitting...' : 'Request Meeting'}
                    </button>
                </form>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-green-800 mb-3">
                            Meeting Schedule Requested!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We’ll get in touch soon to confirm your meeting date.
                        </p>
                        <button
                            onClick={() => router.visit('/')}
                            className="px-6 py-2 bg-green-800 text-white rounded-full hover:bg-green-700 transition"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
