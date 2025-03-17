'use client';

import { useState, useEffect, useRef } from 'react';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AIChat from './AIChat';

interface NavItem {
  id: string;
  type: 'link' | 'image' | 'text';
  label: string;
  link: string;
  position: 'left' | 'center' | 'right' | 'nav';
  styles: {
    color: string;
    fontSize: string;
    fontFamily: string;
    backgroundColor: string;
    padding: string;
    marginTop: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    borderWidth?: string;
    borderColor?: string;
    borderStyle?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    alignSelf?: string;
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
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    maxWidth?: string;
    maxHeight?: string;
    aspectRatio?: string;
  };
  imageUrl?: string;
}

interface NavbarStyles {
  backgroundColor: string;
  padding: string;
  fontFamily: string;
  color: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface NavbarProps {
  isAdmin?: boolean;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onSave?: () => void;
  apiKey?: string;
  savedItems?: NavItem[] | null;
  savedStyles?: NavbarStyles | null;
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
  item: NavItem; 
  isEditing: boolean; 
  isSelected: boolean;
  onSelect: () => void;
  globalStyles: NavbarStyles;
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

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        color: item.styles.color || globalStyles.color,
        fontSize: item.styles.fontSize,
        fontFamily: item.styles.fontFamily || globalStyles.fontFamily,
        backgroundColor: item.styles.backgroundColor,
        padding: item.styles.padding,
        borderRadius: item.styles.borderRadius,
        marginTop: item.styles.marginTop,
        width: item.styles.width,
        height: item.styles.height,
        borderWidth: item.styles.borderWidth,
        borderColor: item.styles.borderColor,
        borderStyle: item.styles.borderStyle,
        alignSelf: item.styles.alignSelf,
      }}
      {...attributes}
      {...(isEditing ? listeners : {})}
      onClick={handleClick}
      className={`
        ${isEditing ? 'cursor-move' : 'cursor-pointer'} 
        transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        hover:opacity-80
      `}
    >
      {item.type === 'image' && item.imageUrl ? (
        <div style={{ width: '100%', height: '100%' }}>
          <img 
            src={item.imageUrl} 
            alt={item.label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: item.styles.objectFit || 'contain',
              borderRadius: item.styles.borderRadius,
              borderWidth: item.styles.borderWidth,
              borderColor: item.styles.borderColor,
              borderStyle: item.styles.borderStyle,
            }}
          />
        </div>
      ) : (
        item.label
      )}
    </div>
  );
}

export default function Navbar({ isAdmin = false, isEditing = false, onStartEdit, onSave, apiKey, savedItems, savedStyles }: NavbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Combined state for all navbar items including logo
  const [navItems, setNavItems] = useState<NavItem[]>([
    {
      id: 'logo',
      type: 'image',
      label: 'Logo',
      link: '',
      position: 'left',
      imageUrl: '/vercel.svg',
      styles: {
        width: '40px',
        height: '40px',
        borderRadius: '0px',
        borderWidth: '0px',
        borderColor: '#000000',
        borderStyle: 'solid',
        padding: '0px',
        marginTop: '0px',
        color: '',
        fontSize: '',
        fontFamily: '',
        backgroundColor: 'transparent',
        objectFit: 'contain',
        alignSelf: 'center'
      }
    },
    {
      id: '1',
      type: 'link',
      label: 'Home',
      link: '/',
      position: 'nav',
      styles: {
        color: '',
        fontSize: '16px',
        fontFamily: '',
        backgroundColor: 'transparent',
        padding: '0.5rem',
        marginTop: '0px'
      }
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [navStyles, setNavStyles] = useState<NavbarStyles>({
    backgroundColor: '#ffffff',
    padding: '1rem',
    fontFamily: 'Arial',
    color: '#000000'
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load saved settings
  useEffect(() => {
    const savedNavItems = localStorage.getItem('navItems');
    const savedNavStyles = localStorage.getItem('navStyles');
    
    if (savedNavItems) setNavItems(JSON.parse(savedNavItems));
    if (savedNavStyles) setNavStyles(JSON.parse(savedNavStyles));
  }, []);

  // Save settings
  const handleSave = () => {
    localStorage.setItem('navItems', JSON.stringify(navItems));
    localStorage.setItem('navStyles', JSON.stringify(navStyles));
    setSelectedItem(null);
    onSave?.();
  };

  // Add new item
  const addNewItem = (type: 'link' | 'image' | 'text', position: 'left' | 'center' | 'right' | 'nav' = 'nav') => {
    const newId = String(navItems.length + 1);
    const newItem: NavItem = {
      id: newId,
      type,
      label: type === 'link' ? 'New Link' : type === 'image' ? 'New Image' : 'New Text',
      link: type === 'link' ? '/' : '',
      position,
      styles: {
        color: '',
        fontSize: '16px',
        fontFamily: '',
        backgroundColor: 'transparent',
        padding: '0.5rem',
        marginTop: '0px',
        width: type === 'image' ? '40px' : undefined,
        height: type === 'image' ? '40px' : undefined,
        borderRadius: type === 'image' ? '0px' : undefined,
        borderWidth: type === 'image' ? '0px' : undefined,
        borderColor: type === 'image' ? '#000000' : undefined,
        borderStyle: type === 'image' ? 'solid' : undefined,
        objectFit: type === 'image' ? 'contain' : undefined,
        alignSelf: type === 'image' ? 'center' : undefined
      },
      imageUrl: type === 'image' ? '/vercel.svg' : undefined,
    };
    setNavItems([...navItems, newItem]);
    setSelectedItem(newId);
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, itemId?: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setNavItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, imageUrl }
          : item
      )
    );
  };

  // Update item position
  const updateItemPosition = (itemId: string, position: 'left' | 'center' | 'right' | 'nav') => {
    setNavItems(items =>
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
      setNavItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Update individual item style
  const updateItemStyle = (itemId: string, styleKey: string, value: string) => {
    setNavItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, styles: { ...item.styles, [styleKey]: value } }
          : item
      )
    );
  };

  // Update item text
  const updateItemText = (itemId: string, field: 'label' | 'link', value: string) => {
    setNavItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  // Delete item
  const deleteItem = (itemId: string) => {
    setNavItems(items => items.filter(item => item.id !== itemId));
    setSelectedItem(null);
  };

  // Add this function to handle AI config updates
  const handleAIConfigUpdate = (newConfig: any) => {
    if (newConfig.navbarConfig) {
      console.log('Updating navbar config from AI:', newConfig.navbarConfig);
      
      // Update items if provided
      if (newConfig.navbarConfig.items) {
        console.log('Updating navbar items:', newConfig.navbarConfig.items);
        
        // Ensure all color values are in proper format
        const formattedItems = newConfig.navbarConfig.items.map((item: NavItem) => {
          // Create a new item to avoid mutating the original
          const newItem = { ...item };
          
          // Process styles to ensure colors are in proper format
          if (newItem.styles) {
            Object.entries(newItem.styles).forEach(([key, value]) => {
              // Check if this is a color property and needs formatting
              if (
                (key.toLowerCase().includes('color') || key.toLowerCase() === 'background') && 
                typeof value === 'string' && 
                !value.startsWith('#') && 
                !value.startsWith('rgb') && 
                !value.startsWith('hsl') &&
                value !== 'transparent'
              ) {
                // Convert named colors to hex
                const colorMap: {[key: string]: string} = {
                  'black': '#000000',
                  'white': '#ffffff',
                  'red': '#ff0000',
                  'green': '#00ff00',
                  'blue': '#0000ff',
                  'yellow': '#ffff00',
                  'purple': '#800080',
                  'orange': '#ffa500',
                  'gray': '#808080',
                  'grey': '#808080'
                };
                
                const lowerValue = value.toLowerCase();
                if (colorMap[lowerValue]) {
                  console.log(`Converting color value "${value}" to "${colorMap[lowerValue]}"`);
                  newItem.styles[key] = colorMap[lowerValue];
                }
              }
            });
          }
          
          return newItem;
        });
        
        setNavItems(formattedItems);
      }
      
      // Update styles if provided
      if (newConfig.navbarConfig.styles) {
        console.log('Updating navbar styles:', newConfig.navbarConfig.styles);
        console.log('Previous backgroundColor:', navStyles.backgroundColor);
        console.log('New backgroundColor:', newConfig.navbarConfig.styles.backgroundColor);
        
        // Create a new styles object to ensure state update
        const updatedStyles = { 
          ...navStyles,  // Start with current styles
          ...newConfig.navbarConfig.styles  // Override with new styles
        };
        
        // Ensure backgroundColor is in proper format
        if (updatedStyles.backgroundColor && typeof updatedStyles.backgroundColor === 'string') {
          // Convert named colors to hex
          const colorMap: {[key: string]: string} = {
            'black': '#000000',
            'white': '#ffffff',
            'red': '#ff0000',
            'green': '#00ff00',
            'blue': '#0000ff',
            'yellow': '#ffff00',
            'purple': '#800080',
            'orange': '#ffa500',
            'gray': '#808080',
            'grey': '#808080'
          };
          
          const lowerColor = updatedStyles.backgroundColor.toLowerCase();
          if (colorMap[lowerColor]) {
            console.log(`Converting backgroundColor from "${updatedStyles.backgroundColor}" to "${colorMap[lowerColor]}"`);
            updatedStyles.backgroundColor = colorMap[lowerColor];
          }
        }
        
        // Ensure color is in proper format
        if (updatedStyles.color && typeof updatedStyles.color === 'string') {
          // Convert named colors to hex
          const colorMap: {[key: string]: string} = {
            'black': '#000000',
            'white': '#ffffff',
            'red': '#ff0000',
            'green': '#00ff00',
            'blue': '#0000ff',
            'yellow': '#ffff00',
            'purple': '#800080',
            'orange': '#ffa500',
            'gray': '#808080',
            'grey': '#808080'
          };
          
          const lowerColor = updatedStyles.color.toLowerCase();
          if (colorMap[lowerColor]) {
            console.log(`Converting color from "${updatedStyles.color}" to "${colorMap[lowerColor]}"`);
            updatedStyles.color = colorMap[lowerColor];
          }
        }
        
        console.log('Final updated styles:', updatedStyles);
        setNavStyles(updatedStyles);
      }
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
      
      {/* Navbar */}
      <nav 
        style={{
          backgroundColor: navStyles.backgroundColor,
          padding: navStyles.padding,
          fontFamily: navStyles.fontFamily,
          color: navStyles.color
        }}
        className={`relative shadow-md ${isAdmin && !isEditing ? 'hover:ring-2 hover:ring-blue-500 cursor-pointer' : ''}`}
        onClick={() => {
          if (isAdmin && !isEditing && onStartEdit) {
            onStartEdit();
          }
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {navItems
              .filter(item => item.position === 'left')
              .map(item => (
                <SortableItem
                  key={item.id}
                  item={item}
                  isEditing={isEditing}
                  isSelected={selectedItem === item.id}
                  onSelect={() => setSelectedItem(item.id)}
                  globalStyles={navStyles}
                />
              ))}
          </div>

          {/* Center Section */}
          <div className="flex items-center gap-4">
            {navItems
              .filter(item => item.position === 'center')
              .map(item => (
                <SortableItem
                  key={item.id}
                  item={item}
                  isEditing={isEditing}
                  isSelected={selectedItem === item.id}
                  onSelect={() => setSelectedItem(item.id)}
                  globalStyles={navStyles}
                />
              ))}
          </div>

          {/* Navigation Items */}
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={navItems.filter(item => item.position === 'nav')} strategy={horizontalListSortingStrategy}>
              <div className="flex gap-6">
                {navItems
                  .filter(item => item.position === 'nav')
                  .map(item => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      isEditing={isEditing}
                      isSelected={selectedItem === item.id}
                      onSelect={() => setSelectedItem(item.id)}
                      globalStyles={navStyles}
                    />
                  ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {navItems
              .filter(item => item.position === 'right')
              .map(item => (
                <SortableItem
                  key={item.id}
                  item={item}
                  isEditing={isEditing}
                  isSelected={selectedItem === item.id}
                  onSelect={() => setSelectedItem(item.id)}
                  globalStyles={navStyles}
                />
              ))}
          </div>
        </div>
      </nav>

      {/* Customization Sidebar */}
      {isEditing && (
        <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 text-white shadow-lg p-6 overflow-y-auto z-[9999]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Customize Navbar</h2>
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
                onClick={() => addNewItem('link')}
                className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600"
              >
                Add Link
              </button>
              <button
                onClick={() => addNewItem('image')}
                className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600"
              >
                Add Image
              </button>
              <button
                onClick={() => addNewItem('text')}
                className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600 col-span-2"
              >
                Add Text
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
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                  Delete Item
                </button>
              </div>

              {/* Text and Link Settings */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Text
                </label>
                <input
                  type="text"
                  value={navItems.find(item => item.id === selectedItem)?.label || ''}
                  onChange={(e) => updateItemText(selectedItem, 'label', e.target.value)}
                  className="w-full p-2 border rounded bg-gray-700 text-white"
                />
              </div>

              {navItems.find(item => item.id === selectedItem)?.type === 'link' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Link URL
                  </label>
                  <input
                    type="text"
                    value={navItems.find(item => item.id === selectedItem)?.link || ''}
                    onChange={(e) => updateItemText(selectedItem, 'link', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    placeholder="e.g., /about"
                  />
                </div>
              )}

              {/* Position Settings */}
              <div className="mb-6 border-b border-gray-600 pb-4">
                <h4 className="text-sm font-medium text-blue-400 mb-3">Position Settings</h4>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Menu Position
                  </label>
                  <select
                    value={navItems.find(item => item.id === selectedItem)?.position}
                    onChange={(e) => updateItemPosition(selectedItem, e.target.value as 'left' | 'center' | 'right' | 'nav')}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                    <option value="nav">Navigation Menu</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Position Type
                  </label>
                  <select
                    value={navItems.find(item => item.id === selectedItem)?.styles.position || 'relative'}
                    onChange={(e) => updateItemStyle(selectedItem, 'position', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                  >
                    <option value="relative">Default (Relative)</option>
                    <option value="absolute">Free Position (Absolute)</option>
                  </select>
                </div>

                {navItems.find(item => item.id === selectedItem)?.styles.position === 'absolute' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Top Position
                      </label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="number"
                          value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.top?.replace('%', '') || '0')}
                          onChange={(e) => updateItemStyle(selectedItem, 'top', `${e.target.value}%`)}
                          className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
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
                          value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.left?.replace('%', '') || '0')}
                          onChange={(e) => updateItemStyle(selectedItem, 'left', `${e.target.value}%`)}
                          className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                        />
                        <span className="text-sm text-gray-400">%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Margin Controls */}
              <div className="mb-6 border-b border-gray-600 pb-4">
                <h4 className="text-sm font-medium text-blue-400 mb-3">Margin Controls</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Top Margin
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.marginTop?.replace('px', '') || '0')}
                        onChange={(e) => updateItemStyle(selectedItem, 'marginTop', `${e.target.value}px`)}
                        className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
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
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.marginRight?.replace('px', '') || '0')}
                        onChange={(e) => updateItemStyle(selectedItem, 'marginRight', `${e.target.value}px`)}
                        className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
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
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.marginBottom?.replace('px', '') || '0')}
                        onChange={(e) => updateItemStyle(selectedItem, 'marginBottom', `${e.target.value}px`)}
                        className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
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
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.marginLeft?.replace('px', '') || '0')}
                        onChange={(e) => updateItemStyle(selectedItem, 'marginLeft', `${e.target.value}px`)}
                        className="w-full p-1 bg-gray-700 border border-gray-600 rounded text-center"
                      />
                      <span className="text-sm text-gray-400">px</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Settings */}
              {navItems.find(item => item.id === selectedItem)?.type === 'image' && (
                <>
                  <div className="mb-6 border-b border-gray-600 pb-4">
                    <h4 className="text-sm font-medium text-blue-400 mb-3">Image Settings</h4>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Upload Image
                      </label>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-2 bg-blue-500 rounded hover:bg-blue-600 w-full"
                      >
                        Choose Image
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Object Fit
                      </label>
                      <select
                        value={navItems.find(item => item.id === selectedItem)?.styles.objectFit || 'contain'}
                        onChange={(e) => updateItemStyle(selectedItem, 'objectFit', e.target.value)}
                        className="w-full p-2 border rounded bg-gray-700 text-white"
                      >
                        <option value="contain">Contain</option>
                        <option value="cover">Cover</option>
                        <option value="fill">Fill</option>
                        <option value="scale-down">Scale Down</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Width (px)
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.width?.replace('px', '') || '40')}
                        onChange={(e) => updateItemStyle(selectedItem, 'width', `${e.target.value}px`)}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400">
                        {navItems.find(item => item.id === selectedItem)?.styles.width}
                      </span>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Height (px)
                      </label>
                      <input
                        type="range"
                        min="20"
                        max="200"
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.height?.replace('px', '') || '40')}
                        onChange={(e) => updateItemStyle(selectedItem, 'height', `${e.target.value}px`)}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400">
                        {navItems.find(item => item.id === selectedItem)?.styles.height}
                      </span>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Border Radius (px)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.borderRadius?.replace('px', '') || '0')}
                        onChange={(e) => updateItemStyle(selectedItem, 'borderRadius', `${e.target.value}px`)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Text Styling */}
              <div className="mb-6 border-b border-gray-600 pb-4">
                <h4 className="text-sm font-medium text-blue-400 mb-3">Text Styling</h4>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={navItems.find(item => item.id === selectedItem)?.styles.color || navStyles.color}
                    onChange={(e) => updateItemStyle(selectedItem, 'color', e.target.value)}
                    className="w-full h-10 rounded border"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Font Size (px)
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.fontSize?.replace('px', '') || '16')}
                    onChange={(e) => updateItemStyle(selectedItem, 'fontSize', `${e.target.value}px`)}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-400">
                    {navItems.find(item => item.id === selectedItem)?.styles.fontSize}
                  </span>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Font Family
                  </label>
                  <select
                    value={navItems.find(item => item.id === selectedItem)?.styles.fontFamily || navStyles.fontFamily}
                    onChange={(e) => updateItemStyle(selectedItem, 'fontFamily', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                  >
                    <option value="">Use Global Font</option>
                    {fontFamilies.map(font => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Text Align
                  </label>
                  <select
                    value={navItems.find(item => item.id === selectedItem)?.styles.textAlign || 'left'}
                    onChange={(e) => updateItemStyle(selectedItem, 'textAlign', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
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
                    value={navItems.find(item => item.id === selectedItem)?.styles.textTransform || 'none'}
                    onChange={(e) => updateItemStyle(selectedItem, 'textTransform', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                  >
                    <option value="none">None</option>
                    <option value="uppercase">UPPERCASE</option>
                    <option value="lowercase">lowercase</option>
                    <option value="capitalize">Capitalize</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Letter Spacing (px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={parseFloat(navItems.find(item => item.id === selectedItem)?.styles.letterSpacing?.replace('px', '') || '0')}
                    onChange={(e) => updateItemStyle(selectedItem, 'letterSpacing', `${e.target.value}px`)}
                    className="w-full"
                  />
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
                    value={parseFloat(navItems.find(item => item.id === selectedItem)?.styles.lineHeight || '1.2')}
                    onChange={(e) => updateItemStyle(selectedItem, 'lineHeight', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Additional Styling */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-blue-400 mb-3">Additional Styling</h4>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={navItems.find(item => item.id === selectedItem)?.styles.backgroundColor || 'transparent'}
                    onChange={(e) => updateItemStyle(selectedItem, 'backgroundColor', e.target.value)}
                    className="w-full h-10 rounded border"
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
                    value={parseFloat(navItems.find(item => item.id === selectedItem)?.styles.opacity || '1')}
                    onChange={(e) => updateItemStyle(selectedItem, 'opacity', e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Z-Index
                  </label>
                  <input
                    type="number"
                    value={parseInt(navItems.find(item => item.id === selectedItem)?.styles.zIndex || '1')}
                    onChange={(e) => updateItemStyle(selectedItem, 'zIndex', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Box Shadow
                  </label>
                  <input
                    type="text"
                    value={navItems.find(item => item.id === selectedItem)?.styles.boxShadow || 'none'}
                    onChange={(e) => updateItemStyle(selectedItem, 'boxShadow', e.target.value)}
                    className="w-full p-2 border rounded bg-gray-700 text-white"
                    placeholder="e.g., 0 2px 4px rgba(0,0,0,0.1)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Global Settings */}
          <div className="border-t border-gray-600 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Global Settings</h3>
            
            {/* Background Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Navbar Background
              </label>
              <input
                type="color"
                value={navStyles.backgroundColor}
                onChange={(e) => setNavStyles({...navStyles, backgroundColor: e.target.value})}
                className="w-full h-10 rounded border"
                aria-label="Navbar background color"
                title="Select navbar background color"
              />
            </div>

            {/* Global Text Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Global Text Color
              </label>
              <input
                type="color"
                value={navStyles.color}
                onChange={(e) => setNavStyles({...navStyles, color: e.target.value})}
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
                value={navStyles.fontFamily}
                onChange={(e) => setNavStyles({...navStyles, fontFamily: e.target.value})}
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

            {/* Padding */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Navbar Padding
              </label>
              <input
                type="range"
                min="0"
                max="4"
                step="0.5"
                value={parseFloat(navStyles.padding)}
                onChange={(e) => setNavStyles({...navStyles, padding: `${e.target.value}rem`})}
                className="w-full"
                aria-label="Navbar padding"
                title="Adjust navbar padding"
              />
              <span className="text-sm text-gray-400">{navStyles.padding}</span>
            </div>
          </div>

          {/* AI Chat Interface */}
          <div className="border-t border-gray-600 pt-6 mt-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">AI Assistant</h3>
            
            {/* Add AIChat component */}
            {apiKey ? (
            <AIChat 
              apiKey={apiKey}
              currentConfig={{
                navbarConfig: {
                  items: navItems,
                  styles: navStyles
                },
                heroConfig: null
              }}
              onConfigUpdate={handleAIConfigUpdate}
            />
            ) : (
              <p className="text-sm text-gray-400 mt-2">
                Please provide an API key to use the AI assistant.
              </p>
          )}
          </div>
        </div>
      )}
    </>
  );
}
