import { user } from "@prisma/client";
import logger from "@/logger/*";
import { prisma } from "../../../prisma/prisma";
import {
  updateUserName,
  updateUserNameAndUserPassword,
  updateUserPassword,
} from "@/clients/sentient/users/userDataClient";
import { createUser } from "@/clients/user/userDataClient";

export async function checkIfUserNameIsUnique({
  user_name,
}: {
  user_name: string;
}) {
  const allUsers = await prisma.user.findMany({
    where: {
      user_name: user_name,
    },
  });

  if (allUsers.length) {
    logger.error("[user-management API]: user_name exists");
    throw new Error("Username exists");
  }
  return true;
}

export async function editUsersCredentials({
  user_id,
  enableEditUserName,
  enablePasswordChange,
  user_name,
  user_password,
}: {
  enablePasswordChange: string;
  user_id: number;
  user_password: string;
  enableEditUserName: string;
  user_name: string;
}): Promise<user | undefined> {
  try {
    let userRetrieved;
    if (enablePasswordChange && enableEditUserName) {
      userRetrieved = await updateUserNameAndUserPassword({
        user_id: user_id,
        user_name: user_name,
        user_password: user_password,
      });
    } else if (enablePasswordChange) {
      userRetrieved = await updateUserPassword({
        user_id: user_id,
        user_password: user_password,
      });
    } else if (enableEditUserName) {
      userRetrieved = await updateUserName({
        user_id: user_id,
        user_name: user_name,
      });
    }
    return userRetrieved;
  } catch (err) {
    logger.error(err);
  }
}

export async function createUserService(
  user_name: string,
  user_password: string
) {
  try {
    await checkIfUserNameIsUnique({ user_name });
    await createUser(user_name, user_password);
  } catch (err) {
    logger.error(err);
    throw Error("User not created");
  }
}
