# Design Document

## Overview

The multilingual content toggle system will provide a comprehensive internationalization solution that dynamically translates all website content between English and Portuguese. The system will use a client-side translation approach with structured JSON translation files, localStorage for persistence, and intelligent fallback mechanisms.

## Architecture

### Translation Data Structure
The system will use a hierarchical JSON structure to organize translations by page and content type:

```json
{
  "en": {
    "navigation": {
      "home": "Home",
      "services": "Services",
      "portfolio": "Portfolio"
    },
    "hero": {
      "subtitle": "Premium Digital Solutions",
      "title": "Transform Your Business with AI Automation"
    }
  },
  "pt": {
    "navigation": {
      "home": "Início", 
      "services": "Serviços",
      "portfolio": "Portfólio"
    },
    "hero": {
      "subtitle": "Soluções Digitais Premium",
      "title": "Transforme o Seu Negócio com Automação IA"
    }
  }
}
```

### Translation Engine
A centralized translation engine will handle:
- Loading translation data
- Content replacement with proper HTML preservation
- Fallback to default language for missing translations
- Dynamic content translation for form elements and placeholders

### State Management
- Browser localStorage for language preference persistence
- HTML lang attribute updates for accessibility
- CSS class-based styling adjustments if needed

## Components and Interfaces

### 1. Translation Manager (`TranslationManager`)
**Purpose:** Core translation orchestration and state management

**Methods:**
- `init()`: Initialize the translation system
- `setLanguage(lang)`: Change active language
- `getTranslation(key, fallback)`: Retrieve translation by key
- `translatePage()`: Apply translations to current page
- `detectBrowserLanguage()`: Auto-detect user's preferred language

### 2. Content Scanner (`ContentScanner`)
**Purpose:** Identify and catalog translatable content

**Methods:**
- `scanPage()`: Find all translatable elements
- `getElementKey(element)`: Generate translation keys for elements
- `isTranslatable(element)`: Determine if element should be translated

### 3. DOM Updater (`DOMUpdater`)
**Purpose:** Apply translations to DOM elements safely

**Methods:**
- `updateElement(element, translation)`: Update single element
- `updatePlaceholders()`: Handle form placeholders
- `preserveHTML(element, translation)`: Maintain HTML structure during translation

### 4. Storage Handler (`StorageHandler`)
**Purpose:** Manage language preference persistence

**Methods:**
- `saveLanguage(lang)`: Store language preference
- `getLanguage()`: Retrieve stored language
- `clearLanguage()`: Reset language preference

## Data Models

### Translation Entry
```typescript
interface TranslationEntry {
  key: string;
  en: string;
  pt: string;
  context?: string;
  type: 'text' | 'placeholder' | 'title' | 'alt';
}
```

### Element Mapping
```typescript
interface ElementMapping {
  element: HTMLElement;
  translationKey: string;
  originalText: string;
  translationType: 'textContent' | 'placeholder' | 'title' | 'alt';
}
```

### Language State
```typescript
interface LanguageState {
  current: 'en' | 'pt';
  available: string[];
  fallback: string;
  autoDetect: boolean;
}
```

## Error Handling

### Missing Translation Handling
- Fallback to English for missing Portuguese translations
- Console warnings for missing translation keys (development mode)
- Graceful degradation - show original text if no translation available

### DOM Manipulation Safety
- Preserve HTML structure and attributes during translation
- Handle dynamic content loading
- Prevent translation of script tags and sensitive elements

### Storage Failures
- Graceful handling of localStorage unavailability
- Session-based fallback for language preference
- Default to browser language detection if storage fails

## Testing Strategy

### Unit Tests
- Translation key lookup and fallback logic
- DOM element identification and updating
- Storage operations and error handling
- Language detection algorithms

### Integration Tests
- Full page translation workflows
- Cross-page language persistence
- Form element translation (placeholders, options)
- Dynamic content translation

### User Experience Tests
- Translation toggle responsiveness
- Visual feedback during language changes
- Accessibility compliance (screen readers, lang attributes)
- Mobile device compatibility

### Performance Tests
- Translation loading and application speed
- Memory usage with large translation sets
- DOM update efficiency
- Storage operation performance

## Implementation Approach

### Phase 1: Core Translation Engine
- Implement TranslationManager with basic functionality
- Create translation data structure and loading mechanism
- Add language toggle functionality with localStorage persistence

### Phase 2: Content Discovery and Translation
- Implement ContentScanner for automatic content identification
- Add DOMUpdater for safe content replacement
- Handle special cases (forms, dynamic content, HTML preservation)

### Phase 3: Enhanced Features
- Add browser language auto-detection
- Implement visual feedback for language changes
- Add translation loading indicators
- Optimize performance for large pages

### Phase 4: Quality and Accessibility
- Comprehensive error handling and fallbacks
- Accessibility improvements (ARIA labels, lang attributes)
- Cross-browser compatibility testing
- Performance optimization

## Technical Considerations

### SEO Impact
- Proper HTML lang attribute management
- Meta tag translation for better search indexing
- URL structure considerations for future server-side rendering

### Accessibility
- Screen reader compatibility with lang attribute changes
- Keyboard navigation support for language toggle
- High contrast mode compatibility

### Performance Optimization
- Lazy loading of translation data
- Efficient DOM querying and updating
- Minimal layout thrashing during translation
- Translation caching strategies

### Browser Compatibility
- Modern browser support (ES6+)
- Graceful degradation for older browsers
- Mobile browser optimization
- Touch device interaction support