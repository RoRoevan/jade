import { useState, useRef, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { supabase } from '@/supabase';
import {
    Users, Gift, Bell, Trash2, Plus, X, ChevronDown,
    Sprout, TreePine, Trees, Edit2, Check, AlertCircle,
    BarChart2, Search, ImagePlus, Upload
} from 'lucide-react';

const tierColor = (tier) => {
    if (tier === 'Tree')   return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    if (tier === 'Forest') return 'bg-amber-100  text-amber-800  border border-amber-200';
    return 'bg-gray-100 text-gray-600 border border-gray-200';
};

const TierIcon = ({ tier, className = 'w-4 h-4' }) => {
    if (tier === 'Tree')   return <TreePine className={className} />;
    if (tier === 'Forest') return <Trees    className={className} />;
    return <Sprout className={className} />;
};

const Flash = ({ message, type = 'success' }) => {
    if (!message) return null;
    const styles = type === 'success'
        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
        : 'bg-red-50 border-red-300 text-red-800';
    return (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium mb-6 ${styles}`}>
            {type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message}
        </div>
    );
};

const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-100 bg-white px-6 py-5">
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition" type="button">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-5">{children}</div>
        </div>
    </div>
);

const Field = ({ label, children, error }) => (
    <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition";

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
        </div>
    </div>
);

export default function Admin() {
    const { subscribers = [], rewards = [], notifications = [], forestRequests = [], flash, auth } = usePage().props;
    const [localSubscribers, setLocalSubscribers] = useState(subscribers || []);
    const [localRewards, setLocalRewards] = useState(rewards || []);
    const [localNotifications, setLocalNotifications] = useState(notifications || []);
    const [localForestRequests, setLocalForestRequests] = useState(forestRequests || []);
    const [loading, setLoading] = useState(true);

    const [tab, setTab]     = useState('subscriptions');
    const [search, setSearch] = useState('');

    const [rewardModal, setRewardModal]   = useState(false);
    const [editReward, setEditReward]     = useState(null);
    const [rewardForm, setRewardForm]     = useState({ name: '', description: '', points_required: '' });
    const [imageFile, setImageFile]       = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef                    = useRef(null);

    const [notifModal, setNotifModal]     = useState(false);
    const [notifForm, setNotifForm]       = useState({ message: '', audience: 'seed_and_tree' });
    const [proposalModal, setProposalModal] = useState(false);
    const [proposalDetails, setProposalDetails] = useState(null);

    const [editingUser, setEditingUser]   = useState(null);
    const [tierValue, setTierValue]       = useState('');
    const [pointsValue, setPointsValue]   = useState('');

    const loadSupabaseData = async () => {
        setLoading(true);
        try {
            const { data: dbUsers } = await supabase.from('users').select('*');
            if (dbUsers) setLocalSubscribers(dbUsers);

            const { data: dbRewards } = await supabase.from('rewards').select('*').order('points_required', { ascending: true });
            if (dbRewards) setLocalRewards(dbRewards);

            const { data: dbNotifs } = await supabase.from('notifications').select('*').order('id', { ascending: false });
            if (dbNotifs) setLocalNotifications(dbNotifs);

            const { data: dbRequests } = await supabase.from('forest_partnership_requests').select('*').order('id', { ascending: false });
            if (dbRequests) setLocalForestRequests(dbRequests);
        } catch (err) {
            console.error('Error loading Supabase admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSupabaseData();
    }, [subscribers, rewards, notifications, forestRequests]);

    const seedCount   = localSubscribers.filter(u => u.membership_tier === 'Seed').length;
    const treeCount   = localSubscribers.filter(u => u.membership_tier === 'Tree').length;
    const forestCount = localSubscribers.filter(u => u.membership_tier === 'Forest').length;

    const getPreviewText = (text) => {
        if (!text) return '';
        return text.length > 160 ? `${text.slice(0, 160)}...` : text;
    };

    const filtered = localSubscribers.filter(u =>
        `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    const openAddReward = () => {
        setEditReward(null);
        setRewardForm({ name: '', description: '', points_required: '' });
        setImageFile(null);
        setImagePreview(null);
        setRewardModal(true);
    };
    const openEditReward = (r) => {
        setEditReward(r);
        setRewardForm({ name: r.name, description: r.description, points_required: r.points_required });
        setImageFile(null);
        setImagePreview(r.image || null);
        setRewardModal(true);
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };
    const submitReward = async () => {
        try {
            if (editReward) {
                const { error } = await supabase.from('rewards').update({
                    name: rewardForm.name,
                    description: rewardForm.description,
                    points_required: parseInt(rewardForm.points_required),
                    image: imagePreview
                }).eq('id', editReward.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from('rewards').insert({
                    name: rewardForm.name,
                    description: rewardForm.description,
                    points_required: parseInt(rewardForm.points_required),
                    image: imagePreview,
                    created_by: auth?.user?.supabase_id || null
                });
                if (error) throw error;
            }
        } catch (err) {
            console.error('Failed to save reward to Supabase:', err);
        }

        const formData = new FormData();
        formData.append('name',             rewardForm.name);
        formData.append('description',      rewardForm.description);
        formData.append('points_required',  rewardForm.points_required);
        if (imageFile) formData.append('image', imageFile);

        if (editReward) {
            formData.append('_method', 'PUT');
            router.post(`/admin/rewards/${editReward.id}`, formData, {
                forceFormData: true,
                onSuccess: () => setRewardModal(false),
            });
        } else {
            router.post('/admin/rewards', formData, {
                forceFormData: true,
                onSuccess: () => setRewardModal(false),
            });
        }
    };
    const deleteReward = async (id) => {
        if (confirm('Delete this reward?')) {
            try {
                await supabase.from('rewards').delete().eq('id', id);
            } catch (err) {
                console.error('Failed to delete reward from Supabase:', err);
            }
            router.delete(`/admin/rewards/${id}`);
        }
    };

    const submitNotif = async () => {
        try {
            await supabase.from('notifications').insert({
                message: notifForm.message,
                audience: notifForm.audience,
                created_by: auth?.user?.supabase_id || null
            });
        } catch (err) {
            console.error('Failed to send notification to Supabase:', err);
        }

        router.post('/admin/notifications', notifForm, {
            onSuccess: () => { setNotifModal(false); setNotifForm({ message: '', audience: 'seed_and_tree' }); }
        });
    };
    const deleteNotif = async (id) => {
        if (confirm('Delete this notification?')) {
            try {
                await supabase.from('notifications').delete().eq('id', id);
            } catch (err) {
                console.error('Failed to delete notification from Supabase:', err);
            }
            router.delete(`/admin/notifications/${id}`);
        }
    };

    const startEdit = (user) => {
        setEditingUser(user.id);
        setTierValue(user.membership_tier);
        setPointsValue(user.points);
    };
    const saveSubscription = async (userId) => {
        const userObj = localSubscribers.find(u => u.id === userId);
        if (userObj?.supabase_id) {
            try {
                await supabase.from('users').update({ membership_tier: tierValue }).eq('id', userObj.supabase_id);
            } catch (err) {
                console.error('Failed to update subscription in Supabase:', err);
            }
        }
        router.put(`/admin/subscriptions/${userId}`, { membership_tier: tierValue }, {
            onSuccess: () => setEditingUser(null)
        });
    };
    const savePoints = async (userId) => {
        const userObj = localSubscribers.find(u => u.id === userId);
        if (userObj?.supabase_id) {
            try {
                await supabase.from('users').update({ points: pointsValue }).eq('id', userObj.supabase_id);
            } catch (err) {
                console.error('Failed to update points in Supabase:', err);
            }
        }
        router.put(`/admin/subscriptions/${userId}/points`, { points: pointsValue }, {
            onSuccess: () => setEditingUser(null)
        });
    };

    const tabs = [
        { id: 'subscriptions', label: 'Subscriptions', icon: Users },
        { id: 'rewards',       label: 'Rewards',       icon: Gift  },
        { id: 'notifications', label: 'Notifications', icon: Bell  },
        { id: 'forest',        label: 'Forest Requests', icon: Trees },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Rural Rising — Membership Management</p>
                </div>
                <span className="text-xs bg-green-100 text-green-800 border border-green-200 rounded-full px-3 py-1 font-semibold">
                    Admin
                </span>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <Flash message={flash?.status} type="success" />
                <Flash message={flash?.error}  type="error"   />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Total Members"  value={subscribers.length} icon={BarChart2} color="bg-gray-700" />
                    <StatCard label="Seed Members"   value={seedCount}          icon={Sprout}    color="bg-gray-400" />
                    <StatCard label="Tree Members"   value={treeCount}          icon={TreePine}  color="bg-emerald-600" />
                    <StatCard label="Forest Members" value={forestCount}        icon={Trees}     color="bg-amber-500" />
                </div>

                <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
                    {tabs.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                tab === id
                                    ? 'bg-white text-green-800 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                </div>

                {tab === 'subscriptions' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                            <h2 className="text-lg font-bold text-gray-900">All Members</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 w-64"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        <th className="px-6 py-3">Member</th>
                                        <th className="px-6 py-3">Tier</th>
                                        <th className="px-6 py-3">Points</th>
                                        <th className="px-6 py-3">Joined</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filtered.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                                                No members found.
                                            </td>
                                        </tr>
                                    )}
                                    {filtered.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
                                                <p className="text-gray-500 text-xs mt-0.5">{user.email}</p>
                                            </td>

                                            {/* tier cell */}
                                            <td className="px-6 py-4">
                                                {editingUser === user.id ? (
                                                    <select
                                                        value={tierValue}
                                                        onChange={e => setTierValue(e.target.value)}
                                                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                                                    >
                                                        <option value="Seed">Seed</option>
                                                        <option value="Tree">Tree</option>
                                                        <option value="Forest">Forest</option>
                                                    </select>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${tierColor(user.membership_tier)}`}>
                                                        <TierIcon tier={user.membership_tier} className="w-3 h-3" />
                                                        {user.membership_tier}
                                                    </span>
                                                )}
                                            </td>

                                            {/* points cell */}
                                            <td className="px-6 py-4">
                                                {editingUser === user.id ? (
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={pointsValue}
                                                        onChange={e => setPointsValue(e.target.value)}
                                                        className="w-24 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                                                    />
                                                ) : (
                                                    <span className="font-medium text-gray-700">{user.points ?? 0} pts</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-gray-500 text-xs">
                                                {new Date(user.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                {editingUser === user.id ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => saveSubscription(user.id)}
                                                            className="text-xs bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition font-semibold"
                                                        >
                                                            Save Tier
                                                        </button>
                                                        <button
                                                            onClick={() => savePoints(user.id)}
                                                            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-500 transition font-semibold"
                                                        >
                                                            Save Pts
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingUser(null)}
                                                            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-lg transition"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => startEdit(user)}
                                                        className="inline-flex items-center gap-1.5 text-xs text-green-800 border border-green-200 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition font-semibold"
                                                    >
                                                        <Edit2 className="w-3 h-3" /> Edit
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {tab === 'rewards' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Reward Catalog</h2>
                            <button
                                onClick={openAddReward}
                                className="inline-flex items-center gap-2 bg-green-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition shadow-sm"
                            >
                                <Plus className="w-4 h-4" /> Add Reward
                            </button>
                        </div>

                        {localRewards.length === 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                                <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="font-semibold">No rewards yet. Add one to get started.</p>
                            </div>
                        )}

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {localRewards.map(r => (
                                <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                                    <div className="h-40 bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center">
                                        {r.image
                                            ? <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
                                            : <Gift className="w-12 h-12 text-green-200" />
                                        }
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="font-bold text-gray-900 mb-1">{r.name}</h3>
                                        <p className="text-gray-500 text-sm flex-grow">{r.description}</p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                                                {r.points_required} pts
                                            </span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditReward(r)}
                                                    className="p-2 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteReward(r.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'forest' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Forest Partnership Requests</h2>
                            <span className="text-xs text-gray-500">Pending, accepted, and declined submissions are listed here.</span>
                        </div>

                        {localForestRequests.length === 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                                <Trees className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="font-semibold">No partnership requests yet.</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {localForestRequests.map((request) => (
                                <div key={request.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap mb-2">
                                                <h3 className="text-lg font-bold text-gray-900">{request.business_name}</h3>
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${
                                                    request.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                                    request.status === 'declined' ? 'bg-red-100 text-red-800 border-red-200' :
                                                    'bg-amber-100 text-amber-800 border-amber-200'
                                                }`}>
                                                    {request.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Current status</p>
                                            <p className="text-sm font-semibold text-gray-700 capitalize">{request.status}</p>
                                            <p className="text-sm text-gray-500 mt-2">Contact: {request.contact_person} • {request.email} • {request.phone}</p>
                                            <p className="text-sm text-gray-500">Preferred date: {new Date(request.preferred_date).toLocaleDateString('en-PH')}</p>
                                            <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{getPreviewText(request.proposal_description)}</p>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setProposalDetails(request);
                                                    setProposalModal(true);
                                                }}
                                                className="mt-3 text-xs font-semibold text-green-800 hover:text-green-700 transition"
                                            >
                                                Read full proposal
                                            </button>
                                        </div>

                                        <div className="lg:text-right">
                                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">Update status</p>
                                            <div className="flex flex-wrap gap-2 lg:justify-end">
                                                {['accepted', 'declined'].map((status) => (
                                                    <button
                                                        key={status}
                                                        type="button"
                                                        disabled={request.status !== 'pending'}
                                                        onClick={async () => {
                                                            try {
                                                                await supabase.from('forest_partnership_requests')
                                                                    .update({ status })
                                                                    .eq('email', request.email)
                                                                    .eq('business_name', request.business_name);
                                                            } catch (err) {
                                                                console.error('Failed to update request status in Supabase:', err);
                                                            }
                                                            router.patch(`/admin/forest-requests/${request.id}`, { status }, {
                                                                onSuccess: () => router.reload({ only: ['forestRequests'] })
                                                            });
                                                        }}
                                                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                                                            request.status === status
                                                                ? 'bg-green-800 text-white border-green-800'
                                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                                        } ${request.status !== 'pending' ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                    >
                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                            {request.status !== 'pending' && (
                                                <p className="text-xs text-gray-400 mt-2">This decision is locked and can no longer be changed.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tab === 'notifications' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                            <button
                                onClick={() => setNotifModal(true)}
                                className="inline-flex items-center gap-2 bg-green-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition shadow-sm"
                            >
                                <Plus className="w-4 h-4" /> New Notification
                            </button>
                        </div>

                        {localNotifications.length === 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="font-semibold">No notifications yet.</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {localNotifications.map(n => (
                                <div key={n.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex items-start gap-4">
                                    <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        n.audience === 'tree_only'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        <Bell className="w-4 h-4" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="text-gray-800 text-sm">{n.message}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                n.audience === 'tree_only'
                                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                                            }`}>
                                                {n.audience === 'tree_only' ? '🌳 Tree only' : '🌱 Seed + Tree'}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(n.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteNotif(n.id)}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {proposalModal && proposalDetails && (
                <Modal title={`Proposal from ${proposalDetails.business_name}`} onClose={() => { setProposalModal(false); setProposalDetails(null); }}>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Contact</p>
                            <p className="text-sm text-gray-700">{proposalDetails.contact_person} • {proposalDetails.email} • {proposalDetails.phone}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Preferred date</p>
                            <p className="text-sm text-gray-700">{new Date(proposalDetails.preferred_date).toLocaleDateString('en-PH')}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-1">Proposal description</p>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{proposalDetails.proposal_description}</p>
                        </div>
                    </div>
                </Modal>
            )}

            {rewardModal && (
                <Modal title={editReward ? 'Edit Reward' : 'Add New Reward'} onClose={() => setRewardModal(false)}>
                    <Field label="Reward Name">
                        <input
                            type="text"
                            value={rewardForm.name}
                            onChange={e => setRewardForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="e.g. RuRi Eco Bag"
                            className={inputCls}
                        />
                    </Field>
                    <Field label="Description">
                        <textarea
                            value={rewardForm.description}
                            onChange={e => setRewardForm(f => ({ ...f, description: e.target.value }))}
                            rows={3}
                            placeholder="Brief description of the reward..."
                            className={inputCls}
                        />
                    </Field>
                    <Field label="Points Required">
                        <input
                            type="number"
                            min="1"
                            value={rewardForm.points_required}
                            onChange={e => setRewardForm(f => ({ ...f, points_required: e.target.value }))}
                            placeholder="e.g. 100"
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Reward Image (optional)">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpg,image/jpeg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        {imagePreview ? (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-40 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-2 right-2 bg-white text-gray-700 border border-gray-200 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-gray-50 transition flex items-center gap-1.5"
                                >
                                    <Upload className="w-3.5 h-3.5" /> Change
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-green-400 transition flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-green-700"
                            >
                                <ImagePlus className="w-8 h-8" />
                                <span className="text-sm font-medium">Click to upload image</span>
                                <span className="text-xs">JPG, PNG, WEBP — max 2MB</span>
                            </button>
                        )}
                    </Field>
                    <button
                        onClick={submitReward}
                        className="w-full bg-green-800 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition mt-2"
                    >
                        {editReward ? 'Save Changes' : 'Add Reward'}
                    </button>
                </Modal>
            )}

            {notifModal && (
                <Modal title="New Notification" onClose={() => setNotifModal(false)}>
                    <Field label="Message">
                        <textarea
                            value={notifForm.message}
                            onChange={e => setNotifForm(f => ({ ...f, message: e.target.value }))}
                            rows={4}
                            placeholder="Write your notification message..."
                            className={inputCls}
                        />
                    </Field>
                    <Field label="Send To">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: 'seed_and_tree', label: 'Seed + Tree', icon: '🌱', desc: 'All paying members' },
                                { value: 'tree_only',     label: 'Tree only',   icon: '🌳', desc: 'Premium members'   },
                            ].map(opt => (
                                <label
                                    key={opt.value}
                                    className={`cursor-pointer rounded-xl border-2 p-4 transition ${
                                        notifForm.audience === opt.value
                                            ? 'border-green-700 bg-green-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="audience"
                                        value={opt.value}
                                        checked={notifForm.audience === opt.value}
                                        onChange={() => setNotifForm(f => ({ ...f, audience: opt.value }))}
                                        className="sr-only"
                                    />
                                    <span className="text-xl block mb-1">{opt.icon}</span>
                                    <span className="block text-sm font-bold text-gray-800">{opt.label}</span>
                                    <span className="block text-xs text-gray-500">{opt.desc}</span>
                                </label>
                            ))}
                        </div>
                    </Field>
                    <button
                        onClick={submitNotif}
                        className="w-full bg-green-800 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition mt-2"
                    >
                        Send Notification
                    </button>
                </Modal>
            )}
        </div>
    );
}
