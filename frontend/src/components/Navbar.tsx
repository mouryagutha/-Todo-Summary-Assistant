import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton
} from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  FormatListBulleted as TodoIcon
} from '@mui/icons-material';

interface NavbarProps {
  onSummarize: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onSummarize, toggleTheme, isDarkMode }) => {
  return (
    <AppBar position="fixed" elevation={1} color="default">
      <Toolbar>
        <TodoIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Todo Summary Assistant
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={onSummarize}
          >
            Summarize & Send to Slack
          </Button>
          
          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 