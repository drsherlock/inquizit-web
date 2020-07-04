import { getReq, postReq } from "./reqUtil";

export const getRoom = async () => {
  return await getReq({ url: "rooms" });
};

export const createUser = async (email, username) => {
  const data = { email: email, username: username };
  return await postReq({ url: "users", data });
};

export const createRoom = async () => {
  return await postReq({ url: "rooms" });
};

export const removeUserFromRoom = async roomId => {
  const data = { roomId: roomId };
  return await postReq({ url: "rooms/removeUser", data });
};

export const verifyUser = async () => {
  return await getReq({ url: "users/verify" });
};

export const addUserToRoom = async roomId => {
  const data = { roomId: roomId };
  return await postReq({ url: "rooms/addUser", data });
};
