const fs = require('fs');
const path = require('path');

const categories = {
  food: [
    { id: 'apple', emoji: '🍎', label: 'Apple' },
    { id: 'banana', emoji: '🍌', label: 'Banana' },
    { id: 'pizza', emoji: '🍕', label: 'Pizza' },
    { id: 'burger', emoji: '🍔', label: 'Burger' },
    { id: 'donut', emoji: '🍩', label: 'Donut' },
    { id: 'sushi', emoji: '🍣', label: 'Sushi' }
  ],
  drinks: [
    { id: 'cola', emoji: '🥤', label: 'Cola' },
    { id: 'orange_soda', emoji: '🥫', label: 'Orange soda' },
    { id: 'lemonade', emoji: '🍋', label: 'Lemonade' },
    { id: 'juice', emoji: '🧃', label: 'Juice' },
    { id: 'coffee', emoji: '☕', label: 'Coffee' },
    { id: 'milk', emoji: '🥛', label: 'Milk' }
  ],
  space: [
    { id: 'mercury', emoji: '🌑', label: 'Mercury' },
    { id: 'venus', emoji: '🌕', label: 'Venus' },
    { id: 'earth', emoji: '🌍', label: 'Earth' },
    { id: 'mars', emoji: '🔴', label: 'Mars' },
    { id: 'jupiter', emoji: '🪐', label: 'Jupiter' },
    { id: 'saturn', emoji: '🪐', label: 'Saturn' },
    { id: 'uranus', emoji: '🔵', label: 'Uranus' },
    { id: 'neptune', emoji: '❄️', label: 'Neptune' }
  ],
  animals: [
    { id: 'cat', emoji: '🐱', label: 'Cat' },
    { id: 'dog', emoji: '🐶', label: 'Dog' },
    { id: 'elephant', emoji: '🐘', label: 'Elephant' },
    { id: 'tiger', emoji: '🐯', label: 'Tiger' },
    { id: 'penguin', emoji: '🐧', label: 'Penguin' },
    { id: 'shark', emoji: '🦈', label: 'Shark' },
    { id: 'fox', emoji: '🦊', label: 'Fox' },
    { id: 'rabbit', emoji: '🐰', label: 'Rabbit' }
  ],
  countries: [
    { id: 'india', emoji: '🇮🇳', label: 'India' },
    { id: 'japan', emoji: '🇯🇵', label: 'Japan' },
    { id: 'brazil', emoji: '🇧🇷', label: 'Brazil' },
    { id: 'canada', emoji: '🇨🇦', label: 'Canada' },
    { id: 'egypt', emoji: '🇪🇬', label: 'Egypt' },
    { id: 'france', emoji: '🇫🇷', label: 'France' },
    { id: 'australia', emoji: '🇦🇺', label: 'Australia' },
    { id: 'mexico', emoji: '🇲🇽', label: 'Mexico' }
  ],
  computer: [
    { id: 'cpu', emoji: '🧠', label: 'CPU' },
    { id: 'ram', emoji: '🎛️', label: 'RAM' },
    { id: 'ssd', emoji: '💾', label: 'SSD' },
    { id: 'gpu', emoji: '📺', label: 'GPU' },
    { id: 'keyboard', emoji: '⌨️', label: 'Keyboard' },
    { id: 'mouse', emoji: '🖱️', label: 'Mouse' },
    { id: 'monitor', emoji: '🖥️', label: 'Monitor' },
    { id: 'motherboard', emoji: '⚙️', label: 'Motherboard' }
  ]
};

const getSvg = (emoji) => `
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="200" height="200" rx="30" fill="url(#grad1)" stroke="#334155" stroke-width="6"/>
  <text x="50%" y="55%" font-size="100" text-anchor="middle" dominant-baseline="middle" filter="url(#glow)">${emoji}</text>
</svg>
`;

Object.keys(categories).forEach(cat => {
  const dir = path.join(__dirname, 'public', cat);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  categories[cat].forEach(item => {
    fs.writeFileSync(path.join(dir, `${item.id}.svg`), getSvg(item.emoji).trim());
  });
});

console.log('SVGs generated successfully!');
