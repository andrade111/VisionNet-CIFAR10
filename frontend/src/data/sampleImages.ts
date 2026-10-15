/**
 * Sample image generators for all 10 CIFAR-10 classes.
 * Renders distinct, recognizable vector graphics into standard PNG/JPEG Blobs
 * so users can test inference immediately without searching for external image files.
 */

export interface SampleImage {
  id: string;
  label: string;
  namePt: string;
  emoji: string;
  filename: string;
  svgContent: string;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sample-airplane',
    label: 'airplane',
    namePt: 'Avião',
    emoji: '✈️',
    filename: 'sample_cifar10_airplane.png',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0284c7" />
            <stop offset="100%" stop-color="#38bdf8" />
          </linearGradient>
        </defs>
        <rect width="128" height="128" fill="url(#skyGrad)"/>
        <!-- Clouds -->
        <ellipse cx="30" cy="100" rx="35" ry="16" fill="#ffffff" opacity="0.7"/>
        <ellipse cx="98" cy="95" rx="40" ry="18" fill="#ffffff" opacity="0.6"/>
        <!-- Airplane Fuselage -->
        <path d="M18 64 C25 60 75 58 110 64 C115 65 115 67 110 68 C75 74 25 72 18 68 Z" fill="#f8fafc"/>
        <!-- Wings -->
        <polygon points="56,62 70,22 84,24 74,62" fill="#cbd5e1"/>
        <polygon points="56,66 70,106 84,104 74,66" fill="#94a3b8"/>
        <!-- Tail Fin -->
        <polygon points="22,63 12,38 20,38 28,63" fill="#ef4444"/>
        <circle cx="98" cy="64" r="3" fill="#0284c7"/>
      </svg>
    `,
  },
  {
    id: 'sample-automobile',
    label: 'automobile',
    namePt: 'Automóvel',
    emoji: '🚗',
    filename: 'sample_cifar10_automobile.png',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
        <rect width="128" height="128" fill="#334155"/>
        <rect y="92" width="128" height="36" fill="#1e293b"/>
        <!-- Car Body -->
        <path d="M16 80 L32 54 L88 54 L112 80 L116 88 L12 88 Z" fill="#ef4444"/>
        <!-- Windows -->
        <path d="M36 57 L58 57 L58 76 L26 76 Z" fill="#bae6fd"/>
        <path d="M64 57 L84 57 L100 76 L64 76 Z" fill="#bae6fd"/>
        <!-- Wheels -->
        <circle cx="36" cy="92" r="14" fill="#0f172a"/>
        <circle cx="36" cy="92" r="6" fill="#94a3b8"/>
        <circle cx="92" cy="92" r="14" fill="#0f172a"/>
        <circle cx="92" cy="92" r="6" fill="#94a3b8"/>
        <!-- Headlight -->
        <rect x="110" y="80" width="4" height="6" fill="#fde047" rx="2"/>
      </svg>
    `,
  },
  {
    id: 'sample-bird',
    label: 'bird',
    namePt: 'Pássaro',
    emoji: '🐦',
    filename: 'sample_cifar10_bird.png',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
        <rect width="128" height="128" fill="#065f46"/>
        <!-- Branch -->
        <line x1="10" y1="105" x2="118" y2="85" stroke="#78350f" stroke-width="8" stroke-linecap="round"/>
        <!-- Body -->
        <ellipse cx="64" cy="68" rx="28" ry="22" fill="#0284c7"/>
        <!-- Head -->
        <circle cx="86" cy="50" r="16" fill="#0ea5e9"/>
        <!-- Eye -->
        <circle cx="92" cy="48" r="3" fill="#ffffff"/>
        <circle cx="93" cy="48" r="1.5" fill="#0f172a"/>
        <!-- Beak -->
        <polygon points="102,48 116,52 102,56" fill="#f59e0b"/>
        <!-- Wing -->
        <path d="M44 65 C52 48 76 56 68 82 C56 82 42 75 44 65 Z" fill="#0369a1"/>
        <!-- Tail -->
        <polygon points="36,70 14,84 22,72 38,72" fill="#075985"/>
      </svg>
    `,
  },
  {
    id: 'sample-cat',
    label: 'cat',
    namePt: 'Gato',
    emoji: '🐱',
    filename: 'sample_cifar10_cat.png',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
        <rect width="128" height="128" fill="#1e1b4b"/>
        <!-- Cat Body -->
        <ellipse cx="64" cy="85" rx="34" ry="28" fill="#f59e0b"/>
        <!-- Ears -->
        <polygon points="40,46 32,20 54,34" fill="#f59e0b"/>
        <polygon points="37,42 34,26 50,34" fill="#fca5a5"/>
        <polygon points="88,46 96,20 74,34" fill="#f59e0b"/>
        <polygon points="91,42 94,26 78,34" fill="#fca5a5"/>
        <!-- Head -->
        <circle cx="64" cy="52" r="26" fill="#d97706"/>
        <!-- Eyes -->
        <ellipse cx="53" cy="50" rx="4" ry="6" fill="#10b981"/>
        <circle cx="53" cy="50" r="2" fill="#022c22"/>
        <ellipse cx="75" cy="50" rx="4" ry="6" fill="#10b981"/>
        <circle cx="75" cy="50" r="2" fill="#022c22"/>
        <!-- Nose & Mouth -->
        <polygon points="61,58 67,58 64,62" fill="#fca5a5"/>
        <path d="M58 64 Q64 68 70 64" stroke="#78350f" stroke-width="2" fill="none"/>
        <!-- Whiskers -->
        <line x1="48" y1="60" x2="28" y2="58" stroke="#ffffff" stroke-width="1.5"/>
        <line x1="48" y1="63" x2="28" y2="65" stroke="#ffffff" stroke-width="1.5"/>
        <line x1="80" y1="60" x2="100" y2="58" stroke="#ffffff" stroke-width="1.5"/>
        <line x1="80" y1="63" x2="100" y2="65" stroke="#ffffff" stroke-width="1.5"/>
      </svg>
    `,
  },
  {
    id: 'sample-deer',
    label: 'deer',
    namePt: 'Cervo',
    emoji: '🦌',
    filename: 'sample_cifar10_deer.png',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
        <rect width="128" height="128" fill="#14532d"/>
        <!-- Antlers -->
        <path d="M46 36 L36 18 M36 18 L26 14 M36 18 L40 10" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
        <path d="M58 36 L66 16 M66 16 L76 12 M66 16 L68 8" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
        <!-- Head -->
        <polygon points="46,38 60,38 64,54 48,60 40,48" fill="#b45309"/>
        <!-- Eye -->
        <circle cx="48" cy="46" r="3" fill="#0f172a"/>
        <!-- Body -->
        <ellipse cx="76" cy="74" rx="26" ry="18" fill="#92400e"/>
        <!-- Neck -->
        <polygon points="48,50 62,44 72,66 58,70" fill="#b45309"/>
        <!-- Legs -->
        <line x1="62" y1="88" x2="58" y2="114" stroke="#78350f" stroke-width="4"/>
        <line x1="72" y1="88" x2="70" y2="114" stroke="#78350f" stroke-width="4"/>
        <line x1="88" y1="88" x2="86" y2="114" stroke="#78350f" stroke-width="4"/>
        <line x1="96" y1="88" x2="98" y2="114" stroke="#78350f" stroke-width="4"/>
      </svg>
    `,
  },
  {
    id: 'sample-dog',
    label: 'dog',
    namePt: 'Cachorro',
    emoji: '🐶',
    filename: 'sample_cifar10_dog.png',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
        <rect width="128" height="128" fill="#3f3f46"/>
        <!-- Body -->
        <ellipse cx="64" cy="84" rx="32" ry="24" fill="#a16207"/>
        <!-- Floppy Ears -->
        <ellipse cx="38" cy="48" rx="8" ry="16" fill="#713f12" transform="rotate(-15 38 48)"/>
        <ellipse cx="90" cy="48" rx="8" ry="16" fill="#713f12" transform="rotate(15 90 48)"/>
        <!-- Head -->
        <circle cx="64" cy="50" r="24" fill="#ca8a04"/>
        <!-- Snout -->
        <ellipse cx="64" cy="58" rx="12" ry="9" fill="#fef08a"/>
        <!-- Nose -->
        <polygon points="61,54 67,54 64,58" fill="#18181b"/>
        <!-- Tongue -->
        <path d="M62 62 Q64 70 66 62" fill="#f43f5e"/>
        <!-- Eyes -->
        <circle cx="54" cy="46" r="3.5" fill="#18181b"/>
        <circle cx="74" cy="46" r="3.5" fill="#18181b"/>
      </svg>
    `,
  },
  {
    id: 'sample-frog',
    label: 'frog',
    namePt: 'Sapo',
    emoji: '🐸',
    filename: 'sample_cifar10_frog.png',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
        <rect width="128" height="128" fill="#042f2e"/>
        <!-- Water Lily Pad -->
        <ellipse cx="64" cy="98" rx="54" ry="18" fill="#15803d"/>
        <!-- Frog Body -->
        <ellipse cx="64" cy="74" rx="28" ry="20" fill="#22c55e"/>
        <!-- Eyes Bulges -->
        <circle cx="48" cy="54" r="11" fill="#16a34a"/>
        <circle cx="80" cy="54" r="11" fill="#16a34a"/>
        <circle cx="48" cy="54" r="7" fill="#fde047"/>
        <circle cx="80" cy="54" r="7" fill="#fde047"/>
        <circle cx="48" cy="54" r="3.5" fill="#052e16"/>
        <circle cx="80" cy="54" r="3.5" fill="#052e16"/>
        <!-- Smile -->
        <path d="M50 72 Q64 82 78 72" stroke="#14532d" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- Belly -->
        <ellipse cx="64" cy="78" rx="16" ry="11" fill="#86efac"/>
      </svg>
    `,
  },
  {
    id: 'sample-horse',
    label: 'horse',
    namePt: 'Cavalo',
    emoji: '🐴',
    filename: 'sample_cifar10_horse.png',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
        <rect width="128" height="128" fill="#164e63"/>
        <!-- Mane -->
        <path d="M52 24 C48 36 50 56 56 68" stroke="#451a03" stroke-width="7" stroke-linecap="round"/>
        <!-- Horse Head -->
        <polygon points="34,48 48,26 62,28 58,54 44,66 32,56" fill="#92400e"/>
        <!-- Ears -->
        <polygon points="56,24 58,12 64,22" fill="#78350f"/>
        <!-- Eye -->
        <circle cx="48" cy="38" r="2.5" fill="#0f172a"/>
        <!-- Body -->
        <ellipse cx="80" cy="74" rx="28" ry="18" fill="#78350f"/>
        <!-- Legs -->
        <line x1="68" y1="88" x2="66" y2="114" stroke="#451a03" stroke-width="4.5"/>
        <line x1="78" y1="88" x2="76" y2="114" stroke="#451a03" stroke-width="4.5"/>
        <line x1="92" y1="88" x2="92" y2="114" stroke="#451a03" stroke-width="4.5"/>
        <line x1="102" y1="88" x2="104" y2="114" stroke="#451a03" stroke-width="4.5"/>
      </svg>
    `,
  },
  {
    id: 'sample-ship',
    label: 'ship',
    namePt: 'Navio',
    emoji: '🚢',
    filename: 'sample_cifar10_ship.png',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
        <defs>
          <linearGradient id="ocean" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0369a1"/>
            <stop offset="100%" stop-color="#0c4a6e"/>
          </linearGradient>
        </defs>
        <rect width="128" height="74" fill="#38bdf8"/>
        <rect y="74" width="128" height="54" fill="url(#ocean)"/>
        <!-- Hull -->
        <polygon points="18,74 32,96 96,96 114,74" fill="#1e293b"/>
        <line x1="22" y1="80" x2="108" y2="80" stroke="#ef4444" stroke-width="3"/>
        <!-- Cabin / Superstructure -->
        <rect x="44" y="52" width="40" height="22" fill="#f8fafc"/>
        <rect x="52" y="38" width="24" height="14" fill="#f8fafc"/>
        <!-- Smokestack -->
        <rect x="58" y="24" width="12" height="14" fill="#f97316"/>
        <rect x="58" y="24" width="12" height="4" fill="#1e293b"/>
        <!-- Windows -->
        <circle cx="52" cy="62" r="2.5" fill="#0284c7"/>
        <circle cx="64" cy="62" r="2.5" fill="#0284c7"/>
        <circle cx="76" cy="62" r="2.5" fill="#0284c7"/>
      </svg>
    `,
  },
  {
    id: 'sample-truck',
    label: 'truck',
    namePt: 'Caminhão',
    emoji: '🚚',
    filename: 'sample_cifar10_truck.png',
    svgContent: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
        <rect width="128" height="128" fill="#18181b"/>
        <rect y="92" width="128" height="36" fill="#27272a"/>
        <!-- Cargo Box -->
        <rect x="14" y="44" width="64" height="42" fill="#8b5cf6" rx="2"/>
        <line x1="46" y1="44" x2="46" y2="86" stroke="#6d28d9" stroke-width="2"/>
        <!-- Cab -->
        <path d="M80 58 L98 58 L112 72 L112 86 L80 86 Z" fill="#ec4899"/>
        <!-- Cab Window -->
        <path d="M84 62 L96 62 L106 72 L84 72 Z" fill="#cffafe"/>
        <!-- Wheels -->
        <circle cx="28" cy="92" r="11" fill="#09090b"/>
        <circle cx="28" cy="92" r="5" fill="#a1a1aa"/>
        <circle cx="64" cy="92" r="11" fill="#09090b"/>
        <circle cx="64" cy="92" r="5" fill="#a1a1aa"/>
        <circle cx="98" cy="92" r="11" fill="#09090b"/>
        <circle cx="98" cy="92" r="5" fill="#a1a1aa"/>
      </svg>
    `,
  },
];

/**
 * Converts an SVG string into a valid PNG File object using an in-memory Canvas.
 */
export async function svgSampleToFile(sample: SampleImage): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const svgBlob = new Blob([sample.svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to get 2D canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to convert canvas to blob'));
          return;
        }
        const file = new File([blob], sample.filename, { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    img.src = url;
  });
}
