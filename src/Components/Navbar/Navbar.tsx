import {
  AppBar,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginButton from "../Authentication/AccountButton";
import LinkSection from "./LinkSection";

import * as React from "react";
import { ColorModeContext } from "@/Context/ColorModeContext";

const Navbar = ({
  toggleDrawer,
}: {
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
}) => {
  const theme = useTheme();
  const under600px = useMediaQuery(theme.breakpoints.down("sm"));
  // const under450px = useMediaQuery(theme.breakpoints.down(400));
  const under450px = false;
  const { setMode } = React.useContext(ColorModeContext);

  React.useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "light") {
      setMode("light");
    } else if (currentTheme === "dark") {
      setMode("dark");
    }
  });

  return (
    <AppBar position="static" sx={{ marginBottom: "2rem" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          // height: under600px ? "32px" : null,
        }}
      >
        {under600px && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            onKeyDown={toggleDrawer(false)}
          >
            <MenuIcon />
          </IconButton>
        )}

        {!under450px && <LinkSection showText={!under600px} />}

        {!under600px && <LoginButton color="inherit" />}
      </Box>
    </AppBar>
  );
};

export default Navbar;
