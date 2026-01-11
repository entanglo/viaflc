import { useTranslation } from 'react-i18next';
import { POOL_URL } from '@constants/config';
import { Box, Container, IconButton, Tooltip, Typography } from '@mui/material';
import CopyIcon from '@components/icons/CopyIcon';
import GlassCard from '@components/styled/GlassCard';
import { BORDER_SUBTLE, SURFACE_MUTED } from '@styles/colors';

const PoolServer = () => {
  const { t } = useTranslation();
  const poolUrl = `${POOL_URL} -u ${t('home.poolServer.walletWorker')} -p ${t(
    'home.poolServer.password'
  )}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(poolUrl);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <GlassCard>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {t('home.poolServer.title')}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: 1.5,
              border: `1px solid ${BORDER_SUBTLE}`,
              bgcolor: SURFACE_MUTED,
              px: 2,
              py: 1.5,
              gap: 1
            }}>
            <Typography
              component="code"
              sx={{
                fontFamily: 'Courier New, Courier, monospace',
                fontSize: 15,
                color: '#fff',
                flex: 1,
                background: 'unset',
                wordBreak: 'break-all'
              }}>
              {poolUrl}
            </Typography>
            <Tooltip title={t('home.poolServer.copy')}>
              <IconButton color="inherit" size="small" onClick={copy}>
                <CopyIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </GlassCard>
    </Container>
  );
};

export default PoolServer;
