import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StatBox = styled(Box)(({ theme }) => ({
  borderRadius: 12,
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  padding: theme.spacing(2),
  textAlign: 'center'
}));

export const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: 12,
  letterSpacing: 1,
  color: 'rgba(255,255,255,0.55)'
}));

export const StatValue = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.common.white,
  marginTop: theme.spacing(0.5)
}));
