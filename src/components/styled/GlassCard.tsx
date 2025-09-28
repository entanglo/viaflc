import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const GlassCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  background: 'rgba(17, 17, 17, 0.85)',
  borderRadius: 16,
  border: '1px solid rgba(255, 255, 255, 0.08)',
  boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
  overflow: 'hidden'
}));

export default GlassCard;

