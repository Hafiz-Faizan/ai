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
  };
  imageUrl?: string;
}

export interface NavbarStyles {
  backgroundColor: string;
  padding: string;
  fontFamily: string;
  color: string;
}

export interface NavbarConfig {
  items: NavItem[];
  styles: NavbarStyles;
}

export interface HeroItem {
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

export interface HeroStyles {
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

export interface HeroConfig {
  items: HeroItem[];
  styles: HeroStyles;
}

export interface CollectionItem {
  id: string;
  type: 'collection';
  title: string;
  imageUrl: string;
  link: string;
  position: 'left' | 'center' | 'right';
  styles: {
    color: string;
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    letterSpacing: string;
    textAlign: 'left' | 'center' | 'right';
    imageOverlay: string;
    overlayOpacity: string;
    imageFilter: string;
    objectFit: 'cover' | 'contain' | 'fill' | 'none';
    backgroundColor: string;
    padding: string;
    margin: string;
    width: string;
    height: string;
    borderRadius: string;
    boxShadow: string;
    hoverEffect: 'zoom' | 'fade' | 'overlay' | 'none';
    animation: 'fade' | 'slide' | 'zoom' | 'none';
    animationDuration: string;
    animationDelay: string;
  };
}

export interface CollectionStyles {
  backgroundColor: string;
  padding: string;
  gap: string;
  maxWidth: string;
  layout: string;
  gridColumns: number;
  aspectRatio: string;
  containerPadding: string;
  backgroundType?: 'color' | 'image' | 'gradient';
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: string;
  sectionTitle: {
    text: string;
    color: string;
    fontSize: string;
    fontWeight: string;
    textAlign: 'left' | 'center' | 'right';
    margin: string;
    fontFamily: string;
  };
}

export interface CollectionConfig {
  items: CollectionItem[];
  styles: CollectionStyles;
}

export interface WebsiteConfig {
  navbarConfig?: NavbarConfig | null;
  heroConfig?: HeroConfig | null;
  collectionConfig?: CollectionConfig | null;
} 