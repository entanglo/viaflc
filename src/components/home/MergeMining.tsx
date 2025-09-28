import { Box, Container, Typography } from '@mui/material';
import GlassCard from '@components/styled/GlassCard';
import { MERGE_MINING_COINS } from '@constants/config';
import { useTranslation } from 'react-i18next';

const MergeMining = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <GlassCard>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {t('home.merge.title')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(3,1fr)',
                sm: 'repeat(4,1fr)',
                md: 'repeat(5,1fr)'
              },
              gap: 2,
              justifyItems: 'center',
              alignItems: 'center'
            }}>
            {MERGE_MINING_COINS.map((c: any) => (
              <Box
                key={c.code}
                sx={{
                  textAlign: 'center',
                  opacity: c.active ? 1 : 0.5,
                  filter: c.active ? 'none' : 'grayscale(1)'
                }}>
                <Box
                  component="img"
                  src={c.icon}
                  alt={c.code}
                  sx={{ width: 48, height: 48, borderRadius: '50%', mb: 1 }}
                />
                <Typography sx={{ fontWeight: 700 }}>{c.code}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </GlassCard>
    </Container>
  );
};

export default MergeMining;
