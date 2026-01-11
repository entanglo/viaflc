import { useTranslation } from 'react-i18next';
import { POOL_FEE } from '@constants/config';
import { Box, Container, Grid, Typography } from '@mui/material';
import GlassCard from '@components/styled/GlassCard';
import { StatBox, StatLabel, StatValue } from '@components/styled/InfoStat';

const PoolInformation = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <GlassCard>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            {t('home.poolInfo.title')}
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatBox>
                <StatLabel>{t('home.poolInfo.algorithm')}</StatLabel>
                <StatValue>Scrypt</StatValue>
              </StatBox>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatBox>
                <StatLabel>{t('home.poolInfo.poolFee')}</StatLabel>
                <StatValue>{POOL_FEE}%</StatValue>
              </StatBox>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <StatBox>
                <StatLabel>{t('home.poolInfo.scheme')}</StatLabel>
                <StatValue>PPLNS</StatValue>
              </StatBox>
            </Grid>
          </Grid>
        </Box>
      </GlassCard>
    </Container>
  );
};

export default PoolInformation;
