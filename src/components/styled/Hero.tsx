import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6)
}));

export const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  textAlign: 'center',
  color: theme.palette.common.white
}));

export const HeroSubtitle = styled(Typography)(() => ({
  textAlign: 'center',
  color: 'rgba(255,255,255,0.7)'
}));
