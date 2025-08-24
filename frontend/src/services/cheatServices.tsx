import { makeApiRequest } from "@/utils/api";

const BASE_URL = import.meta.env.VITE_API_URL;
console.log(BASE_URL);

const getLLMResponse = async (prompt: string) => {
  const { response, error } = await makeApiRequest(
    `${BASE_URL}/v1/chat`,
    "POST",
    {
      prompt,
    }
  );
  console.log(response, error);
  return response;
};

export { getLLMResponse };
