import { ObjectId } from 'mongodb';

// Navbar Types
export interface NavItem {
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
    hover?: any;
    after?: any;
    'hover:after'?: any;
  };
  imageUrl?: string;
}

export interface NavbarStyles {
  backgroundColor: string;
  padding: string;
  fontFamily: string;
  color: string;
  boxShadow?: string;
}

// Hero Types
export interface HeroItem {
  id: string;
  type: 'heading' | 'subheading' | 'button' | 'image' | 'badge' | 'paragraph';
  content: string;
  link?: string;
  position: 'left' | 'center' | 'right';
  styles: {
    color: string;
    fontSize: string;
    fontWeight: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
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
    backdropFilter?: string;
    display?: string;
    gap?: string;
    alignItems?: string;
    hover?: any;
    after?: any;
    'hover:after'?: any;
  };
  imageUrl?: string;
  animation?: 'none' | 'fade' | 'slide' | 'bounce';
}

export interface HeroStyles {
  backgroundColor: string;
  backgroundImage: string;
  backgroundSize: 'cover' | 'contain' | 'auto' | 'custom';
  backgroundWidth?: string;
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

// Collection Types
export interface CollectionItem {
  id: string;
  type: 'product' | 'service' | 'testimonial' | 'team' | 'feature' | 'image' | 'custom';
  title: string;
  description?: string;
  price?: string;
  image?: string;
  link?: string;
  styles?: {
    backgroundColor?: string;
    color?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    boxShadow?: string;
    width?: string;
    height?: string;
    [key: string]: string | undefined;
  };
  animation?: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'zoom';
  hover?: 'none' | 'scale' | 'shadow' | 'border' | 'slide-up';
}

export interface CollectionStyles {
  layout: 'grid' | 'carousel' | 'masonry' | 'list';
  columns: number;
  gap: string;
  padding: string;
  margin: string;
  backgroundColor?: string;
  backgroundType: 'color' | 'gradient' | 'image';
  backgroundGradient?: string;
  backgroundImage?: string;
  itemBackgroundColor?: string;
  itemBorderRadius?: string;
  itemPadding?: string;
  itemTextAlign?: 'left' | 'center' | 'right';
  itemTitleColor?: string;
  itemDescriptionColor?: string;
  itemBoxShadow?: string;
  overlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: string;
  title?: string;
  titleColor?: string;
  titleFontSize?: string;
  titleFontWeight?: string;
  titleMargin?: string;
  description?: string;
  descriptionColor?: string;
  descriptionFontSize?: string;
  descriptionMargin?: string;
  [key: string]: string | number | boolean | undefined;
}

// Website Document Types
export interface WebsiteConfig {
  _id?: ObjectId;
  userId: string;
  storeName: string;
  storeDescription?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
  heroImage?: string;
  backgroundImage?: string;
  navItems?: NavItem[];
  navStyles?: NavbarStyles;
  heroItems?: HeroItem[];
  heroStyles?: HeroStyles;
  collectionItems?: CollectionItem[];
  collectionStyles?: CollectionStyles;
  createdAt?: Date;
  updatedAt?: Date;
}

// Media Document Type
export interface Media {
  _id?: ObjectId;
  userId: string;
  websiteId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  component: 'navbar' | 'hero' | 'collection' | 'logo';
  itemId?: string;
  createdAt: Date;
} 
 