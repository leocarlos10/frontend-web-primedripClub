/* headers generales para los fetchs */
const getHeaders = () => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
};

const getAuthHeaders = (token:string) => {
  return {
    ...getHeaders(),
    Authorization: `Bearer ${token}`,
  };
};

export { getHeaders, getAuthHeaders };
