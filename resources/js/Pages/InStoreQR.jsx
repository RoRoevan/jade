import { usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { QrCode, Store, ArrowLeft, RefreshCw, TreePine } from 'lucide-react';

function QRPlaceholder({ value }) {
    const size   = 21;
    const seed   = [...value].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const pseudo = (i) => ((seed * 9301 + i * 49297) % 233280) / 233280;

    const cells = [];
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const inFinder =
                (r < 7 && c < 7) ||
                (r < 7 && c >= size - 7) ||
                (r >= size - 7 && c < 7);
            const filled = inFinder || pseudo(r * size + c) > 0.48;
            cells.push({ r, c, filled });
        }
    }

    return (
        <div className="inline-block p-4 bg-white rounded-2xl shadow-inner border border-gray-100">
            <svg
                viewBox={`0 0 ${size} ${size}`}
                width="220"
                height="220"
                shapeRendering="crispEdges"
                xmlns="http://www.w3.org/2000/svg"
            >
                {cells.map(({ r, c, filled }) =>
                    filled ? (
                        <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#1a3a1a" />
                    ) : null
                )}
            </svg>
        </div>
    );
}

export default function InStoreQR() {
    const { auth } = usePage().props;
    const user = auth.user;

    const [payload, setPayload] = useState('');
    const [generated, setGenerated] = useState(false);

    const generateQR = () => {
        const ts = new Date().toISOString();
        setPayload(`RURI-INSTORE|uid:${user.id}|ts:${ts}`);
        setGenerated(true);
    };

    if (user.membership_tier !== 'Tree') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center border border-gray-100">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <TreePine className="w-8 h-8 text-amber-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-green-900 mb-3">Tree Members Only</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        The in-store QR feature is exclusive to Tree members. Upgrade your plan to earn points on every cash purchase.
                    </p>
                    <Link
                        href="/checkout?tier=Tree"
                        className="inline-flex items-center justify-center bg-green-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition shadow"
                    >
                        Upgrade to Tree
                    </Link>
                    <Link
                        href="/profile"
                        className="block mt-4 text-sm text-gray-400 hover:text-gray-600 transition"
                    >
                        Back to Profile
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
            <div className="bg-green-900 text-white px-6 py-4 flex items-center gap-3">
                <Link href="/profile" className="text-green-300 hover:text-white transition">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-2">
                    <Store className="w-5 h-5 text-amber-400" />
                    <span className="font-semibold">In-Store Purchase QR</span>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-16">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

                    <div className="bg-gradient-to-r from-green-800 to-green-700 px-8 py-6 text-white">
                        <div className="flex items-center gap-3 mb-1">
                            <TreePine className="w-5 h-5 text-amber-400" />
                            <span className="text-sm font-semibold text-green-200 uppercase tracking-widest">Tree Member</span>
                        </div>
                        <h1 className="text-2xl font-bold">{user.first_name} {user.last_name}</h1>
                        <p className="text-green-300 text-sm mt-0.5">{user.email}</p>
                        <div className="mt-3 inline-flex items-center gap-2 bg-green-700/60 rounded-full px-3 py-1">
                            <span className="text-xs text-green-200">Current Points:</span>
                            <span className="text-sm font-bold text-amber-400">{user.points ?? 0} pts</span>
                        </div>
                    </div>

                    <div className="px-8 py-10 flex flex-col items-center text-center">
                        {generated ? (
                            <>
                                <QRPlaceholder value={payload} />
                                <p className="mt-6 text-sm text-gray-500 leading-relaxed max-w-xs">
                                    Show this QR to the clerk at checkout. They will scan it to credit points to your account.
                                </p>
                                <p className="mt-3 text-xs text-gray-400 font-mono bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100 break-all">
                                    {payload}
                                </p>
                                <button
                                    onClick={generateQR}
                                    className="mt-6 inline-flex items-center gap-2 text-sm text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 px-5 py-2.5 rounded-full font-semibold transition"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Refresh QR
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center border-2 border-dashed border-green-200 mb-6">
                                    <QrCode className="w-14 h-14 text-green-300" />
                                </div>
                                <h2 className="text-xl font-bold text-green-900 mb-2">Generate Your QR Code</h2>
                                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
                                    Tap below to generate a unique QR code for your in-store cash purchase. The clerk will scan it to add points to your account.
                                </p>
                                <button
                                    onClick={generateQR}
                                    className="inline-flex items-center gap-2 bg-green-800 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-green-700 transition shadow-lg"
                                >
                                    <QrCode className="w-5 h-5" />
                                    Generate QR Code
                                </button>
                            </>
                        )}
                    </div>

                    <div className="bg-amber-50 border-t border-amber-100 px-8 py-4 text-center">
                        <p className="text-xs text-amber-700 font-medium">
                            📍 Valid for in-store cash purchases only at Rural Rising physical locations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
