import { Select } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledSelect = styled(Select)(() => ({
  borderRadius: '8px',
  fontSize: '0.8rem',
  lineHeight: 'none',
  background: 'white',
  color: 'black',
  fontWeight: 600,
  '& .MuiSelect-select': {
    padding: '3px 5px !important'
  },
  '& .MuiSelect-icon': {
    display: 'none'
  }
}));
