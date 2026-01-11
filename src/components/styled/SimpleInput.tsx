import InputBase from '@mui/material/InputBase';
import { alpha, styled } from '@mui/material/styles';
import { PRIMARY_WHITE } from '@styles/colors';

export const SimpleInput = styled(InputBase)(({ theme }) => ({
  color: PRIMARY_WHITE,
  width: '100%',
  backgroundColor: alpha(PRIMARY_WHITE, 0.15),
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: alpha(PRIMARY_WHITE, 0.25)
  },
  '& .MuiInputBase-input': {
    lineHeight: 'initial',
    padding: '10px 15px', // Uniform padding
    transition: theme.transitions.create('width'),
    width: '100%'
  }
}));
