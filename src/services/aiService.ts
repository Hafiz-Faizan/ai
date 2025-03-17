import { WebsiteConfig } from '../types/websiteConfig';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIResponse {
  navbarConfig?: any;
  heroConfig?: any;
  collectionConfig?: any;
  message: string;
}

interface HeroContent {
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  ctaLink: string;
}

export class AIService {
  private apiKey: string;
  private messages: Message[] = [];
  private geminiApiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private getStructureExplanation(config: any, section: string): string {
    if (section === 'hero') {
      const items = config.heroConfig.items;
      return `Current Hero Section Structure:
- Items (${items.length} elements):
${items.map((item: any) => `  • ${item.type}: ${item.content || 'N/A'}
    Position: ${item.position}
    Styles: ${Object.entries(item.styles).map(([key, value]) => `\n      ${key}: ${value}`).join('')}`).join('\n')}

- Global Styles:
${Object.entries(config.heroConfig.styles).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}`;
    }
    
    if (section === 'navbar') {
      const items = config.navbarConfig.items;
      return `Current Navbar Structure:
- Items (${items.length} elements):
${items.map((item: any) => `  • ${item.type}: ${item.label}
    Position: ${item.position}
    Styles: ${Object.entries(item.styles).map(([key, value]) => `\n      ${key}: ${value}`).join('')}`).join('\n')}

- Global Styles:
${Object.entries(config.navbarConfig.styles).map(([key, value]) => `  • ${key}: ${value}`).join('\n')}`;
    }

    if (section === 'collection') {
      const items = config.collectionConfig.items;
      const styles = config.collectionConfig.styles;
      
      // Format the sectionTitle object properly with all its properties
      let sectionTitleStr = '';
      if (styles.sectionTitle && typeof styles.sectionTitle === 'object') {
        sectionTitleStr = `{
          text: "${styles.sectionTitle.text || ''}",
          color: "${styles.sectionTitle.color || ''}",
          fontSize: "${styles.sectionTitle.fontSize || ''}",
          fontWeight: "${styles.sectionTitle.fontWeight || ''}",
          textAlign: "${styles.sectionTitle.textAlign || ''}",
          margin: "${styles.sectionTitle.margin || ''}",
          fontFamily: "${styles.sectionTitle.fontFamily || ''}"
        }`;
      }
      
      return `Current Collection Section Structure:
- Items (${items.length} elements):
${items.map((item: any) => `  • ${item.type}: ${item.title}
    id: ${item.id}
    Link: ${item.link}
    Image URL: ${item.imageUrl}
    Position: ${item.position}
    Styles: ${Object.entries(item.styles).map(([key, value]) => `\n      ${key}: ${value}`).join('')}`).join('\n')}

- Global Styles:
  • backgroundColor: ${styles.backgroundColor || ''}
  • padding: ${styles.padding || ''}
  • gap: ${styles.gap || ''}
  • maxWidth: ${styles.maxWidth || ''}
  • layout: ${styles.layout || ''}
  • gridColumns: ${styles.gridColumns || ''}
  • aspectRatio: ${styles.aspectRatio || ''}
  • containerPadding: ${styles.containerPadding || ''}
  • backgroundType: ${styles.backgroundType || ''}
  • backgroundImage: ${styles.backgroundImage || ''}
  • backgroundSize: ${styles.backgroundSize || ''}
  • backgroundPosition: ${styles.backgroundPosition || ''}
  • gradientStart: ${styles.gradientStart || ''}
  • gradientEnd: ${styles.gradientEnd || ''}
  • gradientDirection: ${styles.gradientDirection || ''}
  • sectionTitle: ${sectionTitleStr}`;
    }

    return 'No section selected';
  }

  private async getMockResponse(userMessage: string, currentConfig: WebsiteConfig): Promise<AIResponse> {
    // Determine which section is active based on what's in the currentConfig
    // Check each config property to determine which section is being edited
    let activeSection = null;
    
    if (currentConfig?.navbarConfig) {
      activeSection = 'navbar';
    }
    
    if (currentConfig?.heroConfig) {
      activeSection = 'hero';
    }
    
    if (currentConfig?.collectionConfig) {
      activeSection = 'collection';
    }
    
    if (!activeSection) {
      return {
        message: "Please select a section to edit first (navbar, hero, or collection section).",
        navbarConfig: undefined,
        heroConfig: undefined,
        collectionConfig: undefined
      };
    }

    const structureExplanation = this.getStructureExplanation(currentConfig, activeSection);

    try {
      // Prepare the message for Gemini
      const prompt = `I am providing you with the current structure of a section and a user request.

Your task is to:
1. First, thoroughly understand the provided structure
2. Then, analyze the user's request to understand what changes they want to make
3. Finally, modify only the specified values within the structure according to the request
4. Important: Do not change the structure itself - only modify the values the user requests

CURRENT STRUCTURE:
${structureExplanation}

USER REQUEST:
${userMessage}

IMPORTANT FORMATTING INSTRUCTIONS:
- For collection sections, the sectionTitle MUST be returned as a proper object with ALL these properties:
  {
    text: "The title text",
    color: "#000000",
    fontSize: "32px",
    fontWeight: "600",
    textAlign: "center",
    margin: "0 0 48px 0",
    fontFamily: ""
  }
- Never convert objects to string representations like "[object Object]"
- Maintain the exact same property names as in the original structure
- For collection items, use "items" (lowercase) not "Items"
- For collection styles, use "styles" (lowercase) not "Global Styles"
- Keep all existing properties even if you don't change them

Return your response in this exact JSON format:
{
  "message": "Detailed explanation of what changes you made",
  "${activeSection}Config": {
    // Complete updated configuration including ALL properties with their exact original names
  }
}`;

      // Log what will be sent to Gemini
      console.group('🚀 Request to Gemini');
      console.log('Prompt:', prompt);
      console.groupEnd();

      // Make the API call to Gemini using the correct endpoint and format
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Gemini API Error:', data);
        throw new Error('Failed to get response from Gemini');
      }

      // Use window.console to ensure logging works in all environments
      try {
        window.console.log('=== DEBUGGING START ===');
        window.console.log('Response received from Gemini API');
        
        // Log the complete raw response from Gemini
        window.console.log('📥 Gemini API Response:');
        window.console.log('Complete Response:', JSON.stringify(data, null, 2));
        
        // Check if we have a valid response structure
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
          window.console.error('Invalid Gemini API response structure:', data);
          throw new Error('Invalid response structure from Gemini API');
        }

        // Extract the text content from the response
        const responseText = data.candidates[0].content.parts[0].text;
        window.console.log('📝 Extracted Response Text:');
        window.console.log(responseText);
        
        // Extract JSON from the response, handling code blocks with backticks
        let jsonText = responseText;
        
        // Check if the response is wrapped in code blocks (```json ... ```)
        const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (codeBlockMatch) {
          window.console.log('Found JSON in code block format');
          jsonText = codeBlockMatch[1];
        } else {
          // Try to find JSON object using regex
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          window.console.log('JSON Match found:', !!jsonMatch);
          
          if (!jsonMatch) {
            window.console.error('No JSON found in response text');
            throw new Error('No JSON found in response');
          }
          
          jsonText = jsonMatch[0];
        }
        
        window.console.log('Extracted JSON text:', jsonText);
        
        // Parse the JSON
        const parsedResponse = JSON.parse(jsonText);
        window.console.log('🔍 Parsed JSON Response:');
        window.console.log(JSON.stringify(parsedResponse, null, 2));

        // Process the response based on the active section
        if (activeSection === 'hero' && parsedResponse.heroConfig) {
          window.console.log('Processing hero section updates...');
          
          // Create a deep copy of the current configuration to preserve structure
          const updatedConfig = JSON.parse(JSON.stringify(currentConfig.heroConfig));
          
          // Debug logging to see exact response structure
          window.console.log('Full Parsed Response:', parsedResponse);
          window.console.log('Hero Config in Response:', parsedResponse.heroConfig);

          // Get the items from Gemini response with better debug logging
          let geminiItems = [];
          if (parsedResponse.heroConfig.items) {
            window.console.log('Found lowercase items:', parsedResponse.heroConfig.items);
            geminiItems = parsedResponse.heroConfig.items;
          } else if (parsedResponse.heroConfig.Items) {
            window.console.log('Found uppercase Items:', parsedResponse.heroConfig.Items);
            geminiItems = parsedResponse.heroConfig.Items;
          } else {
            // If items array isn't found directly, check if we have a direct item update
            const possibleItem = parsedResponse.heroConfig.items?.[0] || parsedResponse.heroConfig.Items?.[0];
            if (possibleItem) {
              geminiItems = [possibleItem];
            } else {
              // Check if we have a direct style update without items array
              window.console.log('No items array found, checking for direct style updates');
              if (parsedResponse.heroConfig.styles || parsedResponse.heroConfig.Styles) {
                geminiItems = currentConfig.heroConfig.items.map(item => {
                  if (item.type === 'button' && userMessage.toLowerCase().includes('button')) {
                    return {
                      ...item,
                      styles: {
                        ...item.styles,
                        backgroundColor: userMessage.toLowerCase().includes('red') ? 'red' : 
                                      userMessage.toLowerCase().includes('blue') ? 'blue' : 'red'
                      }
                    };
                  }
                  return item;
                });
              }
            }
          }

          window.console.log('Gemini items processed:', geminiItems.length);
          window.console.log('Gemini items content:', JSON.stringify(geminiItems, null, 2));

          // Add type definitions for styles
          interface ItemStyles {
            [key: string]: any;
          }

          // Even if no items found, we should still process style updates
          const changes: string[] = [];

          // First handle the items if we have them
          if (geminiItems.length > 0) {
            // Map Gemini items to our expected format
            updatedConfig.items = geminiItems.map((geminiItem: any) => {
              // Determine the item type and content
              let type = '';
              let content = '';
              
              if (geminiItem.badge) {
                type = 'badge';
                content = geminiItem.badge;
              } else if (geminiItem.heading) {
                type = 'heading';
                content = geminiItem.heading;
              } else if (geminiItem.subheading) {
                type = 'subheading';
                content = geminiItem.subheading;
              } else if (geminiItem.button) {
                type = 'button';
                content = geminiItem.button;
              }

              // Get the matching current item to compare styles
              const currentItem = currentConfig.heroConfig.items.find(item => item.type === type);

              // Create the properly structured item
              const newItem = {
                id: currentItem?.id || `${type}1`, // Maintain ID format
                type,
                content,
                position: (geminiItem.Position || geminiItem.position || 'left').toLowerCase(),
                styles: {} as ItemStyles
              };

              // Process styles
              const itemStyles = geminiItem.Styles || geminiItem.styles || {};
              Object.entries(itemStyles).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                  // Convert key to camelCase if needed
                  const camelKey = key.toLowerCase() === 'backgroundcolor' ? 'backgroundColor' : key;
                  newItem.styles[camelKey] = value;

                  // Record style changes
                  if (currentItem && JSON.stringify(currentItem.styles[camelKey]) !== JSON.stringify(value)) {
                    changes.push(`- Changed ${type} ${camelKey} from ${currentItem.styles[camelKey]} to ${value}`);
                  }
                }
              });

              return newItem;
            });
          }

          // Then handle global styles
          if (parsedResponse.heroConfig.styles) {
            Object.entries(parsedResponse.heroConfig.styles).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                const camelKey = key.toLowerCase() === 'backgroundcolor' ? 'backgroundColor' : key;
                updatedConfig.styles[camelKey] = value;
                
                const oldValue = currentConfig.heroConfig?.styles[camelKey];
                if (JSON.stringify(oldValue) !== JSON.stringify(value)) {
                  changes.push(`- Changed global style ${camelKey} from ${oldValue} to ${value}`);
                }
              }
            });
          }

          // If we're specifically trying to update a button's color
          if (userMessage.toLowerCase().includes('button') && userMessage.toLowerCase().includes('color')) {
            // Find the button item
            const buttonItem = updatedConfig.items.find(item => item.type === 'button');
            if (buttonItem) {
              // Extract color from message or use default red
              const color = userMessage.toLowerCase().includes('red') ? 'red' : 
                           userMessage.toLowerCase().includes('blue') ? 'blue' : 'red';
              
              buttonItem.styles.backgroundColor = color;
              changes.push(`- Changed button background color to ${color}`);
            }
          }

          window.console.log('Final Updated Config:', JSON.stringify(updatedConfig, null, 2));
          window.console.log('Changes:', changes);
          window.console.log('=== DEBUGGING END ===');
          
          return {
            message: changes.length > 0 
              ? `I've updated the hero configuration. Here are the changes:\n${changes.join('\n')}`
              : "No changes were necessary.",
            heroConfig: updatedConfig
          };
        } else if (activeSection === 'navbar' && parsedResponse.navbarConfig) {
          // Process navbar updates similar to hero updates
          window.console.log('Processing navbar section updates...');
          
          // Create a deep copy of the current configuration
          const updatedConfig = JSON.parse(JSON.stringify(currentConfig.navbarConfig));
          
          // Log the current and new configurations
          window.console.log('Current Config:', JSON.stringify(currentConfig.navbarConfig, null, 2));
          window.console.log('New Config:', JSON.stringify(parsedResponse.navbarConfig, null, 2));
          
          // Track changes for reporting
          const changes: string[] = [];
          
          // Check if we have items in the response - handle both "items" and "Items" formats
          const responseItems = parsedResponse.navbarConfig.items || parsedResponse.navbarConfig.Items;
          
          if (responseItems && responseItems.length > 0) {
            window.console.log('Gemini navbar items found:', responseItems.length);
            
            // Update each item based on matching content
            updatedConfig.items = updatedConfig.items.map((currentItem: any) => {
              // Find matching item in Gemini response by ID, label, or content
              const matchingItem = responseItems.find((item: any) => {
                // Check for direct ID match
                if (item.id === currentItem.id) return true;
                
                // Check for label match
                if (item.label === currentItem.label) return true;
                
                // Check for link match (Gemini sometimes uses "link" as the key)
                if (item.link === currentItem.label) return true;
                
                // Check for image match
                if (currentItem.type === 'image' && item.image === currentItem.label) return true;
                
                return false;
              });
              
              if (matchingItem) {
                window.console.log(`Found matching navbar item for "${currentItem.label}"`, matchingItem);
                
                // Create a new item with updated properties
                const newItem = { ...currentItem };
                
                // Update label if provided
                if (matchingItem.label && matchingItem.label !== currentItem.label) {
                  newItem.label = matchingItem.label;
                  changes.push(`- Changed item "${currentItem.label}" label to "${matchingItem.label}"`);
                }
                
                // Update link if provided
                if (matchingItem.link && typeof matchingItem.link === 'string' && matchingItem.link !== currentItem.link) {
                  newItem.link = matchingItem.link;
                  changes.push(`- Changed item "${currentItem.label}" link to "${matchingItem.link}"`);
                }
                
                // Update position if provided - handle both "position" and "Position" formats
                const newPosition = matchingItem.position || matchingItem.Position;
                if (newPosition && newPosition !== currentItem.position) {
                  newItem.position = newPosition;
                  changes.push(`- Changed item "${currentItem.label}" position to "${newPosition}"`);
                }
                
                // Update styles if provided - handle both "styles" and "Styles" formats
                const itemStyles = matchingItem.styles || matchingItem.Styles;
                if (itemStyles) {
                  window.console.log('Current item styles before update:', JSON.stringify(newItem.styles, null, 2));
                  window.console.log('Gemini styles to apply:', JSON.stringify(itemStyles, null, 2));
                  
                  // Apply each style
                  Object.entries(itemStyles).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                      // Convert key to proper format if needed
                      const properKey = key.toLowerCase() === 'backgroundcolor' ? 'backgroundColor' : key;
                      
                      // Get the old value
                      const oldValue = currentItem.styles[properKey];
                      
                      // Update the style
                      newItem.styles[properKey] = value;
                      
                      // Record the change if different
                      if (JSON.stringify(oldValue) !== JSON.stringify(value)) {
                        window.console.log(`Changed item "${currentItem.label}" style ${properKey} from ${oldValue} to ${value}`);
                        changes.push(`- Changed item "${currentItem.label}" style ${properKey} from ${oldValue} to ${value}`);
                      }
                    }
                  });
                }
                
                // Update imageUrl if provided (for image items)
                if (currentItem.type === 'image' && matchingItem.imageUrl && matchingItem.imageUrl !== currentItem.imageUrl) {
                  newItem.imageUrl = matchingItem.imageUrl;
                  changes.push(`- Changed image "${currentItem.label}" URL to "${matchingItem.imageUrl}"`);
                }
                
                return newItem;
              }
              
              // If no match found, return the original item
              return currentItem;
            });
          }
          
          // Special handling for Global Styles format from Gemini
          if (parsedResponse.navbarConfig['Global Styles']) {
            window.console.log('Found Global Styles format in Gemini response');
            const globalStyles = parsedResponse.navbarConfig['Global Styles'];
            
            // Process each style in Global Styles
            Object.entries(globalStyles).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                // Handle specific keys with special mapping
                if (key.toLowerCase() === 'backgroundcolor') {
                  window.console.log(`Found backgroundcolor: ${value}`);
                  
                  // Convert named colors to hex if needed
                  const colorValue = this.convertNamedColorToHex(value as string);
                  updatedConfig.styles.backgroundColor = colorValue;
                  
                  const oldBgColor = currentConfig.navbarConfig?.styles.backgroundColor || '';
                  changes.push(`- Changed global navbar style backgroundColor from ${oldBgColor} to ${colorValue}`);
                } else {
                  // Map other keys to their camelCase equivalents
                  const camelCaseKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                  if (updatedConfig.styles[camelCaseKey] !== undefined) {
                    const oldValue = updatedConfig.styles[camelCaseKey];
                    
                    // Convert named colors to hex if needed for color properties
                    const newValue = camelCaseKey.toLowerCase().includes('color') ? 
                      this.convertNamedColorToHex(value as string) : value;
                    
                    updatedConfig.styles[camelCaseKey] = newValue;
                    
                    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                      changes.push(`- Changed global navbar style ${camelCaseKey} from ${oldValue} to ${newValue}`);
                    }
                  }
                }
              }
            });
          }
          
          // Handle regular styles format
          if (parsedResponse.navbarConfig.styles) {
            window.console.log('Processing regular navbar styles:', parsedResponse.navbarConfig.styles);
            
            Object.entries(parsedResponse.navbarConfig.styles).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                // Convert key to lowercase for case-insensitive comparison
                const lowerKey = key.toLowerCase();
                
                window.console.log(`Processing style key: "${key}", lowercase: "${lowerKey}", value: "${value}"`);
                
                // Map common style keys to their correct property names
                const styleKeyMap: {[key: string]: string} = {
                  'backgroundcolor': 'backgroundColor',
                  'background-color': 'backgroundColor',
                  'background': 'backgroundColor',
                  'color': 'color',
                  'padding': 'padding',
                  'fontfamily': 'fontFamily',
                  'font-family': 'fontFamily',
                  'boxshadow': 'boxShadow',
                  'box-shadow': 'boxShadow'
                };
                
                // Get the correct property name
                const propertyName = styleKeyMap[lowerKey] || key;
                
                window.console.log(`Mapped to property name: "${propertyName}"`);
                
                // Get the old value
                const oldValue = updatedConfig.styles[propertyName];
                
                window.console.log(`Old value: "${oldValue}", New value: "${value}"`);
                
                // Update the style
                updatedConfig.styles[propertyName] = value;
                
                // Record the change if different
                if (JSON.stringify(oldValue) !== JSON.stringify(value)) {
                  window.console.log(`Changed navbar style ${propertyName} from ${oldValue} to ${value}`);
                  changes.push(`- Changed navbar style ${propertyName} from ${oldValue} to ${value}`);
                }
              }
            });
          }
          
          window.console.log('Final updated navbar config:', updatedConfig);
          window.console.log('Navbar changes:', changes);
          window.console.log('=== DEBUGGING END ===');
          
          return {
            message: parsedResponse.message || 
                    (changes.length > 0 
                      ? `I've updated the navbar configuration. Here are the changes:\n${changes.join('\n')}`
                      : "No changes were necessary to the navbar."),
            navbarConfig: updatedConfig
          };
        } else if (activeSection === 'collection' && parsedResponse.collectionConfig) {
          window.console.log('Processing collection section updates...');
          
          // Create a deep copy of the current configuration
          const updatedConfig = JSON.parse(JSON.stringify(currentConfig.collectionConfig));
          
          // Log the current and new configurations
          window.console.log('Current Config:', JSON.stringify(currentConfig.collectionConfig, null, 2));
          window.console.log('New Config:', JSON.stringify(parsedResponse.collectionConfig, null, 2));
          
          // Track changes for reporting
          const changes: string[] = [];
          
          // Check if we have items in the response - handle different possible formats
          const responseItems = parsedResponse.collectionConfig.items || 
                               parsedResponse.collectionConfig.Items || [];
          
          if (responseItems && responseItems.length > 0) {
            window.console.log('Gemini collection items found:', responseItems.length);
            
            // Update each item based on matching content
            updatedConfig.items = updatedConfig.items.map((currentItem: any) => {
              // Find matching item in Gemini response by ID, title, or collection field
              const matchingItem = responseItems.find((item: any) => 
                item.id === currentItem.id || 
                item.title === currentItem.title ||
                item.collection === currentItem.title
              );
              
              if (matchingItem) {
                window.console.log(`Found matching collection item for "${currentItem.title}"`, matchingItem);
                
                // Create a new item with updated properties
                const newItem = { ...currentItem };
                
                // Update title if provided
                if (matchingItem.title && matchingItem.title !== currentItem.title) {
                  newItem.title = matchingItem.title;
                  changes.push(`- Changed item "${currentItem.title}" title to "${matchingItem.title}"`);
                } else if (matchingItem.collection && matchingItem.collection !== currentItem.title) {
                  newItem.title = matchingItem.collection;
                  changes.push(`- Changed item "${currentItem.title}" title to "${matchingItem.collection}"`);
                }
                
                // Update link if provided
                if (matchingItem.link && matchingItem.link !== currentItem.link) {
                  newItem.link = matchingItem.link;
                  changes.push(`- Changed item "${currentItem.title}" link to "${matchingItem.link}"`);
                } else if (matchingItem.Link && matchingItem.Link !== currentItem.link) {
                  newItem.link = matchingItem.Link;
                  changes.push(`- Changed item "${currentItem.title}" link to "${matchingItem.Link}"`);
                }
                
                // Update imageUrl if provided
                if (matchingItem.imageUrl && matchingItem.imageUrl !== currentItem.imageUrl) {
                  newItem.imageUrl = matchingItem.imageUrl;
                  changes.push(`- Changed item "${currentItem.title}" image URL`);
                } else if (matchingItem['Image URL'] && matchingItem['Image URL'] !== currentItem.imageUrl) {
                  newItem.imageUrl = matchingItem['Image URL'];
                  changes.push(`- Changed item "${currentItem.title}" image URL`);
                }
                
                // Update position if provided
                if (matchingItem.position && matchingItem.position !== currentItem.position) {
                  newItem.position = matchingItem.position;
                  changes.push(`- Changed item "${currentItem.title}" position to "${matchingItem.position}"`);
                } else if (matchingItem.Position && matchingItem.Position !== currentItem.position) {
                  newItem.position = matchingItem.Position;
                  changes.push(`- Changed item "${currentItem.title}" position to "${matchingItem.Position}"`);
                }
                
                // Update styles if provided
                const itemStyles = matchingItem.styles || matchingItem.Styles;
                if (itemStyles) {
                  Object.entries(itemStyles).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                      // Convert key to proper format if needed
                      const properKey = key.toLowerCase() === 'backgroundcolor' ? 'backgroundColor' : key;
                      
                      // Get the old value
                      const oldValue = currentItem.styles[properKey];
                      
                      // Update the style
                      newItem.styles[properKey] = value;
                      
                      // Record the change if different
                      if (JSON.stringify(oldValue) !== JSON.stringify(value)) {
                        changes.push(`- Changed item "${currentItem.title}" style ${properKey} from ${oldValue} to ${value}`);
                      }
                    }
                  });
                }
                
                return newItem;
              }
              
              return currentItem;
            });
          }
          
          // Handle global styles - check for both formats
          const globalStyles = parsedResponse.collectionConfig.styles || 
                              parsedResponse.collectionConfig['Global Styles'];
          
          if (globalStyles) {
            window.console.log('Processing global collection styles:', globalStyles);
            
            // Process each style property
            Object.entries(globalStyles).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                // Handle special case for sectionTitle
                if (key === 'sectionTitle') {
                  // If sectionTitle is a string representation of [object Object], skip it
                  if (typeof value === 'string' && value.includes('[object Object]')) {
                    window.console.log('Skipping malformed sectionTitle:', value);
                    return;
                  }
                  
                  // If sectionTitle is an object, process it
                  if (typeof value === 'object' && value !== null) {
                    window.console.log('Processing sectionTitle object:', value);
                    // Ensure we preserve the existing sectionTitle structure
                    const newSectionTitle = { ...updatedConfig.styles.sectionTitle };
                    
                    // Update each property in the sectionTitle object
                    Object.entries(value).forEach(([titleKey, titleValue]) => {
                      if (titleValue !== undefined && titleValue !== null) {
                        const oldTitleValue = updatedConfig.styles.sectionTitle[titleKey];
                        newSectionTitle[titleKey] = titleValue;
                        
                        if (JSON.stringify(oldTitleValue) !== JSON.stringify(titleValue)) {
                          changes.push(`- Changed section title ${titleKey} from ${oldTitleValue} to ${titleValue}`);
                        }
                      }
                    });
                    
                    updatedConfig.styles.sectionTitle = newSectionTitle;
                    return;
                  }
                  
                  // If we get here, keep the original sectionTitle
                  window.console.log('Keeping original sectionTitle');
                  return;
                }
                
                // Handle normal style properties
                const properKey = key.toLowerCase() === 'backgroundcolor' ? 'backgroundColor' : key;
                
                // Skip if the property doesn't exist in the original config
                if (updatedConfig.styles[properKey] === undefined && 
                    !['backgroundColor', 'backgroundType', 'backgroundImage', 
                      'backgroundSize', 'backgroundPosition', 'gradientStart', 
                      'gradientEnd', 'gradientDirection'].includes(properKey)) {
                  window.console.log(`Skipping unknown property: ${properKey}`);
                  return;
                }
                
                const oldValue = updatedConfig.styles[properKey];
                
                // Convert string numbers to actual numbers for gridColumns
                if (properKey === 'gridColumns' && typeof value === 'string') {
                  updatedConfig.styles[properKey] = parseInt(value as string);
                } else {
                  updatedConfig.styles[properKey] = value;
                }
                
                // Record the change if different
                if (JSON.stringify(oldValue) !== JSON.stringify(updatedConfig.styles[properKey])) {
                  changes.push(`- Changed global collection style ${properKey} from ${oldValue} to ${updatedConfig.styles[properKey]}`);
                }
              }
            });
          }
          
          window.console.log('Final updated collection config:', updatedConfig);
          window.console.log('Collection changes:', changes);
          
          return {
            message: parsedResponse.message || 
                    (changes.length > 0 
                      ? `I've updated the collection configuration. Here are the changes:\n${changes.join('\n')}`
                      : "No changes were necessary to the collection."),
            collectionConfig: updatedConfig
          };
        }
        
        // If we reach here, return the original configuration with a message
        return {
          message: "I processed your request but couldn't apply any changes to the configuration.",
          ...(activeSection === 'navbar' ? { navbarConfig: currentConfig.navbarConfig } : {}),
          ...(activeSection === 'hero' ? { heroConfig: currentConfig.heroConfig } : {}),
          ...(activeSection === 'collection' ? { collectionConfig: currentConfig.collectionConfig } : {})
        };
        
      } catch (error) {
        // Log any errors that occur during processing
        window.console.error('Error processing Gemini response:', error);
        return {
          message: "Sorry, I encountered an error while processing your request. Please try again.",
          ...(activeSection === 'navbar' ? { navbarConfig: currentConfig.navbarConfig } : {}),
          ...(activeSection === 'hero' ? { heroConfig: currentConfig.heroConfig } : {}),
          ...(activeSection === 'collection' ? { collectionConfig: currentConfig.collectionConfig } : {})
        };
      }

    } catch (error) {
      console.error('Error processing Gemini request:', error);
      return {
        message: "Sorry, I encountered an error while processing your request. Please try again.",
        ...(activeSection === 'navbar' ? { navbarConfig: currentConfig.navbarConfig } : {}),
        ...(activeSection === 'hero' ? { heroConfig: currentConfig.heroConfig } : {}),
        ...(activeSection === 'collection' ? { collectionConfig: currentConfig.collectionConfig } : {})
      };
    }
  }

  public async processUserRequest(userMessage: string, currentConfig: WebsiteConfig): Promise<AIResponse> {
    try {
      const userMsg: Message = {
        role: 'user',
        content: userMessage
      };
      this.messages.push(userMsg);

      const response = await this.getMockResponse(userMessage, currentConfig);
      
      // Add detailed response to chat history
      this.messages.push({
        role: 'assistant',
        content: response.message
      });

      return response;
    } catch (error) {
      console.error('Error processing request:', error);
      throw error;
    }
  }

  public clearHistory(): void {
    this.messages = [];
  }

  public getHistory(): Message[] {
    return [...this.messages];
  }

  // Helper function to convert named colors to hex
  private convertNamedColorToHex(color: string): string {
    // If it's already a hex color, return it
    if (color.startsWith('#')) {
      return color;
    }
    
    // Create a mapping of common color names to hex values
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
      'grey': '#808080',
      'pink': '#ffc0cb',
      'brown': '#a52a2a',
      'cyan': '#00ffff',
      'magenta': '#ff00ff',
      'lime': '#00ff00',
      'navy': '#000080',
      'teal': '#008080',
      'olive': '#808000',
      'maroon': '#800000',
      'silver': '#c0c0c0',
      'gold': '#ffd700'
    };
    
    // Check if the color is in our map
    const lowerColor = color.toLowerCase();
    if (colorMap[lowerColor]) {
      return colorMap[lowerColor];
    }
    
    // If not found, return the original color
    return color;
  }

  public async generateHeroContent(storeName: string, storeDescription: string): Promise<HeroContent> {
    try {
      const prompt = `As an AI assistant, generate compelling hero section content for a website based on the following store information:

Store Name: ${storeName}
Store Description: ${storeDescription}

Please generate:
1. A powerful, attention-grabbing hero title (max 60 characters)
2. An engaging subtitle that expands on the value proposition (max 120 characters)
3. A clear call-to-action button text (max 20 characters)
4. A relevant CTA link path

Return the response in this exact JSON format:
{
  "heroTitle": "The generated title",
  "heroSubtitle": "The generated subtitle",
  "ctaText": "Button text",
  "ctaLink": "/relevant-path"
}

Make the content professional, engaging, and aligned with modern marketing best practices.`;

      const response = await fetch(`${this.geminiApiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini');
      }

      const data = await response.json();
      
      // Extract the JSON response from Gemini's text response
      const responseText = data.candidates[0].content.parts[0].text;
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Invalid response format from Gemini');
      }

      const heroContent: HeroContent = JSON.parse(jsonMatch[0]);

      // Validate the response
      if (!heroContent.heroTitle || !heroContent.heroSubtitle || !heroContent.ctaText || !heroContent.ctaLink) {
        throw new Error('Incomplete hero content generated');
      }

      return heroContent;
    } catch (error) {
      console.error('Error generating hero content:', error);
      // Return default content if generation fails
      return {
        heroTitle: storeName,
        heroSubtitle: storeDescription,
        ctaText: "Learn More",
        ctaLink: "/about"
      };
    }
  }
} 