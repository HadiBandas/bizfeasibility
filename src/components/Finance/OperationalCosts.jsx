import React, { useState } from 'react';
import useWizardStore from '../../context/useWizardStore';

// --- ICONS (Inline SVG for portability) ---
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const CostRow = ({ item, index, onUpdate, onRemove, type }) => {
    const field = type === 'tetap' ? 'jumlah' : 'perUnit';
    
    const handleNumericInput = (e) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        onUpdate(index, field, Number(value));
    };

    const handleNameChange = (e) => {
        onUpdate(index, 'nama', e.target.value);
    };

    return (
        <div className="grid grid-cols-12 gap-2 items-center bg-white p-3 rounded-lg border">
            <div className="col-span-6">
                <input
                    type="text"
                    placeholder="Nama Biaya (cth: Gaji)"
                    value={item.nama || ''}
                    onChange={handleNameChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>
            <div className="col-span-5">
                <input
                    type="text"
                    placeholder="Jumlah (Rp)"
                    value={item[field] ? Number(item[field]).toLocaleString('id-ID') : ''}
                    onChange={handleNumericInput}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
            </div>
            <div className="col-span-1">
                <button 
                    onClick={() => onRemove(index)} 
                    className="p-2 hover:bg-red-100 rounded-full transition-colors"
                    title="Hapus biaya"
                >
                    <TrashIcon />
                </button>
            </div>
        </div>
    );
};

export const OperationalCosts = () => {
    const { keuangan, actions } = useWizardStore(state => ({
        keuangan: state.keuangan,
        actions: state.actions,
    }));
    
    const { operasional } = keuangan;

    const handleAddFixedCost = () => {
        actions.addFixedCost();
    };

    const handleAddVariableCost = () => {
        actions.addVariableCost();
    };

    const handleUpdateFixedCost = (index, field, value) => {
        actions.updateFixedCost(index, field, value);
    };

    const handleUpdateVariableCost = (index, field, value) => {
        actions.updateVariableCost(index, field, value);
    };

    const handleRemoveFixedCost = (index) => {
        actions.removeFixedCost(index);
    };

    const handleRemoveVariableCost = (index) => {
        actions.removeVariableCost(index);
    };

    return (
        <div className="space-y-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800">Detail Biaya Operasional</h3>
            
            {/* Biaya Tetap */}
            <div>
                <h4 className="font-semibold text-gray-700 mb-3">Biaya Tetap (Per Bulan)</h4>
                <div className="space-y-2">
                    {operasional?.tetap?.map((item, index) => (
                        <CostRow 
                            key={item.id} 
                            item={item} 
                            index={index} 
                            onUpdate={handleUpdateFixedCost}
                            onRemove={handleRemoveFixedCost}
                            type="tetap"
                        />
                    ))}
                </div>
                <button 
                    onClick={handleAddFixedCost} 
                    className="mt-3 px-4 py-2 bg-transparent border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                    + Tambah Biaya Tetap
                </button>
            </div>

            {/* Biaya Variabel */}
            <div>
                <h4 className="font-semibold text-gray-700 mb-3">Biaya Variabel (Per Unit)</h4>
                <div className="space-y-2">
                    {operasional?.variabel?.map((item, index) => (
                        <CostRow 
                            key={item.id} 
                            item={item} 
                            index={index} 
                            onUpdate={handleUpdateVariableCost}
                            onRemove={handleRemoveVariableCost}
                            type="variabel"
                        />
                    ))}
                </div>
                <button 
                    onClick={handleAddVariableCost} 
                    className="mt-3 px-4 py-2 bg-transparent border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                    + Tambah Biaya Variabel
                </button>
            </div>

            {/* Summary */}
            <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-semibold text-gray-700 mb-2">Ringkasan Biaya</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Total Biaya Tetap/Bulan:</p>
                        <p className="font-semibold text-blue-600">
                            Rp {(keuangan.metrics?.totalFixedCosts || 0).toLocaleString('id-ID')}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-500">Total Biaya Variabel/Unit:</p>
                        <p className="font-semibold text-green-600">
                            Rp {(keuangan.metrics?.totalVariableCostPerUnit || 0).toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}; 