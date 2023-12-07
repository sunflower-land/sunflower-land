/*

    This file contains everything related to Plaza Username.

    This file also import a list of profanity words used to check if the username is valid.

*/

import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
const API_URL = CONFIG.API_URL;

const REGEX = new RegExp(/^[\w*?!, '-]+$/);
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

export const validateUsername = (username?: string) => {
  // If this function returns null, it means the username is valid.
  // If this function returns a string, it means the username is invalid and the string is the reason why.

  if (!username) return "Username is required";

  username = username.replace(/[_-]/g, "");

  if (username.length < 3) return "Username is too short (min 3 characters)";
  if (username.length > 12) return "Username is too long (max 12 characters)";
  if (!REGEX.test(username)) return "Username contains invalid characters";
  if (username.includes(" ")) return "Username contains invalid characters";
  if (!ALPHABET.includes(username[0].toLowerCase()))
    return "Username must start with a letter";

  return null;
};

export const saveUsername = async (
  token: string,
  farmId: number,
  username: string
) => {
  const response = await window.fetch(`${API_URL}/username/${farmId}`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
    }),
  });

  if (response.status === 409) {
    return { success: false };
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  return { success: true };
};

export const checkUsername = async (token: string, username: string) => {
  const response = await window.fetch(`${API_URL}/check-username`, {
    method: "POST",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
    }),
  });

  if (response.status === 409) {
    return { success: false };
  }

  if (response.status >= 400) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  return { success: true };
};
