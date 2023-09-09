export const randomString = (strlen = 16) => {
  let chars = '123456789';
  let result = chars[Math.round(Math.random() * (chars.length - 1))];
  chars = chars + '0';
  for (let i = strlen - 1; i > 0; --i)
    result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
};
