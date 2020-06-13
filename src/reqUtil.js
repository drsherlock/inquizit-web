import config from "./config/development";

export const getReq = async reqObject => {};

export const postReq = async reqObject => {
  const { url, data } = reqObject;
  try {
    const response = await fetch(`${config.API_URL}${url}`, {
      method: "post",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      },
      credentials: "include",
      body: JSON.stringify(data)
    });

    return await response.json();
  } catch (error) {
    return { error };
  }
};
