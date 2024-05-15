import { supabase } from '../supabase';

export async function getUserInfo() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error retrieving user information:', error.message);
    // return null;
    throw error;
  }

  if (user) {
    console.log('User information:', user);
    // You can access user properties like user.id, user.email, etc.
    return user;
  } else {
    console.log('No user is currently authenticated.');
    return null;
  }
}
