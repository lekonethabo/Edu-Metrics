export interface PlaceholderImage {
  id: string;
  imageUrl: string;
  description: string;
  imageHint: string;
}

export const PlaceHolderImages: PlaceholderImage[] = [
  {
    id: 'hero-background',
    imageUrl: '/hero-background.png',
    description: 'Edu-Metrics Dashboard Analytics background',
    imageHint: 'A glowing blue and purple data visualization network connecting educational performance nodes.',
  },
  {
    id: 'login-background',
    imageUrl: '/login-background.png',
    description: 'Edu-Metrics Classroom study space background',
    imageHint: 'An abstract, glassmorphic soft-colored classroom setting representing modern digital classrooms.',
  },
];
