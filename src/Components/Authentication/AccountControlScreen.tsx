import UserContext from "@/Context/UserContext";
import { useContext } from "react";
import LogInSignUpScreen from "./LogInSignUpScreen";
import { Box, Button, Typography } from "@mui/material";
import AccountEditScreen from "./AccountEditScreen";

const AccountControlScreen = () => {
	const userCtx = useContext(UserContext);

	return (
		<Box
			sx={{
				margin: "1rem",
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
				alignItems: "center",
			}}
		>
			{!userCtx?.user && <LogInSignUpScreen />}
			{userCtx?.user && <AccountEditScreen />}
		</Box>
	);
};

export default AccountControlScreen;