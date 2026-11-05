export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {
    colors: { navy: { 950: '#101c31', 900: '#15243d', 800: '#1d3150' }, gold: { 500: '#c9a45c', 400: '#dfbd79' }, canvas: '#f5f6f8' },
    fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Manrope', 'sans-serif'] },
    boxShadow: { soft: '0 8px 30px rgba(16, 28, 49, 0.06)' }
  }},
  plugins: []
}