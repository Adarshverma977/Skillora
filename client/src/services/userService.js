import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const userApi = axios.create({
  baseURL: `${API_BASE_URL}/users`,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => localStorage.getItem("skillora-token");

const addAuthHeader = (config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

userApi.interceptors.request.use(addAuthHeader);

const uploadApi = axios.create({
  baseURL: API_BASE_URL,
});

uploadApi.interceptors.request.use(addAuthHeader);

export const getMyProfile = async () => {
  const response = await userApi.get("/me");
  return response.data;
};

export const updateMyProfile = async (profileData) => {
  const response = await userApi.patch("/me", profileData);
  return response.data;
};

export const uploadProfilePhoto = async (file) => {
  if (!(file instanceof File)) {
    throw new Error("Please select an image file.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Choose a JPG, PNG, or WebP image.");
  }

  if (file.size > maxSize) {
    throw new Error("Image size must not exceed 5 MB.");
  }

  // Get short-lived upload credentials from your authenticated backend.
  const authResponse = await uploadApi.get("/uploads/imagekit-auth");
  const authData = authResponse.data?.data;

  if (!authData?.token || !authData?.signature || !authData?.expire) {
    throw new Error("ImageKit upload authentication is incomplete.");
  }

  const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;

  if (!publicKey) {
    throw new Error(
      "ImageKit public key is missing from frontend configuration.",
    );
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", publicKey);
  formData.append("token", authData.token);
  formData.append("signature", authData.signature);
  formData.append("expire", String(authData.expire));

  const uploadResponse = await axios.post(
    "https://upload.imagekit.io/api/v1/files/upload",
    formData,
  );

  const imageUrl = uploadResponse.data?.url;

  if (!imageUrl) {
    throw new Error("ImageKit did not return an image URL.");
  }

  return imageUrl;
};

export default userApi;
