'use client';

import { useState, useEffect, useRef } from 'react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AIChat from './AIChat';

interface HeroItem {
  id: string;
  type: 'heading' | 'subheading' | 'button' | 'image' | 'badge' | 'paragraph';
  content: string;
  link?: string;
  position: 'left' | 'center' | 'right';
  styles: {
    color: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    backgroundColor: string;
    padding: string;
    margin: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    textAlign?: 'left' | 'center' | 'right';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing?: string;
    lineHeight?: string;
    boxShadow?: string;
    opacity?: string;
    zIndex?: string;
    position?: 'relative' | 'absolute';
    top?: string;
    left?: string;
    transform?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    maxWidth?: string;
    maxHeight?: string;
    aspectRatio?: string;
  };
  imageUrl?: string;
  animation?: 'none' | 'fade' | 'slide' | 'bounce';
}

interface HeroStyles {
  backgroundColor: string;
  backgroundImage: string;
  backgroundSize: 'cover' | 'contain' | 'auto' | 'custom';
  backgroundWidth: string;
  backgroundPosition: string;
  backgroundRepeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  backgroundOverlay: string;
  overlayOpacity: string;
  height: string;
  padding: string;
  fontFamily: string;
  color: string;
  layout: 'left-content' | 'right-content' | 'center-content' | 'full-width';
}

interface HeroProps {
  isAdmin?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onSave?: () => void;
  savedItems?: HeroItem[] | null;
  savedStyles?: HeroStyles | null;
  apiKey?: string;
}

const fontFamilies = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'system-ui',
  'Roboto',
  'Open Sans'
];

// SortableItem component
function SortableItem({ 
  item, 
  isEditing, 
  isSelected, 
  onSelect,
  globalStyles 
}: { 
  item: HeroItem; 
  isEditing: boolean; 
  isSelected: boolean;
  onSelect: () => void;
  globalStyles: HeroStyles;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const handleClick = () => {
    if (isEditing) {
      onSelect();
    } else if (item.link) {
      window.location.href = item.link;
    }
  };

  const getAnimationClass = () => {
    if (!item.animation || item.animation === 'none') return '';
    
    switch (item.animation) {
      case 'fade': return 'animate-fade-in';
      case 'slide': return 'animate-slide-in';
      case 'bounce': return 'animate-bounce';
      default: return '';
    }
  };

  const renderContent = () => {
    switch (item.type) {
      case 'heading':
        return <h1 className="m-0">{item.content}</h1>;
      case 'subheading':
        return <h2 className="m-0">{item.content}</h2>;
      case 'paragraph':
        return <p className="m-0">{item.content}</p>;
      case 'button':
        return (
          <button 
            className="transition-all duration-300 hover:transform hover:scale-105 active:scale-95"
            style={{
              cursor: isEditing ? 'move' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: item.styles.boxShadow || '0 4px 15px rgba(0, 0, 0, 0.2)',
              position: item.styles.position || 'relative',
              top: item.styles.position === 'absolute' ? item.styles.top : undefined,
              left: item.styles.position === 'absolute' ? item.styles.left : undefined,
              transition: 'all 0.3s ease',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
            }}
          >
            {item.content}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        );
      case 'badge':
        return (
          <span className="inline-block">
            {item.content}
          </span>
        );
      case 'image':
        return item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.content}
            style={{
              width: '100%',
              height: '100%',
              objectFit: item.styles.objectFit || 'cover',
              borderRadius: item.styles.borderRadius,
            }}
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-200 text-gray-500 border border-dashed border-gray-400 rounded" 
               style={{
                 width: '100%',
                 height: item.styles.height || '300px',
                 borderRadius: item.styles.borderRadius,
               }}>
            {isEditing ? (
              <div className="text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Click to upload an image</p>
              </div>
            ) : (
              <p>No image set</p>
            )}
          </div>
        );
      default:
        return item.content;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        color: item.styles.color || globalStyles.color,
        fontSize: item.styles.fontSize,
        fontFamily: item.styles.fontFamily || globalStyles.fontFamily,
        fontWeight: item.styles.fontWeight,
        backgroundColor: item.styles.backgroundColor,
        padding: item.styles.padding,
        marginTop: item.styles.marginTop,
        marginRight: item.styles.marginRight,
        marginBottom: item.styles.marginBottom,
        marginLeft: item.styles.marginLeft,
        borderRadius: item.styles.borderRadius,
        width: item.styles.width,
        height: item.styles.height,
        maxWidth: item.styles.maxWidth,
        maxHeight: item.styles.maxHeight,
        aspectRatio: item.styles.aspectRatio,
        position: item.styles.position,
        top: item.styles.position === 'absolute' ? item.styles.top : undefined,
        left: item.styles.position === 'absolute' ? item.styles.left : undefined,
        borderWidth: item.styles.borderWidth,
        borderColor: item.styles.borderColor,
        borderStyle: item.styles.borderStyle,
        textAlign: item.styles.textAlign as any,
        textTransform: item.styles.textTransform as any,
        letterSpacing: item.styles.letterSpacing,
        lineHeight: item.styles.lineHeight,
        boxShadow: item.styles.boxShadow,
        opacity: item.styles.opacity,
        zIndex: item.styles.zIndex,
      }}
      {...attributes}
      {...(isEditing ? listeners : {})}
      onClick={handleClick}
      className={`
        ${isEditing ? 'cursor-move' : item.link ? 'cursor-pointer' : ''}
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${getAnimationClass()}
      `}
    >
      {renderContent()}
    </div>
  );
}

export default function Hero({ 
  isAdmin = false, 
  isEditing = false, 
  onStartEdit, 
  onSave,
  savedItems = null,
  savedStyles = null,
  apiKey
}: HeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hero items state
  const [heroItems, setHeroItems] = useState<HeroItem[]>(savedItems || [
    {
      id: 'heading1',
      type: 'heading',
      content: 'Summer Collection 2023',
      position: 'left',
      styles: {
        color: '#ffffff',
        fontSize: '48px',
        fontFamily: 'Helvetica',
        fontWeight: '700',
        backgroundColor: 'transparent',
        padding: '0',
        margin: '0 0 1rem 0',
        textAlign: 'left',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        lineHeight: '1.2',
      }
    },
    {
      id: 'subheading1',
      type: 'subheading',
      content: 'Discover the latest trends and styles',
      position: 'left',
      styles: {
        color: '#ffffff',
        fontSize: '24px',
        fontFamily: '',
        fontWeight: '400',
        backgroundColor: 'transparent',
        padding: '0',
        margin: '0 0 2rem 0',
        textAlign: 'left',
      }
    },
    {
      id: 'button1',
      type: 'button',
      content: 'Shop Now',
      link: '/shop',
      position: 'left',
      styles: {
        color: '#ffffff',
        fontSize: '16px',
        fontFamily: '',
        fontWeight: '600',
        backgroundColor: '#ff4500',
        padding: '0.75rem 2rem',
        margin: '0',
        borderRadius: '4px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }
    },
    {
      id: 'badge1',
      type: 'badge',
      content: 'New Arrivals',
      position: 'left',
      styles: {
        color: '#ffffff',
        fontSize: '14px',
        fontFamily: '',
        fontWeight: '600',
        backgroundColor: '#ff4500',
        padding: '0.25rem 1rem',
        margin: '0 0 1rem 0',
        borderRadius: '20px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [heroStyles, setHeroStyles] = useState<HeroStyles>(savedStyles || {
    backgroundColor: '#1a1a1a',
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundWidth: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundOverlay: '#000000',
    overlayOpacity: '0.5',
    height: '500px',
    padding: '2rem',
    fontFamily: 'Helvetica',
    color: '#ffffff',
    layout: 'left-content'
  });

  // Load saved settings only if not provided through props
  useEffect(() => {
    if (!savedItems && !savedStyles) {
      const savedHeroItems = localStorage.getItem('heroItems');
      const savedHeroStyles = localStorage.getItem('heroStyles');
      
      if (savedHeroItems) setHeroItems(JSON.parse(savedHeroItems));
      if (savedHeroStyles) setHeroStyles(JSON.parse(savedHeroStyles));
    }
  }, [savedItems, savedStyles]);

  // Save settings
  const handleSave = () => {
    localStorage.setItem('heroItems', JSON.stringify(heroItems));
    localStorage.setItem('heroStyles', JSON.stringify(heroStyles));
    setSelectedItem(null);
    onSave?.();
  };

  // Add new item
  const addNewItem = (type: 'heading' | 'subheading' | 'button' | 'image' | 'badge' | 'paragraph', position: 'left' | 'center' | 'right' = 'left') => {
    const newId = `${type}${heroItems.length + 1}`;
    
    let newItem: HeroItem = {
      id: newId,
      type,
      content: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      position,
      styles: {
        color: type === 'button' ? '#ffffff' : '',
        fontSize: type === 'heading' ? '36px' : type === 'subheading' ? '24px' : '16px',
        fontFamily: '',
        fontWeight: type === 'heading' ? '700' : type === 'subheading' ? '600' : '400',
        backgroundColor: type === 'button' ? '#2563eb' : 'transparent',
        padding: type === 'button' ? '1rem 2rem' : '0',
        margin: '0 0 1rem 0',
        textAlign: 'left',
        textTransform: type === 'button' ? 'uppercase' : 'none',
        letterSpacing: type === 'button' ? '1px' : '0',
        lineHeight: '1.2',
        opacity: '1',
        zIndex: '1',
        position: 'relative',
        top: '0',
        left: '0'
      }
    };

    // Add specific styles based on type
    switch (type) {
      case 'button':
        newItem.link = '/shop';
        newItem.styles = {
          ...newItem.styles,
          borderRadius: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          fontWeight: '600',
          backgroundColor: 'rgba(37, 99, 235, 0.9)',
          color: '#ffffff',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '1rem 2rem',
          position: 'relative',
          zIndex: '10'
        };
        break;
      case 'badge':
        newItem.styles = {
          ...newItem.styles,
          backgroundColor: '#ff4500',
          color: '#ffffff',
          padding: '0.25rem 1rem',
          borderRadius: '20px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontSize: '14px',
          fontWeight: '600'
        };
        break;
      case 'image':
        newItem = {
          ...newItem,
          imageUrl: '',
          styles: {
            ...newItem.styles,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '8px',
            borderWidth: '0',
            borderColor: '#000000',
            borderStyle: 'solid',
            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
          }
        };
        break;
      case 'heading':
        newItem.styles = {
          ...newItem.styles,
          fontWeight: '700',
          letterSpacing: '1px',
          lineHeight: '1.2',
          textTransform: 'uppercase'
        };
        break;
    }

    setHeroItems([...heroItems, newItem]);
    setSelectedItem(newId);
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId?: string | null) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create a blob URL for the uploaded file
    const imageUrl = URL.createObjectURL(file);

    if (itemId) {
      // Clean up old blob URL if it exists
      const oldItem = heroItems.find(item => item.id === itemId);
      if (oldItem?.imageUrl && oldItem.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(oldItem.imageUrl);
      }
      
      // Update item image
      setHeroItems(items =>
        items.map(item =>
          item.id === itemId
            ? { 
                ...item, 
                imageUrl,
                styles: {
                  ...item.styles,
                  width: item.styles.width || '100%',
                  height: item.styles.height || '300px',
                  objectFit: item.styles.objectFit || 'cover',
                }
              }
            : item
        )
      );
    } else {
      // Clean up old background image if it's a blob URL
      if (heroStyles.backgroundImage.startsWith('blob:')) {
        URL.revokeObjectURL(heroStyles.backgroundImage);
      }
      // Update background image
      setHeroStyles({...heroStyles, backgroundImage: imageUrl});
    }

    // Reset the file input
    if (event.target) {
      event.target.value = '';
    }
  };

  // Update item position
  const updateItemPosition = (itemId: string, position: 'left' | 'center' | 'right') => {
    setHeroItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, position }
          : item
      )
    );
  };

  // DND sensors configuration
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setHeroItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Update individual item style
  const updateItemStyle = (itemId: string, styleKey: string, value: string) => {
    setHeroItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, styles: { ...item.styles, [styleKey]: value } }
          : item
      )
    );
  };

  // Update item text
  const updateItemText = (itemId: string, field: 'content' | 'link', value: string) => {
    setHeroItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  // Delete item
  const deleteItem = (itemId: string) => {
    const item = heroItems.find(item => item.id === itemId);
    if (item?.imageUrl && item.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(item.imageUrl);
    }
    setHeroItems(items => items.filter(item => item.id !== itemId));
    setSelectedItem(null);
  };

  // Get background style
  const getBackgroundStyle = () => {
    return {
      backgroundColor: heroStyles.backgroundColor,
      backgroundImage: heroStyles.backgroundImage ? `url(${heroStyles.backgroundImage})` : 'none',
      backgroundSize: heroStyles.backgroundSize === 'custom' ? heroStyles.backgroundWidth : heroStyles.backgroundSize,
      backgroundPosition: heroStyles.backgroundPosition || 'center',
      backgroundRepeat: heroStyles.backgroundRepeat || 'no-repeat',
      position: 'relative' as const,
      height: heroStyles.height,
      padding: heroStyles.padding,
      color: heroStyles.color,
      fontFamily: heroStyles.fontFamily,
    };
  };

  // Get overlay style
  const getOverlayStyle = () => {
    return {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: heroStyles.backgroundOverlay,
      opacity: parseFloat(heroStyles.overlayOpacity),
      zIndex: 1,
    };
  };

  // Get content container style based on layout
  const getContentContainerStyle = () => {
    switch (heroStyles.layout) {
      case 'left-content':
        return 'grid-cols-1 md:grid-cols-2 md:gap-8';
      case 'right-content':
        return 'grid-cols-1 md:grid-cols-2 md:gap-8 flex-row-reverse';
      case 'center-content':
        return 'grid-cols-1 text-center';
      case 'full-width':
        return 'grid-cols-1';
      default:
        return 'grid-cols-1 md:grid-cols-2 md:gap-8';
    }
  };

  // Add this function to handle AI config updates
  const handleAIConfigUpdate = (newConfig: any) => {
    if (newConfig.heroConfig) {
      setHeroItems(newConfig.heroConfig.items);
      setHeroStyles(newConfig.heroConfig.styles);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, selectedItem)}
        aria-label="Upload image"
        title="Upload image"
      />
      
      {/* Hero Section */}
      <section 
        style={getBackgroundStyle()}
        className={`relative ${isAdmin && !isEditing ? 'hover:ring-2 hover:ring-blue-500 cursor-pointer' : ''} 
          ${isEditing ? 'mr-80' : ''} transition-all duration-300`}
        onClick={() => {
          if (isAdmin && !isEditing && onStartEdit) {
            onStartEdit();
          }
        }}
      >
        {/* Background Overlay */}
        <div style={getOverlayStyle()}></div>
        
        {/* Content Container */}
        <div className="container mx-auto relative z-10 h-full flex items-center">
          <div className={`grid ${getContentContainerStyle()} w-full`}>
            {/* Left/Center Content */}
            <div className="flex flex-col justify-center">
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <SortableContext items={heroItems.filter(item => item.position === 'left')} strategy={horizontalListSortingStrategy}>
                  <div className="flex flex-col gap-2">
                    {heroItems
                      .filter(item => item.position === 'left')
                      .map(item => (
                        <SortableItem
                          key={item.id}
                          item={item}
                          isEditing={isEditing}
                          isSelected={selectedItem === item.id}
                          onSelect={() => setSelectedItem(item.id)}
                          globalStyles={heroStyles}
                        />
                      ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
            
            {/* Right Content (if using 2-column layout) */}
            {(heroStyles.layout === 'left-content' || heroStyles.layout === 'right-content') && (
              <div className="flex flex-col justify-center">
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                  <SortableContext items={heroItems.filter(item => item.position === 'right')} strategy={horizontalListSortingStrategy}>
                    <div className="flex flex-col gap-2">
                      {heroItems
                        .filter(item => item.position === 'right')
                        .map(item => (
                          <SortableItem
                            key={item.id}
                            item={item}
                            isEditing={isEditing}
                            isSelected={selectedItem === item.id}
                            onSelect={() => setSelectedItem(item.id)}
                            globalStyles={heroStyles}
                          />
                        ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
            
            {/* Center Content */}
            {heroStyles.layout === 'center-content' && (
              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <SortableContext items={heroItems.filter(item => item.position === 'center')} strategy={horizontalListSortingStrategy}>
                  <div className="flex flex-col items-center gap-2">
                    {heroItems
                      .filter(item => item.position === 'center')
                      .map(item => (
                        <SortableItem
                          key={item.id}
                          item={item}
                          isEditing={isEditing}
                          isSelected={selectedItem === item.id}
                          onSelect={() => setSelectedItem(item.id)}
                          globalStyles={heroStyles}
                        />
                      ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </section>

      {/* Customization Sidebar */}
      {isEditing && (
        <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 text-white shadow-lg p-6 overflow-y-auto z-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Customize Hero</h2>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Save
            </button>
          </div>

          {/* Add New Item Buttons */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Add New Item</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addNewItem('heading')}
                className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600"
              >
                Add Heading
              </button>
              <button
                onClick={() => addNewItem('subheading')}
                className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600"
              >
                Add Subheading
              </button>
              <button
                onClick={() => addNewItem('paragraph')}
                className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600"
              >
                Add Paragraph
              </button>
              <button
                onClick={() => addNewItem('button')}
                className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600"
              >
                Add Button
              </button>
              <button
                onClick={() => addNewItem('badge')}
                className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600"
              >
                Add Badge
              </button>
              <button
                onClick={() => addNewItem('image')}
                className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600"
              >
                Add Image
              </button>
            </div>
          </div>

          {selectedItem && (
            <div className="mb-8 border-t border-gray-600 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-blue-400">
                  Item Settings
                </h3>
                <button
                  onClick={() => deleteItem(selectedItem)}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  title="Delete item"
                  aria-label="Delete item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Text and Link Settings */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Content
                </label>
                <input
                  type="text"
                  value={heroItems.find(item => item.id === selectedItem)?.content || ''}
                  onChange={(e) => updateItemText(selectedItem, 'content', e.target.value)}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  aria-label="Item content"
                  title="Enter item content"
                />
              </div>

              {heroItems.find(item => item.id === selectedItem)?.type === 'button' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={heroItems.find(item => item.id === selectedItem)?.link || ''}
                    onChange={(e) => updateItemText(selectedItem, 'link', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    placeholder="e.g., /shop, /products"
                    aria-label="Button link"
                    title="Enter button link URL"
                  />
                </div>
              )}

              {/* Position Settings */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Position
                </label>
                <select
                  value={heroItems.find(item => item.id === selectedItem)?.position}
                  onChange={(e) => updateItemPosition(selectedItem, e.target.value as 'left' | 'center' | 'right')}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  aria-label="Item position"
                  title="Select item position"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>

              {/* Animation Settings */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Animation
                </label>
                <select
                  value={heroItems.find(item => item.id === selectedItem)?.animation || 'none'}
                  onChange={(e) => {
                    const item = heroItems.find(item => item.id === selectedItem);
                    if (item) {
                      setHeroItems(items =>
                        items.map(i =>
                          i.id === selectedItem
                            ? { ...i, animation: e.target.value as 'none' | 'fade' | 'slide' | 'bounce' }
                            : i
                        )
                      );
                    }
                  }}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  aria-label="Animation"
                  title="Select animation effect"
                >
                  <option value="none">None</option>
                  <option value="fade">Fade In</option>
                  <option value="slide">Slide In</option>
                  <option value="bounce">Bounce</option>
                </select>
              </div>

              {/* Image Settings */}
              {heroItems.find(item => item.id === selectedItem)?.type === 'image' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Upload Image
                    </label>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600 w-full flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      Choose Image
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Object Fit
                    </label>
                    <select
                      value={heroItems.find(item => item.id === selectedItem)?.styles.objectFit || 'cover'}
                      onChange={(e) => updateItemStyle(selectedItem, 'objectFit', e.target.value)}
                      className="w-full p-2 border rounded bg-gray-700 text-white"
                      aria-label="Object fit"
                      title="Select object fit"
                    >
                      <option value="contain">Contain</option>
                      <option value="cover">Cover</option>
                      <option value="fill">Fill</option>
                      <option value="none">None</option>
                      <option value="scale-down">Scale Down</option>
                    </select>
                  </div>

                  <div className="mb-6 border-b border-gray-600 pb-4">
                    <h4 className="text-sm font-medium text-blue-400 mb-3">Image Size Controls</h4>
                    
                    {/* Width Controls */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Width
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.width?.replace('%', '') || '100')}
                          onChange={(e) => updateItemStyle(selectedItem, 'width', `${e.target.value}%`)}
                          className="flex-1"
                          aria-label="Width percentage"
                          title="Adjust width percentage"
                        />
                        <input
                          type="number"
                          value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.width?.replace('%', '') || '100')}
                          onChange={(e) => updateItemStyle(selectedItem, 'width', `${e.target.value}%`)}
                          className="w-16 p-1 bg-gray-700 border border-gray-600 rounded text-center"
                          min="10"
                          max="100"
                          aria-label="Width percentage"
                          title="Enter width percentage"
                        />
                        <span className="text-sm text-gray-400">%</span>
                      </div>
                    </div>

                    {/* Height Controls */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Height
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="range"
                          min="50"
                          max="800"
                          value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.height?.replace('px', '') || '300')}
                          onChange={(e) => updateItemStyle(selectedItem, 'height', `${e.target.value}px`)}
                          className="flex-1"
                          aria-label="Height pixels"
                          title="Adjust height in pixels"
                        />
                        <input
                          type="number"
                          value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.height?.replace('px', '') || '300')}
                          onChange={(e) => updateItemStyle(selectedItem, 'height', `${e.target.value}px`)}
                          className="w-16 p-1 bg-gray-700 border border-gray-600 rounded text-center"
                          min="50"
                          max="800"
                          aria-label="Height pixels"
                          title="Enter height in pixels"
                        />
                        <span className="text-sm text-gray-400">px</span>
                      </div>
                    </div>

                    {/* Aspect Ratio Control */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Maintain Aspect Ratio
                      </label>
                      <select
                        value={heroItems.find(item => item.id === selectedItem)?.styles.aspectRatio || 'auto'}
                        onChange={(e) => updateItemStyle(selectedItem, 'aspectRatio', e.target.value)}
                        className="w-full p-2 border rounded bg-gray-700 text-white"
                        aria-label="Aspect ratio"
                        title="Select aspect ratio"
                      >
                        <option value="auto">Auto</option>
                        <option value="1/1">Square (1:1)</option>
                        <option value="16/9">Landscape (16:9)</option>
                        <option value="4/3">Classic (4:3)</option>
                        <option value="3/4">Portrait (3:4)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-6 border-b border-gray-600 pb-4">
                    <h4 className="text-sm font-medium text-blue-400 mb-3">Margin Controls</h4>
                    
                    {/* Margin Controls */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Top Margin
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.marginTop?.replace('px', '') || '0')}
                            onChange={(e) => updateItemStyle(selectedItem, 'marginTop', `${e.target.value}px`)}
                            className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                            aria-label="Top margin"
                            title="Enter top margin in pixels"
                          />
                          <span className="text-sm text-gray-400">px</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Right Margin
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.marginRight?.replace('px', '') || '0')}
                            onChange={(e) => updateItemStyle(selectedItem, 'marginRight', `${e.target.value}px`)}
                            className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                            aria-label="Right margin"
                            title="Enter right margin in pixels"
                          />
                          <span className="text-sm text-gray-400">px</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Bottom Margin
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.marginBottom?.replace('px', '') || '0')}
                            onChange={(e) => updateItemStyle(selectedItem, 'marginBottom', `${e.target.value}px`)}
                            className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                            aria-label="Bottom margin"
                            title="Enter bottom margin in pixels"
                          />
                          <span className="text-sm text-gray-400">px</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-300">
                          Left Margin
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.marginLeft?.replace('px', '') || '0')}
                            onChange={(e) => updateItemStyle(selectedItem, 'marginLeft', `${e.target.value}px`)}
                            className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                            aria-label="Left margin"
                            title="Enter left margin in pixels"
                          />
                          <span className="text-sm text-gray-400">px</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Position Controls */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-blue-400 mb-3">Position Controls</h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Position Type
                      </label>
                      <select
                        value={heroItems.find(item => item.id === selectedItem)?.styles.position || 'relative'}
                        onChange={(e) => updateItemStyle(selectedItem, 'position', e.target.value)}
                        className="w-full p-2 border rounded bg-gray-700 text-white"
                        aria-label="Position type"
                        title="Select position type"
                      >
                        <option value="relative">Default (Relative)</option>
                        <option value="absolute">Free Position (Absolute)</option>
                      </select>
                    </div>

                    {heroItems.find(item => item.id === selectedItem)?.styles.position === 'absolute' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">
                            Top Position
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.top?.replace('%', '') || '0')}
                              onChange={(e) => updateItemStyle(selectedItem, 'top', `${e.target.value}%`)}
                              className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                              aria-label="Top position"
                              title="Enter top position percentage"
                            />
                            <span className="text-sm text-gray-400">%</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-300">
                            Left Position
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="number"
                              value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.left?.replace('%', '') || '0')}
                              onChange={(e) => updateItemStyle(selectedItem, 'left', `${e.target.value}%`)}
                              className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                              aria-label="Left position"
                              title="Enter left position percentage"
                            />
                            <span className="text-sm text-gray-400">%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Style Settings for all items */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Text Color
                </label>
                <input
                  type="color"
                  value={heroItems.find(item => item.id === selectedItem)?.styles.color || heroStyles.color}
                  onChange={(e) => updateItemStyle(selectedItem, 'color', e.target.value)}
                  className="w-full h-10 rounded border"
                  aria-label="Text color"
                  title="Select text color"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Background Color
                </label>
                <input
                  type="color"
                  value={heroItems.find(item => item.id === selectedItem)?.styles.backgroundColor || 'transparent'}
                  onChange={(e) => updateItemStyle(selectedItem, 'backgroundColor', e.target.value)}
                  className="w-full h-10 rounded border"
                  aria-label="Background color"
                  title="Select background color"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Font Size
                </label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={parseInt(heroItems.find(item => item.id === selectedItem)?.styles.fontSize || '16')}
                  onChange={(e) => updateItemStyle(selectedItem, 'fontSize', `${e.target.value}px`)}
                  className="w-full"
                  aria-label="Font size"
                  title="Adjust font size"
                />
                <span className="text-sm text-gray-400">
                  {heroItems.find(item => item.id === selectedItem)?.styles.fontSize}
                </span>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Font Weight
                </label>
                <select
                  value={heroItems.find(item => item.id === selectedItem)?.styles.fontWeight || '400'}
                  onChange={(e) => updateItemStyle(selectedItem, 'fontWeight', e.target.value)}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  aria-label="Font weight"
                  title="Select font weight"
                >
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi Bold</option>
                  <option value="700">Bold</option>
                  <option value="800">Extra Bold</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Font Family
                </label>
                <select
                  value={heroItems.find(item => item.id === selectedItem)?.styles.fontFamily || heroStyles.fontFamily}
                  onChange={(e) => updateItemStyle(selectedItem, 'fontFamily', e.target.value)}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  aria-label="Font family"
                  title="Select font family"
                >
                  <option value="">Use Global Font</option>
                  {fontFamilies.map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              {heroItems.find(item => item.id === selectedItem)?.type !== 'image' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Text Align
                    </label>
                    <select
                      value={heroItems.find(item => item.id === selectedItem)?.styles.textAlign || 'left'}
                      onChange={(e) => updateItemStyle(selectedItem, 'textAlign', e.target.value)}
                      className="w-full p-2 border rounded bg-gray-700 text-white"
                      aria-label="Text align"
                      title="Select text alignment"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Text Transform
                    </label>
                    <select
                      value={heroItems.find(item => item.id === selectedItem)?.styles.textTransform || 'none'}
                      onChange={(e) => updateItemStyle(selectedItem, 'textTransform', e.target.value)}
                      className="w-full p-2 border rounded bg-gray-700 text-white"
                      aria-label="Text transform"
                      title="Select text transformation"
                    >
                      <option value="none">None</option>
                      <option value="uppercase">UPPERCASE</option>
                      <option value="lowercase">lowercase</option>
                      <option value="capitalize">Capitalize</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Letter Spacing
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={parseFloat(heroItems.find(item => item.id === selectedItem)?.styles.letterSpacing || '0')}
                      onChange={(e) => updateItemStyle(selectedItem, 'letterSpacing', `${e.target.value}px`)}
                      className="w-full"
                      aria-label="Letter spacing"
                      title="Adjust letter spacing"
                    />
                    <span className="text-sm text-gray-400">
                      {heroItems.find(item => item.id === selectedItem)?.styles.letterSpacing || '0px'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Line Height
                    </label>
                    <input
                      type="range"
                      min="0.8"
                      max="2"
                      step="0.1"
                      value={parseFloat(heroItems.find(item => item.id === selectedItem)?.styles.lineHeight || '1.2')}
                      onChange={(e) => updateItemStyle(selectedItem, 'lineHeight', e.target.value)}
                      className="w-full"
                      aria-label="Line height"
                      title="Adjust line height"
                    />
                    <span className="text-sm text-gray-400">
                      {heroItems.find(item => item.id === selectedItem)?.styles.lineHeight || '1.2'}
                    </span>
                  </div>
                </>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Padding
                </label>
                <input
                  type="text"
                  value={heroItems.find(item => item.id === selectedItem)?.styles.padding || '0'}
                  onChange={(e) => updateItemStyle(selectedItem, 'padding', e.target.value)}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  placeholder="e.g., 1rem or 10px 20px"
                  aria-label="Padding"
                  title="Enter padding value"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Margin
                </label>
                <input
                  type="text"
                  value={heroItems.find(item => item.id === selectedItem)?.styles.margin || '0'}
                  onChange={(e) => updateItemStyle(selectedItem, 'margin', e.target.value)}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  placeholder="e.g., 1rem or 10px 20px"
                  aria-label="Margin"
                  title="Enter margin value"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Opacity
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={parseFloat(heroItems.find(item => item.id === selectedItem)?.styles.opacity || '1')}
                  onChange={(e) => updateItemStyle(selectedItem, 'opacity', e.target.value)}
                  className="w-full"
                  aria-label="Opacity"
                  title="Adjust opacity"
                />
                <span className="text-sm text-gray-400">
                  {heroItems.find(item => item.id === selectedItem)?.styles.opacity || '1'}
                </span>
              </div>
            </div>
          )}

          {/* Global Hero Settings */}
          <div className="border-t border-gray-600 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Global Settings</h3>
            
            {/* Layout */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Layout
              </label>
              <select
                value={heroStyles.layout}
                onChange={(e) => setHeroStyles({...heroStyles, layout: e.target.value as any})}
                className="w-full p-2 border rounded bg-gray-700 text-white"
                aria-label="Layout"
                title="Select layout"
              >
                <option value="left-content">Content Left</option>
                <option value="right-content">Content Right</option>
                <option value="center-content">Content Center</option>
                <option value="full-width">Full Width</option>
              </select>
            </div>
            
            {/* Background Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Background Color
              </label>
              <input
                type="color"
                value={heroStyles.backgroundColor}
                onChange={(e) => setHeroStyles({...heroStyles, backgroundColor: e.target.value})}
                className="w-full h-10 rounded border"
                aria-label="Background color"
                title="Select background color"
              />
            </div>

            {/* Background Image */}
            <div className="mb-6 border-b border-gray-600 pb-4">
              <h4 className="text-sm font-medium text-blue-400 mb-3">Background Image Settings</h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Background Image
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 px-3 py-2 bg-blue-500 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Choose Image
                  </button>
                  {heroStyles.backgroundImage && (
                    <button
                      onClick={() => setHeroStyles({...heroStyles, backgroundImage: ''})}
                      className="px-3 py-2 bg-red-500 rounded hover:bg-red-600"
                      title="Remove background image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Background Size
                </label>
                <select
                  value={heroStyles.backgroundSize || 'cover'}
                  onChange={(e) => setHeroStyles({...heroStyles, backgroundSize: e.target.value as 'cover' | 'contain' | 'auto' | 'custom'})}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  aria-label="Background size"
                  title="Select background size"
                >
                  <option value="cover">Cover (Full Width)</option>
                  <option value="contain">Contain</option>
                  <option value="auto">Auto</option>
                  <option value="custom">Custom Width</option>
                </select>
              </div>

              {heroStyles.backgroundSize === 'custom' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Custom Width
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min="10"
                      max="200"
                      value={parseInt(heroStyles.backgroundWidth)}
                      onChange={(e) => setHeroStyles({...heroStyles, backgroundWidth: `${e.target.value}%`})}
                      className="flex-1"
                      aria-label="Background width"
                      title="Adjust background width"
                    />
                    <input
                      type="number"
                      value={parseInt(heroStyles.backgroundWidth)}
                      onChange={(e) => setHeroStyles({...heroStyles, backgroundWidth: `${e.target.value}%`})}
                      className="w-16 p-1 bg-gray-700 border border-gray-600 rounded text-center"
                      min="10"
                      max="200"
                      aria-label="Background width"
                      title="Enter background width"
                    />
                    <span className="text-sm text-gray-400">%</span>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Background Position
                </label>
                <select
                  value={heroStyles.backgroundPosition || 'center'}
                  onChange={(e) => setHeroStyles({...heroStyles, backgroundPosition: e.target.value})}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  aria-label="Background position"
                  title="Select background position"
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="top left">Top Left</option>
                  <option value="top right">Top Right</option>
                  <option value="bottom left">Bottom Left</option>
                  <option value="bottom right">Bottom Right</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Background Repeat
                </label>
                <select
                  value={heroStyles.backgroundRepeat || 'no-repeat'}
                  onChange={(e) => setHeroStyles({...heroStyles, backgroundRepeat: e.target.value as 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y'})}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                  aria-label="Background repeat"
                  title="Select background repeat"
                >
                  <option value="no-repeat">No Repeat</option>
                  <option value="repeat">Repeat</option>
                  <option value="repeat-x">Repeat Horizontally</option>
                  <option value="repeat-y">Repeat Vertically</option>
                </select>
              </div>
            </div>

            {/* Overlay Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Overlay Color
              </label>
              <input
                type="color"
                value={heroStyles.backgroundOverlay}
                onChange={(e) => setHeroStyles({...heroStyles, backgroundOverlay: e.target.value})}
                className="w-full h-10 rounded border"
                aria-label="Overlay color"
                title="Select overlay color"
              />
            </div>

            {/* Overlay Opacity */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Overlay Opacity
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={parseFloat(heroStyles.overlayOpacity)}
                onChange={(e) => setHeroStyles({...heroStyles, overlayOpacity: e.target.value})}
                className="w-full"
                aria-label="Overlay opacity"
                title="Adjust overlay opacity"
              />
              <span className="text-sm text-gray-400">{heroStyles.overlayOpacity}</span>
            </div>

            {/* Height */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Height
              </label>
              <input
                type="range"
                min="300"
                max="800"
                step="50"
                value={parseInt(heroStyles.height)}
                onChange={(e) => setHeroStyles({...heroStyles, height: `${e.target.value}px`})}
                className="w-full"
                aria-label="Height"
                title="Adjust height"
              />
              <span className="text-sm text-gray-400">{heroStyles.height}</span>
            </div>

            {/* Padding */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Padding
              </label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={parseFloat(heroStyles.padding)}
                onChange={(e) => setHeroStyles({...heroStyles, padding: `${e.target.value}rem`})}
                className="w-full"
                aria-label="Padding"
                title="Adjust padding"
              />
              <span className="text-sm text-gray-400">{heroStyles.padding}</span>
            </div>

            {/* Global Text Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Global Text Color
              </label>
              <input
                type="color"
                value={heroStyles.color}
                onChange={(e) => setHeroStyles({...heroStyles, color: e.target.value})}
                className="w-full h-10 rounded border"
                aria-label="Global text color"
                title="Select global text color"
              />
            </div>

            {/* Global Font Family */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Global Font Family
              </label>
              <select
                value={heroStyles.fontFamily}
                onChange={(e) => setHeroStyles({...heroStyles, fontFamily: e.target.value})}
                className="w-full p-2 border rounded bg-gray-700 text-white"
                aria-label="Global font family"
                title="Select global font family"
              >
                {fontFamilies.map(font => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add AIChat at the bottom of the sidebar */}
          {apiKey && (
            <AIChat 
              apiKey={apiKey}
              currentConfig={{
                navbarConfig: null,
                heroConfig: {
                  items: heroItems,
                  styles: heroStyles
                }
              }}
              onConfigUpdate={handleAIConfigUpdate}
            />
          )}
        </div>
      )}
    </>
  );
}