import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useProgress } from "../state/useProgress";
import { RoomItem, RoomBackground, Avatar, AssetCategory } from "../components/RoomAssets";

// --- Shop Data ---
const SHOP_ITEMS: { id: string; nameKey: string; cost: number; category: AssetCategory }[] = [
  // Furniture
  { id: "bed", nameKey: "bed", cost: 300, category: "furniture" },
  { id: "sofa", nameKey: "sofa", cost: 250, category: "furniture" },
  { id: "wardrobe", nameKey: "wardrobe", cost: 200, category: "furniture" },
  { id: "table", nameKey: "table", cost: 150, category: "furniture" },
  { id: "chair", nameKey: "chair", cost: 80, category: "furniture" },
  { id: "nightstand", nameKey: "nightstand", cost: 100, category: "furniture" },
  { id: "shelf", nameKey: "shelf", cost: 120, category: "furniture" },
  { id: "lamp", nameKey: "lamp", cost: 50, category: "furniture" },
  { id: "desk", nameKey: "desk", cost: 100, category: "furniture" },
  { id: "armchair", nameKey: "armchair", cost: 120, category: "furniture" },
  { id: "coffee_table", nameKey: "coffee_table", cost: 90, category: "furniture" },
  { id: "ottoman", nameKey: "ottoman", cost: 60, category: "furniture" },
  { id: "fridge", nameKey: "fridge", cost: 300, category: "furniture" },
  // Decoration
  { id: "plant", nameKey: "plant", cost: 40, category: "decoration" },
  { id: "poster", nameKey: "poster", cost: 60, category: "decoration" },
  { id: "rug", nameKey: "rug", cost: 70, category: "decoration" },
  { id: "clock", nameKey: "clock", cost: 45, category: "decoration" },
  { id: "mirror", nameKey: "mirror", cost: 55, category: "decoration" },
  { id: "trophy", nameKey: "trophy", cost: 150, category: "decoration" },
  { id: "globe", nameKey: "globe", cost: 65, category: "decoration" },
  // Pets
  { id: "cat", nameKey: "cat", cost: 200, category: "pet" },
  { id: "dog", nameKey: "dog", cost: 200, category: "pet" },
  { id: "fish", nameKey: "fish", cost: 100, category: "pet" },
  // Electronics
  { id: "computer", nameKey: "computer", cost: 250, category: "electronics" },
  { id: "tablet", nameKey: "tablet", cost: 180, category: "electronics" },
  { id: "camera", nameKey: "camera", cost: 150, category: "electronics" },
  // Backgrounds
  { id: "bg_pink", nameKey: "bg_pink", cost: 100, category: "background" },
  { id: "bg_green", nameKey: "bg_green", cost: 100, category: "background" },
  { id: "bg_space", nameKey: "bg_space", cost: 300, category: "background" },
  // Outfits
  { id: "outfit_dress", nameKey: "outfit_dress", cost: 150, category: "outfit" },
  { id: "outfit_overalls", nameKey: "outfit_overalls", cost: 150, category: "outfit" },
  // Hair
  { id: "hair_spiky", nameKey: "hair_spiky", cost: 50, category: "hair" },
  { id: "hair_pigtails", nameKey: "hair_pigtails", cost: 50, category: "hair" },
  // Accessories
  { id: "acc_glasses", nameKey: "acc_glasses", cost: 80, category: "accessory" },
];

type Tab = "room" | "shop" | "avatar";

export default function RoomShop() {
  const { t } = useTranslation();
  const { progress, unlockItem, spendCoins, updateRoomLayout, updateRoomBackground, updateAvatar } = useProgress();
  const [activeTab, setActiveTab] = useState<Tab>("room");
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | "all">("all");

  // --- Drag & Drop State ---
  const roomRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // --- Handlers ---

  const handleBuy = (item: typeof SHOP_ITEMS[0]) => {
    if (progress.coins < item.cost) return;
    spendCoins(item.cost);
    unlockItem(item.id);
    
    // Auto-equip/apply if it's a background or avatar item
    if (item.category === 'background') {
      updateRoomBackground(item.id.replace('bg_', ''));
    } else if (item.category === 'outfit') {
      updateAvatar({ outfit: item.id.replace('outfit_', '') });
    } else if (item.category === 'hair') {
      updateAvatar({ hairStyle: item.id.replace('hair_', '') });
    } else if (item.category === 'accessory') {
      updateAvatar({ accessory: item.id.replace('acc_', '') });
    }
  };

  const handleSpawnItem = (itemId: string) => {
    // Add item to center of room
    const newItem = {
      id: itemId,
      x: 50, // percent
      y: 50, // percent
      instanceId: Date.now().toString() // unique id for this instance
    };
    // For now, we just use the item ID as the unique key in the placed array if we don't have instance IDs in the type yet.
    // But wait, the type in progressManager is {id: string, x: number, y: number}. 
    // If we want multiple of the same item, we need a unique identifier or index.
    // The current type definition in progressManager is simple. Let's assume we can have multiple.
    // We'll use the index in the array as the key for React, but for updating we need to be careful.
    // Let's just append.
    updateRoomLayout([...progress.room.placedItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...progress.room.placedItems];
    newItems.splice(index, 1);
    updateRoomLayout(newItems);
  };

  // --- Drag Logic ---
  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const item = progress.room.placedItems[index];
    setDraggingId(index.toString());
    
    if (roomRef.current) {
      const rect = roomRef.current.getBoundingClientRect();
      // Calculate offset from the item's center/position
      // item.x/y are percentages.
      const itemXPx = (item.x / 100) * rect.width;
      const itemYPx = (item.y / 100) * rect.height;
      
      setDragOffset({
        x: e.clientX - rect.left - itemXPx,
        y: e.clientY - rect.top - itemYPx
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId !== null && roomRef.current) {
      const rect = roomRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      
      // Convert back to percentage
      const xPct = Math.max(0, Math.min(100, (x / rect.width) * 100));
      const yPct = Math.max(0, Math.min(100, (y / rect.height) * 100));
      
      const index = parseInt(draggingId);
      const newItems = [...progress.room.placedItems];
      newItems[index] = { ...newItems[index], x: xPct, y: yPct };
      updateRoomLayout(newItems);
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  // --- Renderers ---

  const renderRoom = () => (
    <div className="flex flex-col h-full gap-4">
      {/* Room Viewport */}
      <div 
        ref={roomRef}
        className="relative w-full aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-inner border-4 border-white"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <RoomBackground variant={progress.room.background} />
        
        {/* Avatar (Fixed position for now, or draggable?) Let's keep it fixed in center-bottom for simplicity, or allow drag? */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-32 h-32 z-10 pointer-events-none">
           <Avatar {...progress.avatar} className="w-full h-full drop-shadow-lg" />
        </div>

        {/* Placed Items */}
        {progress.room.placedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="absolute w-24 h-24 cursor-move hover:scale-105 transition-transform active:scale-110"
            style={{ 
              left: `${item.x}%`, 
              top: `${item.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: Math.floor(item.y) // Simple depth sorting
            }}
            onMouseDown={(e) => handleMouseDown(e, index)}
          >
            <RoomItem id={item.id} className="w-full h-full drop-shadow-md" />
            {/* Delete button on hover/active could go here */}
            <button 
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity shadow-sm"
              onClick={(e) => { e.stopPropagation(); handleRemoveItem(index); }}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Inventory Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <p className="text-sm font-bold text-night/70 mb-2">{t("room.inventory")}</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {progress.room.ownedItems.filter(id => !id.startsWith('bg_') && !id.startsWith('outfit_') && !id.startsWith('hair_') && !id.startsWith('acc_')).map((id) => (
            <button
              key={id}
              onClick={() => handleSpawnItem(id)}
              className="flex-shrink-0 w-16 h-16 bg-slate-50 rounded-xl border border-slate-200 p-2 hover:bg-sky-50 hover:border-sky-200 transition-colors"
            >
              <RoomItem id={id} className="w-full h-full" />
            </button>
          ))}
          {progress.room.ownedItems.length === 0 && (
            <p className="text-sm text-slate-400 italic">Go to the shop to buy items!</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderShop = () => {
    const categories: (AssetCategory | "all")[] = ["all", "furniture", "decoration", "pet", "electronics", "background", "outfit", "hair", "accessory"];
    
    const filteredItems = selectedCategory === "all" 
      ? SHOP_ITEMS 
      : SHOP_ITEMS.filter(item => item.category === selectedCategory);

    return (
      <div className="space-y-4">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat 
                  ? "bg-night text-white" 
                  : "bg-white text-night/70 hover:bg-slate-100"
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const owned = progress.room.ownedItems.includes(item.id);
            const canAfford = progress.coins >= item.cost;
            
            return (
              <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex flex-col gap-2">
                <div className="aspect-square bg-slate-50 rounded-xl p-2 flex items-center justify-center relative overflow-hidden">
                  {item.category === 'background' ? (
                    <RoomBackground variant={item.id.replace('bg_', '')} className="rounded-lg" />
                  ) : item.category === 'outfit' || item.category === 'hair' || item.category === 'accessory' ? (
                     // Preview avatar items on a dummy avatar or just icon? Let's try icon if possible or just text.
                     // Actually we can use the Avatar component to preview.
                     <Avatar 
                        skinColor="#FFDFC4" 
                        hairStyle={item.category === 'hair' ? item.id.replace('hair_', '') : 'bob'}
                        hairColor="#8D5524"
                        outfit={item.category === 'outfit' ? item.id.replace('outfit_', '') : 'tshirt'}
                        accessory={item.category === 'accessory' ? item.id.replace('acc_', '') : undefined}
                        className="w-full h-full"
                     />
                  ) : (
                    <RoomItem id={item.id} className="w-full h-full" />
                  )}
                  
                  {owned && (
                    <div className="absolute top-2 right-2 bg-mint text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                      Owned
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-bold text-night text-sm">{t(`room.items.${item.nameKey}`)}</p>
                    <p className="text-xs text-night/50 font-semibold">{item.cost} 🪙</p>
                  </div>
                  <button
                    disabled={owned || !canAfford}
                    onClick={() => handleBuy(item)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      owned ? "bg-slate-100 text-slate-400" : canAfford ? "bg-ocean text-white hover:bg-ocean/90" : "bg-slate-200 text-slate-400"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAvatarEditor = () => (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="bg-gradient-to-b from-sky-100 to-white rounded-full aspect-square flex items-center justify-center shadow-inner border-4 border-white">
        <Avatar {...progress.avatar} className="w-64 h-64 drop-shadow-xl" />
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-night mb-3">Character Type</h3>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => updateAvatar({ variant: undefined })}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${!progress.avatar.variant ? 'bg-night text-white shadow-md' : 'bg-white text-night border border-slate-200 hover:bg-slate-50'}`}
            >
              Custom
            </button>
            <button
              onClick={() => updateAvatar({ variant: 'boy' })}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${progress.avatar.variant === 'boy' ? 'bg-night text-white shadow-md' : 'bg-white text-night border border-slate-200 hover:bg-slate-50'}`}
            >
              Boy
            </button>
            <button
              onClick={() => updateAvatar({ variant: 'girl' })}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${progress.avatar.variant === 'girl' ? 'bg-night text-white shadow-md' : 'bg-white text-night border border-slate-200 hover:bg-slate-50'}`}
            >
              Girl
            </button>
          </div>
        </div>

        {!progress.avatar.variant && (
          <>
            <div>
              <h3 className="font-bold text-night mb-3">Skin Tone</h3>
              <div className="flex gap-3">
                {['#FFDFC4', '#E0AC69', '#8D5524', '#5C3A1E'].map(color => (
                  <button
                    key={color}
                    onClick={() => updateAvatar({ skinColor: color })}
                    className={`w-10 h-10 rounded-full border-2 ${progress.avatar.skinColor === color ? 'border-night scale-110' : 'border-transparent hover:scale-105'} transition-transform shadow-sm`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-night mb-3">Hair Color</h3>
              <div className="flex gap-3">
                {['#FCE786', '#8D5524', '#2D2D2D', '#D65A31', '#FF99C8'].map(color => (
                  <button
                    key={color}
                    onClick={() => updateAvatar({ hairColor: color })}
                    className={`w-10 h-10 rounded-full border-2 ${progress.avatar.hairColor === color ? 'border-night scale-110' : 'border-transparent hover:scale-105'} transition-transform shadow-sm`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <div>
          <h3 className="font-bold text-night mb-3">Style</h3>
          <div className="flex flex-wrap gap-2">
             {/* Only show owned styles */}
             <button 
                onClick={() => updateAvatar({ hairStyle: 'bob' })}
                className={`px-3 py-1 rounded-lg text-sm font-semibold border ${progress.avatar.hairStyle === 'bob' ? 'bg-night text-white border-night' : 'bg-white text-night border-slate-200'}`}
             >
               Bob
             </button>
             {progress.room.ownedItems.includes('hair_spiky') && (
               <button 
                  onClick={() => updateAvatar({ hairStyle: 'spiky' })}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold border ${progress.avatar.hairStyle === 'spiky' ? 'bg-night text-white border-night' : 'bg-white text-night border-slate-200'}`}
               >
                 Spiky
               </button>
             )}
             {progress.room.ownedItems.includes('hair_pigtails') && (
               <button 
                  onClick={() => updateAvatar({ hairStyle: 'pigtails' })}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold border ${progress.avatar.hairStyle === 'pigtails' ? 'bg-night text-white border-night' : 'bg-white text-night border-slate-200'}`}
               >
                 Pigtails
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-night tracking-tight">{t("room.title")}</h1>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 font-bold text-ocean">
          {progress.coins} 🪙
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        {(['room', 'shop', 'avatar'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${
              activeTab === tab 
                ? "bg-white text-night shadow-sm" 
                : "text-night/50 hover:text-night/70"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === "room" && renderRoom()}
        {activeTab === "shop" && renderShop()}
        {activeTab === "avatar" && renderAvatarEditor()}
      </div>
    </div>
  );
}

