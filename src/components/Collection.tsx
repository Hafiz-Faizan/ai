import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import AIChat from './AIChat';
import { CollectionItem, CollectionStyles, WebsiteConfig } from '../types/websiteConfig';

interface CollectionProps {
  isAdmin?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onSave?: () => void;
  savedItems?: CollectionItem[] | null;
  savedStyles?: CollectionStyles | null;
  apiKey?: string;
}

function SortableCollectionItem({ 
  item, 
  isEditing, 
  isSelected, 
  onSelect,
  globalStyles,
  onImageUpload 
}: { 
  item: CollectionItem; 
  isEditing: boolean; 
  isSelected: boolean;
  onSelect: () => void;
  globalStyles: CollectionStyles;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    position: 'relative' as const,
    cursor: isEditing ? 'move' : 'pointer',
  };

  const getAnimationClass = () => {
    switch (item.styles.animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide':
        return 'animate-slide-in';
      case 'zoom':
        return 'animate-zoom-in';
      default:
        return '';
    }
  };

  const getHoverClass = () => {
    switch (item.styles.hoverEffect) {
      case 'zoom':
        return 'hover:scale-105';
      case 'fade':
        return 'hover:opacity-80';
      case 'overlay':
        return 'group';
      default:
        return '';
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
      onSelect();
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.preventDefault();
      e.stopPropagation();
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isEditing ? listeners : {})}
      className={`relative ${getAnimationClass()} ${getHoverClass()} transition-all duration-300`}
      onClick={(e) => {
        if (isEditing) {
          e.preventDefault();
          e.stopPropagation();
          onSelect();
        }
      }}
    >
      <Link 
        href={item.link} 
        className="block relative" 
        onClick={e => {
          if (isEditing) {
            e.preventDefault();
            e.stopPropagation();
            onSelect();
          }
        }}
        tabIndex={isEditing ? -1 : 0}
      >
        <div 
          className="relative overflow-hidden"
          style={{
            height: item.styles.height,
            borderRadius: item.styles.borderRadius,
          }}
        >
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            style={{ 
              objectFit: item.styles.objectFit || 'cover',
              filter: item.styles.imageFilter || 'none',
            }}
            onClick={handleImageClick}
          />
          <div 
            className="absolute inset-0"
            style={{
              backgroundColor: item.styles.imageOverlay,
              opacity: parseFloat(item.styles.overlayOpacity),
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h3
              style={{
                color: item.styles.color,
                fontSize: item.styles.fontSize,
                fontFamily: item.styles.fontFamily,
                fontWeight: item.styles.fontWeight,
                textTransform: item.styles.textTransform as any,
                letterSpacing: item.styles.letterSpacing,
                textAlign: item.styles.textAlign as any,
              }}
            >
              {item.title}
            </h3>
          </div>
        </div>
      </Link>
      {isSelected && isEditing && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full" />
      )}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => onImageUpload(e, item.id)}
        title="Upload image"
        aria-label="Upload image"
      />
    </div>
  );
}

export default function Collection({
  isAdmin = false,
  isEditing = false,
  onStartEdit,
  onSave,
  savedItems = null,
  savedStyles = null,
  apiKey
}: CollectionProps) {
  const [collectionItems, setCollectionItems] = useState<CollectionItem[]>(savedItems || [
    {
      id: 'col1',
      type: 'collection',
      title: "EDITOR'S PICK",
      imageUrl: "/dress.jpg",
      link: "/collections/editors-pick",
      position: "left",
      styles: {
        color: "#FFFFFF",
        fontSize: "24px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "2px",
        textAlign: "center",
        imageOverlay: "rgba(0,0,0,0.2)",
        overlayOpacity: "0.4",
        objectFit: "cover",
        height: "400px",
        borderRadius: "8px",
        hoverEffect: "zoom",
        animation: "fade",
        animationDuration: "0.5s",
        animationDelay: "0s",
        fontFamily: "",
        imageFilter: "",
        backgroundColor: "",
        padding: "",
        margin: "",
        width: "",
        boxShadow: "",
      }
    },
    {
      id: 'col1',
      type: 'collection',
      title: "SHOES",
      imageUrl: "/shoes.jpg",
      link: "/collections/editors-pick",
      position: "left",
      styles: {
        color: "#FFFFFF",
        fontSize: "24px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "2px",
        textAlign: "center",
        imageOverlay: "rgba(0,0,0,0.2)",
        overlayOpacity: "0.4",
        objectFit: "cover",
        height: "400px",
        borderRadius: "8px",
        hoverEffect: "zoom",
        animation: "fade",
        animationDuration: "0.5s",
        animationDelay: "0s",
        fontFamily: "",
        imageFilter: "",
        backgroundColor: "",
        padding: "",
        margin: "",
        width: "",
        boxShadow: "",
      }
    },
    {
      id: 'col1',
      type: 'collection',
      title: "ACCESSORIES",
      imageUrl: "/acess.jpg",
      link: "/collections/editors-pick",
      position: "left",
      styles: {
        color: "#FFFFFF",
        fontSize: "24px",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "2px",
        textAlign: "center",
        imageOverlay: "rgba(0,0,0,0.2)",
        overlayOpacity: "0.4",
        objectFit: "cover",
        height: "400px",
        borderRadius: "8px",
        hoverEffect: "zoom",
        animation: "fade",
        animationDuration: "0.5s",
        animationDelay: "0s",
        fontFamily: "",
        imageFilter: "",
        backgroundColor: "",
        padding: "",
        margin: "",
        width: "",
        boxShadow: "",
      }
    }
    // Add more default items here
  ]);

  const [collectionStyles, setCollectionStyles] = useState<CollectionStyles>(savedStyles || {
    backgroundColor: "#FFFFFF",
    backgroundType: "gradient",
    gradientStart: "#FFFFFF",
    gradientEnd: "#000000",
    gradientDirection: "to right",
    padding: "80px 0",
    gap: "24px",
    maxWidth: "1200px",
    layout: "grid",
    gridColumns: 3,
    aspectRatio: "1/1",
    containerPadding: "0 24px",
    sectionTitle: {
      text: "Shop By Category",
      color: "#000000",
      fontSize: "32px",
      fontWeight: "600",
      textAlign: "center",
      margin: "0 0 48px 0",
      fontFamily: "",
    }
  });

  useEffect(() => {
    if (savedItems) setCollectionItems(savedItems);
    if (savedStyles) {
      // If we have a backgroundColor but no gradient, create a gradient from it
      if (savedStyles.backgroundColor && !savedStyles.backgroundType) {
        const color = savedStyles.backgroundColor;
        // Create a lighter version for gradient start
        const lighterColor = adjustColor(color, 20);
        // Create a darker version for gradient end
        const darkerColor = adjustColor(color, -20);
        
        setCollectionStyles({
          ...savedStyles,
          backgroundType: 'gradient',
          gradientStart: lighterColor,
          gradientEnd: darkerColor,
          gradientDirection: 'to right'
        });
      } else {
        setCollectionStyles(savedStyles);
      }
    }
  }, [savedItems, savedStyles]);

  // Helper function to adjust color brightness
  const adjustColor = (color: string, percent: number) => {
    // Remove the hash if it exists
    color = color.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    
    // Adjust each channel
    const adjustChannel = (channel: number) => {
      const adjusted = Math.round(channel * (1 + percent / 100));
      return Math.min(255, Math.max(0, adjusted));
    };
    
    const newR = adjustChannel(r);
    const newG = adjustChannel(g);
    const newB = adjustChannel(b);
    
    // Convert back to hex
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
  };

  const updateAllItemsStyle = (styleKey: string, value: string) => {
    setCollectionItems(items =>
      items.map(item => ({
        ...item,
        styles: { ...item.styles, [styleKey]: value }
      }))
    );
  };

  const handleSave = () => {
    try {
      localStorage.setItem('collectionItems', JSON.stringify(collectionItems));
      localStorage.setItem('collectionStyles', JSON.stringify(collectionStyles));
      if (onSave) onSave();
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = collectionItems.findIndex(item => item.id === active.id);
      const newIndex = collectionItems.findIndex(item => item.id === over.id);
      
      const newItems = [...collectionItems];
      const [movedItem] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, movedItem);
      
      setCollectionItems(newItems);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // In a real application, you would upload to a server
      // For now, we'll use a local URL
      const imageUrl = URL.createObjectURL(file);
      
      setCollectionItems(items =>
        items.map(item =>
          item.id === itemId
            ? { ...item, imageUrl }
            : item
        )
      );
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleAIConfigUpdate = (newConfig: WebsiteConfig) => {
    if (newConfig.collectionConfig) {
      if (newConfig.collectionConfig.items) {
        setCollectionItems(newConfig.collectionConfig.items);
      }
      if (newConfig.collectionConfig.styles) {
        setCollectionStyles(newConfig.collectionConfig.styles);
      }
    }
  };

  const getGridStyle = () => {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${collectionStyles.gridColumns}, 1fr)`,
      gap: collectionStyles.gap,
      maxWidth: collectionStyles.maxWidth,
      padding: collectionStyles.containerPadding,
      margin: '0 auto',
    };
  };

  const updateGlobalStyle = (styleKey: string, value: string) => {
    setCollectionStyles(styles => ({
      ...styles,
      [styleKey]: value
    }));
  };

  return (
    <section
      style={{
        backgroundColor: collectionStyles.backgroundType === 'color' ? collectionStyles.backgroundColor : undefined,
        backgroundImage: collectionStyles.backgroundType === 'gradient' 
          ? `linear-gradient(${collectionStyles.gradientDirection || 'to right'}, ${collectionStyles.gradientStart || '#FFFFFF'}, ${collectionStyles.gradientEnd || '#000000'})`
          : collectionStyles.backgroundType === 'image' 
            ? `url(${collectionStyles.backgroundImage})`
            : undefined,
        backgroundSize: collectionStyles.backgroundSize,
        backgroundPosition: collectionStyles.backgroundPosition,
        padding: collectionStyles.padding,
      }}
      className={`${isAdmin && !isEditing ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all' : ''}`}
      onClick={() => isAdmin && !isEditing && onStartEdit?.()}
      role={isAdmin && !isEditing ? "button" : "region"}
      tabIndex={isAdmin && !isEditing ? 0 : undefined}
      onKeyPress={(e) => isAdmin && !isEditing && e.key === 'Enter' && onStartEdit?.()}
      aria-label={isAdmin && !isEditing ? "Click to edit collection section" : "Collection section"}
    >
      <div className="container mx-auto">
        {collectionStyles.sectionTitle.text && (
          <h2
            style={{
              color: collectionStyles.sectionTitle.color,
              fontSize: collectionStyles.sectionTitle.fontSize,
              fontFamily: collectionStyles.sectionTitle.fontFamily,
              fontWeight: collectionStyles.sectionTitle.fontWeight,
              textAlign: collectionStyles.sectionTitle.textAlign as any,
              margin: collectionStyles.sectionTitle.margin,
            }}
          >
            {collectionStyles.sectionTitle.text}
          </h2>
        )}

        <DndContext onDragEnd={handleDragEnd}>
          <div style={getGridStyle()}>
            <SortableContext items={collectionItems.map(item => item.id)}>
              {collectionItems.map((item) => (
                <SortableCollectionItem
                  key={item.id}
                  item={item}
                  isEditing={isEditing}
                  isSelected={false}
                  onSelect={() => {}}
                  globalStyles={collectionStyles}
                  onImageUpload={handleImageUpload}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>

        {isAdmin && !isEditing && (
          <button
            onClick={onStartEdit}
            className="fixed bottom-24 right-8 z-40 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center"
            title="Edit Collection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}

        {isEditing && (
          <div className="fixed right-0 top-0 h-screen bg-gray-800 text-white shadow-lg p-6 overflow-y-auto z-50 w-80 transition-all duration-300 ease-in-out">
            <div className="sticky top-0 bg-gray-800 pb-4 z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Edit Collection</h2>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
              </div>

              {/* Global Settings */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Global Settings</h3>
                
                <div className="space-y-4">
                  {/* Background Settings */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Background Type
                    </label>
                    <select
                      value={collectionStyles.backgroundType || 'color'}
                      onChange={(e) => updateGlobalStyle('backgroundType', e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded"
                      title="Select background type"
                    >
                      <option value="color">Color</option>
                      <option value="image">Image</option>
                      <option value="gradient">Gradient</option>
                    </select>
                  </div>

                  {collectionStyles.backgroundType === 'color' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Background Color
                      </label>
                      <input
                        type="color"
                        value={collectionStyles.backgroundColor || '#FFFFFF'}
                        onChange={(e) => updateGlobalStyle('backgroundColor', e.target.value)}
                        className="w-full p-2 bg-gray-700 rounded"
                        title="Choose background color"
                      />
                    </div>
                  )}

                  {collectionStyles.backgroundType === 'image' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium mb-1">
                        Background Image
                      </label>
                      <input
                        type="text"
                        value={collectionStyles.backgroundImage || ''}
                        onChange={(e) => updateGlobalStyle('backgroundImage', e.target.value)}
                        className="w-full p-2 bg-gray-700 rounded"
                        placeholder="Enter image URL"
                        title="Background image URL"
                      />
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Background Size
                        </label>
                        <select
                          value={collectionStyles.backgroundSize || 'cover'}
                          onChange={(e) => updateGlobalStyle('backgroundSize', e.target.value)}
                          className="w-full p-2 bg-gray-700 rounded"
                          title="Select background size"
                        >
                          <option value="cover">Cover</option>
                          <option value="contain">Contain</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Background Position
                        </label>
                        <select
                          value={collectionStyles.backgroundPosition || 'center'}
                          onChange={(e) => updateGlobalStyle('backgroundPosition', e.target.value)}
                          className="w-full p-2 bg-gray-700 rounded"
                          title="Select background position"
                        >
                          <option value="center">Center</option>
                          <option value="top">Top</option>
                          <option value="bottom">Bottom</option>
                          <option value="left">Left</option>
                          <option value="right">Right</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {collectionStyles.backgroundType === 'gradient' && (
                    <div className="space-y-2">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Gradient Start Color
                        </label>
                        <input
                          type="color"
                          value={collectionStyles.gradientStart || '#FFFFFF'}
                          onChange={(e) => updateGlobalStyle('gradientStart', e.target.value)}
                          className="w-full p-2 bg-gray-700 rounded"
                          title="Choose gradient start color"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Gradient End Color
                        </label>
                        <input
                          type="color"
                          value={collectionStyles.gradientEnd || '#000000'}
                          onChange={(e) => updateGlobalStyle('gradientEnd', e.target.value)}
                          className="w-full p-2 bg-gray-700 rounded"
                          title="Choose gradient end color"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Gradient Direction
                        </label>
                        <select
                          value={collectionStyles.gradientDirection || 'to right'}
                          onChange={(e) => updateGlobalStyle('gradientDirection', e.target.value)}
                          className="w-full p-2 bg-gray-700 rounded"
                          title="Select gradient direction"
                        >
                          <option value="to right">Left to Right</option>
                          <option value="to left">Right to Left</option>
                          <option value="to bottom">Top to Bottom</option>
                          <option value="to top">Bottom to Top</option>
                          <option value="to bottom right">Diagonal ↘</option>
                          <option value="to bottom left">Diagonal ↙</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Section Title Settings */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3">Section Title</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Title Text
                        </label>
                        <input
                          type="text"
                          value={collectionStyles.sectionTitle.text || ''}
                          onChange={(e) => updateGlobalStyle('sectionTitle', { ...collectionStyles.sectionTitle, text: e.target.value })}
                          className="w-full p-2 bg-gray-700 rounded"
                          placeholder="Enter section title"
                          title="Section title text"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Title Color
                        </label>
                        <input
                          type="color"
                          value={collectionStyles.sectionTitle.color || '#000000'}
                          onChange={(e) => updateGlobalStyle('sectionTitle', { ...collectionStyles.sectionTitle, color: e.target.value })}
                          className="w-full p-2 bg-gray-700 rounded"
                          title="Choose title color"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Title Font Size
                        </label>
                        <input
                          type="text"
                          value={collectionStyles.sectionTitle.fontSize || '32px'}
                          onChange={(e) => updateGlobalStyle('sectionTitle', { ...collectionStyles.sectionTitle, fontSize: e.target.value })}
                          className="w-full p-2 bg-gray-700 rounded"
                          placeholder="e.g., 32px"
                          title="Title font size"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Title Font Weight
                        </label>
                        <select
                          value={collectionStyles.sectionTitle.fontWeight || '600'}
                          onChange={(e) => updateGlobalStyle('sectionTitle', { ...collectionStyles.sectionTitle, fontWeight: e.target.value })}
                          className="w-full p-2 bg-gray-700 rounded"
                          title="Select font weight"
                        >
                          <option value="400">Regular</option>
                          <option value="500">Medium</option>
                          <option value="600">Semi Bold</option>
                          <option value="700">Bold</option>
                          <option value="800">Extra Bold</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Layout Settings */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3">Layout Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Layout Type
                        </label>
                        <select
                          value={collectionStyles.layout || 'grid'}
                          onChange={(e) => updateGlobalStyle('layout', e.target.value)}
                          className="w-full p-2 bg-gray-700 rounded"
                          title="Select layout type"
                        >
                          <option value="grid">Grid</option>
                          <option value="flex">Flex</option>
                          <option value="masonry">Masonry</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Grid Columns
                        </label>
                        <input
                          type="number"
                          value={collectionStyles.gridColumns || 3}
                          onChange={(e) => updateGlobalStyle('gridColumns', parseInt(e.target.value))}
                          className="w-full p-2 bg-gray-700 rounded"
                          min="1"
                          max="4"
                          title="Number of columns"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Gap Between Items
                        </label>
                        <input
                          type="text"
                          value={collectionStyles.gap || '24px'}
                          onChange={(e) => updateGlobalStyle('gap', e.target.value)}
                          className="w-full p-2 bg-gray-700 rounded"
                          placeholder="e.g., 24px"
                          title="Gap between items"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Container Max Width
                        </label>
                        <input
                          type="text"
                          value={collectionStyles.maxWidth || '1200px'}
                          onChange={(e) => updateGlobalStyle('maxWidth', e.target.value)}
                          className="w-full p-2 bg-gray-700 rounded"
                          placeholder="e.g., 1200px"
                          title="Maximum width of container"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Container Padding
                        </label>
                        <input
                          type="text"
                          value={collectionStyles.containerPadding || '0 24px'}
                          onChange={(e) => updateGlobalStyle('containerPadding', e.target.value)}
                          className="w-full p-2 bg-gray-700 rounded"
                          placeholder="e.g., 0 24px"
                          title="Container padding"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item Settings (now applies to all items) */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Item Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={collectionItems[0]?.styles.color || '#FFFFFF'}
                      onChange={(e) => updateAllItemsStyle('color', e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded"
                      title="Choose text color"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Font Size
                    </label>
                    <input
                      type="text"
                      value={collectionItems[0]?.styles.fontSize || '24px'}
                      onChange={(e) => updateAllItemsStyle('fontSize', e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded"
                      placeholder="e.g., 24px"
                      title="Font size"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Font Weight
                    </label>
                    <select
                      value={collectionItems[0]?.styles.fontWeight || '600'}
                      onChange={(e) => updateAllItemsStyle('fontWeight', e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded"
                      title="Select font weight"
                    >
                      <option value="400">Regular</option>
                      <option value="500">Medium</option>
                      <option value="600">Semi Bold</option>
                      <option value="700">Bold</option>
                      <option value="800">Extra Bold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Text Transform
                    </label>
                    <select
                      value={collectionItems[0]?.styles.textTransform || 'none'}
                      onChange={(e) => updateAllItemsStyle('textTransform', e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded"
                      title="Select text transform"
                    >
                      <option value="none">None</option>
                      <option value="uppercase">Uppercase</option>
                      <option value="lowercase">Lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Letter Spacing
                    </label>
                    <input
                      type="text"
                      value={collectionItems[0]?.styles.letterSpacing || '2px'}
                      onChange={(e) => updateAllItemsStyle('letterSpacing', e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded"
                      placeholder="e.g., 2px"
                      title="Letter spacing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Text Alignment
                    </label>
                    <select
                      value={collectionItems[0]?.styles.textAlign || 'center'}
                      onChange={(e) => updateAllItemsStyle('textAlign', e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded"
                      title="Select text alignment"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  {/* Image Overlay Settings */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3">Image Overlay</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Overlay Color
                        </label>
                        <input
                          type="color"
                          value={collectionItems[0]?.styles.imageOverlay?.replace('rgba(', '').split(',')[0] || '#000000'}
                          onChange={(e) => {
                            const opacity = collectionItems[0]?.styles.overlayOpacity || '0.4';
                            const rgba = `rgba(${parseInt(e.target.value.slice(1, 3), 16)}, ${parseInt(e.target.value.slice(3, 5), 16)}, ${parseInt(e.target.value.slice(5, 7), 16)}, ${opacity})`;
                            updateAllItemsStyle('imageOverlay', rgba);
                          }}
                          className="w-full p-2 bg-gray-700 rounded"
                          title="Choose overlay color"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Overlay Opacity
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={collectionItems[0]?.styles.overlayOpacity || '0.4'}
                          onChange={(e) => {
                            const opacity = e.target.value;
                            updateAllItemsStyle('overlayOpacity', opacity);
                            // Update the imageOverlay color with new opacity
                            if (collectionItems[0]?.styles.imageOverlay) {
                              const rgba = collectionItems[0].styles.imageOverlay.replace(/[\d.]+\)$/g, `${opacity})`);
                              updateAllItemsStyle('imageOverlay', rgba);
                            }
                          }}
                          className="w-full"
                          title="Adjust overlay opacity"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image Filter Settings */}
                  <div className="mt-6">
                    <h4 className="text-md font-semibold mb-3">Image Filter</h4>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Filter Type
                      </label>
                      <select
                        value={collectionItems[0]?.styles.imageFilter || 'none'}
                        onChange={(e) => updateAllItemsStyle('imageFilter', e.target.value)}
                        className="w-full p-2 bg-gray-700 rounded"
                        title="Select image filter"
                      >
                        <option value="none">None</option>
                        <option value="grayscale(100%)">Grayscale</option>
                        <option value="sepia(100%)">Sepia</option>
                        <option value="brightness(120%)">Bright</option>
                        <option value="contrast(120%)">High Contrast</option>
                        <option value="blur(2px)">Blur</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Hover Effect
                    </label>
                    <select
                      value={collectionItems[0]?.styles.hoverEffect || 'none'}
                      onChange={(e) => updateAllItemsStyle('hoverEffect', e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded"
                      title="Select hover effect"
                    >
                      <option value="none">None</option>
                      <option value="zoom">Zoom</option>
                      <option value="fade">Fade</option>
                      <option value="overlay">Overlay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Animation
                    </label>
                    <select
                      value={collectionItems[0]?.styles.animation || 'none'}
                      onChange={(e) => updateAllItemsStyle('animation', e.target.value)}
                      className="w-full p-2 bg-gray-700 rounded"
                      title="Select animation"
                    >
                      <option value="none">None</option>
                      <option value="fade">Fade</option>
                      <option value="slide">Slide</option>
                      <option value="zoom">Zoom</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Chat */}
              {apiKey && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">AI Assistant</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Try asking:
                    <br />• "Make the background a blue gradient"
                    <br />• "Change text style to uppercase with more spacing"
                    <br />• "Add a zoom effect on hover"
                    <br />• "Make the layout more modern"
                  </p>
                  <AIChat
                    apiKey={apiKey}
                    currentConfig={{
                      collectionConfig: {
                        items: collectionItems,
                        styles: collectionStyles
                      }
                    }}
                    onConfigUpdate={handleAIConfigUpdate}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 