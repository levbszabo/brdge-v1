import { createTheme } from '@mui/material/styles';
import { muiTheme } from '../config/theme';

// Create and export the theme
export const theme = createTheme(muiTheme);

// Re-export the getThemeColor function
export { getThemeColor } from '../config/theme';