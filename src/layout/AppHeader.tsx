import { useState } from "react";
import { Link, NavLink } from "react-router";
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const navItems = [
  { label: "Events", to: "/", end: true },
  { label: "Settings", to: "/settings", end: false },
];

function BrandLink() {
  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <ConfirmationNumberOutlinedIcon color="primary" />
      <Typography variant="subtitle1" fontWeight={600}>
        Eventim
      </Typography>
    </Box>
  );
}

function NavLinkItem({
  to,
  label,
  end,
  onClick,
}: {
  to: string;
  label: string;
  end?: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink to={to} end={end} onClick={onClick} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <Typography
          component="span"
          color={isActive ? "primary" : "text.primary"}
          fontWeight={isActive ? 600 : 400}
        >
          {label}
        </Typography>
      )}
    </NavLink>
  );
}

export function AppHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 2 }}>
            {isMobile && (
              <IconButton
                edge="start"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon />
              </IconButton>
            )}

            <BrandLink />

            {!isMobile && (
              <Stack direction="row" spacing={2} sx={{ ml: 2 }}>
                {navItems.map((item) => (
                  <NavLinkItem key={item.to} to={item.to} label={item.label} end={item.end} />
                ))}
              </Stack>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={closeMobile}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { md: "none" } }}
      >
        <Box sx={{ width: 240 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}
          >
            <BrandLink />
            <IconButton onClick={closeMobile} aria-label="Close menu" size="small">
              <CloseIcon />
            </IconButton>
          </Stack>

          <List>
            {navItems.map((item) => (
              <ListItem key={item.to} disablePadding>
                <ListItemButton
                  component={NavLink}
                  to={item.to}
                  end={item.end}
                  onClick={closeMobile}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
