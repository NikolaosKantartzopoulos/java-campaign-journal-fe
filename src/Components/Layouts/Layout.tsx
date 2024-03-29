import { ReactNode, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Drawer from "@mui/material/Drawer";
import { Box, Divider, useMediaQuery, useTheme } from "@mui/material";
import LinkSection from "../Navbar/LinkSection";
import AccountButton from "../Authentication/AccountButton";

export default function Layout({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const theme = useTheme();
  const under600px = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Navbar toggleDrawer={toggleDrawer} />
      {under600px && (
        <Drawer
          open={isDrawerOpen}
          onClose={() => toggleDrawer(false)}
          onClick={() => setDrawerOpen(false)}
        >
          <Box
            sx={(theme) => ({
              width: 150,
              backgroundColor:
                theme.palette.mode === "light"
                  ? theme.palette.primary.main
                  : null,
              height: "100%",
            })}
            role="presentation"
          >
            <LinkSection />
            <Divider />
            <AccountButton />
          </Box>
        </Drawer>
      )}
      {children}
    </>
  );
}
