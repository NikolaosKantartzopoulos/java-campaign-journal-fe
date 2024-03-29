import { Box, Button, TextField } from "@mui/material";
import axios, { AxiosError } from "axios";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { toastMessage } from "../CustomComponents/Toastify/Toast";
import { UserControlScreenBox } from "./AuthenticationCSS";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

const userInfoCSS = {
  maxWidth: "375px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
};

const LogInSignUpScreen = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const { update } = useSession();
  async function handleLogin() {
    try {
      const [user_name, user_password] = [userName, userPassword];
      signIn(
        "credentials",
        { redirect: false },
        { user_name, user_password }
      ).then((res) => {
        if (res?.ok) {
          router.push("/account/control");
        } else {
          toastMessage("Wrong username or password", "error");
        }
      });
    } catch (e) {
      toastMessage("There was an error", "error");
    }
  }
  async function handleSignUp() {
    if (userName === "" || userPassword === "") {
      toastMessage("Username and/or Password fields empty", "success");
      return;
    }
    try {
      const [user_name, user_password] = [userName, userPassword];
      await axios.post("/api/user-management", {
        user_name,
        user_password,
      });
      toastMessage(
        "AccountCreated! Please log in with your new account",
        "success"
      );
      update({ user_name: userName, user_password: userPassword });
      setUserName("");
      setUserPassword("");
    } catch (e) {
      const err = e as AxiosError<{ message: string }>;

      toastMessage(err?.response?.data?.message as string, "error");
    }
  }

  return (
    <UserControlScreenBox>
      <Box sx={userInfoCSS}>
        <TextField
          label="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          label="Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
        />
        <Box
          sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}
        >
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
          <Button variant="contained" onClick={handleSignUp}>
            Sign up
          </Button>
        </Box>
      </Box>
    </UserControlScreenBox>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};

export default LogInSignUpScreen;
