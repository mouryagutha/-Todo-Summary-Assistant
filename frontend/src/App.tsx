import React, { useState } from 'react';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  useMediaQuery
} from '@mui/material';
import { TodoList } from './components/TodoList';
import { Navbar } from './components/Navbar';

export const App: React.FC = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  const handleSummarize = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/todos/summarize');
      const data = await response.json();
      if (data.success) {
        console.log('Summary:', data.summary);
        if (data.slackSent) {
          console.log('Summary sent to Slack successfully');
        } else if (data.slackError) {
          console.error('Failed to send to Slack:', data.slackError);
        }
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar
          onSummarize={handleSummarize}
          toggleTheme={toggleTheme}
          isDarkMode={isDarkMode}
        />
        <Container
          maxWidth="md"
          sx={{
            mt: '80px', // Add margin top to account for fixed navbar
            py: 4,
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <TodoList />
        </Container>
      </Box>
    </ThemeProvider>
  );
};
