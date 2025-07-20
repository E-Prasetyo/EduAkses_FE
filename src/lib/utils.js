/**
 * Combines multiple class names into a single string
 * @param  {...string} classes - Class names to combine
 * @returns {string} - Combined class names
 */
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a date string
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
export function formatDate(dateString) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long'
  }).format(new Date(dateString));
}

/**
 * Menghapus seluruh tag HTML dari string
 * @param {string} html - String yang mengandung HTML
 * @returns {string} - String tanpa tag HTML
 */
export function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
