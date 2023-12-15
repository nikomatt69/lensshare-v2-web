import localFont from 'next/font/local';

const heyFont = localFont({
  src: [
    {
      path: '../../public/fonts/helvetica-rounded-bold-5871d05ead8de.ttf',
      weight: '400',
      style: 'normal'
    },
    {
      path: '../../public/fonts/helvetica-rounded-bold-5871d05ead8de.ttf',
      weight: '500',
      style: 'medium'
    },
    {
      path: '../../public/fonts/helvetica-rounded-bold-5871d05ead8de.ttf',
      weight: '700',
      style: 'bold'
    }
  ],
  fallback: ['sans-serif'],
  preload: true,
  display: 'swap'
});

export default heyFont;
