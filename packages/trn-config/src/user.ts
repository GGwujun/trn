import { Users } from "@gitbeaker/node";
import utils from "@tzfe/trn-utils";

export const validateCurrentUser = async (username: any) => {
  const api = new Users({
    host: utils.FRONT_GITLAB_HOST,
    token: utils.FRONT_GITLAB_PRIVATE_ACCECK_TOKEN,
  });

  try {
    const users = (await api.all()) as any[];
    if (users) {
      return users.filter(
        (user) => user.state === "active" && user.username === username
      );
    }
    return [];
  } catch (error) {
    console.log(error, "error");
    return [];
  }
};
