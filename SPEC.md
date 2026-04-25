# SPEC.md - Portfolio Rangga Triyanto

## Concept & Vision

Portfolio profesional seorang System Administrator yang menggabungkan estetika terminal Linux dengan desain modern. Terinspirasi dari command-line interface namun tetap elegan dan mudah dinavigasi. Memberikan kesan: kompeten, teknis, dan profesional di bidang infrastruktur IT.

## Design Language

### Aesthetic Direction
Dark terminal aesthetic dengan sentuhan modern - reminiscent of popular Linux terminal themes seperti Dracula/One Dark, dengan aksen gray yang sophisticated.

### Color Palette
- **Background Primary**: `#0d1117` (deep dark)
- **Background Secondary**: `#161b22` (card surfaces)
- **Background Terminal**: `#1e252e` (terminal window)
- **Accent Gray**: `#8b949e` (muted text, borders)
- **Accent Light**: `#c9d1d9` (primary text)
- **Accent Highlight**: `#e6edf3` (headings)
- **Accent Blue**: `#58a6ff` (links, highlights)
- **Success Green**: `#3fb950` (online status, success)
- **Prompt Color**: `#7ee787` (terminal prompt)

### Typography
- **Headings**: JetBrains Mono (monospace feel)
- **Body**: Inter (readable, modern)
- **Code/Terminal**: JetBrains Mono

### Spatial System
- Base unit: 8px
- Section padding: 80px vertical
- Card padding: 24px
- Gap between elements: 16px-32px

### Motion Philosophy
- Subtle fade-in on scroll (opacity 0→1, translateY 20px→0, 500ms ease-out)
- Typing animation for terminal hero section
- Hover transitions: 200ms ease
- Cursor blink animation on terminal

### Visual Assets
- Dummy profile image via UI Avatars API
- Terminal-style icons (Lucide icons)
- ASCII art decorations
- Noise texture overlay for depth

## Layout & Structure

### Navigation
Fixed top nav dengan terminal-style, transparan dengan blur. Logo sebagai `$rangga` dengan green prompt color.

### Sections
1. **Hero** - Full viewport, terminal window with typing animation introducing Rangga
2. **About** - Split layout: ASCII art photo frame + bio text
3. **Skills** - Grid of skill cards with progress bars styled as terminal loading bars
4. **Experience** - Timeline dengan terminal prompt markers
5. **Projects** - Card grid dengan repo-style layout
6. **Contact** - Terminal-style contact form

### Responsive Strategy
- Desktop: Full layouts, large typography
- Tablet: 2-column grids collapse
- Mobile: Single column, smaller terminal window

## Features & Interactions

### Terminal Hero
- Blinking cursor after typing animation
- Typing effect: "Halo, saya Rangga Triyanto - System Administrator"
- Subtle CRT scanline effect

### Skill Bars
- Animated fill on scroll into view
- Percentage displayed as `[████████░░] 80%`

### Navigation
- Smooth scroll to sections
- Active section highlight
- Mobile: hamburger menu dengan slide-in drawer

### Contact Form
- Terminal-style input fields dengan `>` prompt
- Validation with error messages styled as `[ERROR]`
- Success message styled as `[SUCCESS]`

## Component Inventory

### Terminal Window
- Title bar dengan colored dots (close/min/max)
- Content area dengan command prompts
- States: typing, idle with cursor

### Skill Card
- Dark background with border
- Icon + name + level bar
- Hover: subtle glow effect

### Experience Item
- Timeline dot with line
- Date badge styled as `[2020-2024]`
- Company name + role + description

### Project Card
- Repository-style header
- Description + tech stack tags
- GitHub link icon

### Contact Input
- Label as command prompt `$>`
- Input with dark background
- Focus: blue border glow

## Technical Approach

- Single HTML file dengan embedded CSS & JS
- Vanilla JavaScript (no frameworks)
- CSS Grid + Flexbox for layouts
- CSS custom properties for theming
- Intersection Observer for scroll animations
- Google Fonts: JetBrains Mono, Inter
