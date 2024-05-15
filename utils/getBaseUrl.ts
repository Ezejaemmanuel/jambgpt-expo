const BASE_URL = 'https://jambgpt-next.vercel.app'; // Your specified base URL

export function createFullApiUrl(route: string) {
  // Check if the route starts with a '/'
  if (route.startsWith('/')) {
    throw new Error("Route should not start with '/'.");
  }

  // Construct the full URL by appending the route to the base URL
  const fullUrl = `${BASE_URL}/${route}`;

  return fullUrl;
}
