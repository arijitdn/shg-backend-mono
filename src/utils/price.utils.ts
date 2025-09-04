/**
 * Price utility functions for backend consistency
 * Ensures prices are always stored and handled correctly between rupees and paise
 */

/**
 * Converts price to paise for storage and payment processing
 * @param price - Price value that might be in rupees or paise
 * @returns Price in paise
 */
export function toPaise(price: number): number {
  if (!price || price === 0) return 0;

  // If price is less than 1000, assume it's in rupees and convert to paise
  // If price is 1000 or more, assume it's already in paise
  return price < 1000 ? price * 100 : price;
}

/**
 * Converts price from paise to rupees
 * @param priceInPaise - Price in paise
 * @returns Price in rupees
 */
export function toRupees(priceInPaise: number): number {
  if (!priceInPaise || priceInPaise === 0) return 0;
  return priceInPaise / 100;
}

/**
 * Ensures price is stored in paise format in database
 * @param price - Price value from user input (likely in rupees)
 * @returns Price in paise for database storage
 */
export function normalizePrice(price: number): number {
  return toPaise(price);
}

/**
 * Validates that price is in expected format
 * @param price - Price to validate
 * @param expectedInPaise - Whether price should be in paise format
 * @returns true if price format is valid
 */
export function validatePriceFormat(
  price: number,
  expectedInPaise: boolean = true,
): boolean {
  if (!price || price <= 0) return false;

  if (expectedInPaise) {
    // For paise, we expect values >= 100 (at least ₹1)
    return price >= 100;
  } else {
    // For rupees, we expect values >= 1
    return price >= 1;
  }
}
