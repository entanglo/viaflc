import { Box, Button, Container, Stack, Typography } from '@mui/material';
import GlassCard from '@components/styled/GlassCard';
import AddressInput from '@components/styled/AddressInput';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { validateAddress } from '@utils/Utils';
import { TEXT_SUBTLE } from '@styles/colors';
import { SHARES_URL } from '@constants/config';

const TrackShares = () => {
  const { t } = useTranslation();
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGo = () => {
    if (!validateAddress(address)) {
      setError('Invalid address');
      return;
    }
    setError(null);
    window.open(`${SHARES_URL}/address/${address}`, '_blank');
  };

  const onAddressChange = (val: string) => {
    setAddress(val);
    if (!val) {
      setError(null);
      return;
    }
    setError(validateAddress(val) ? null : 'Invalid address');
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <GlassCard>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {t('home.track.title')}
          </Typography>
          <Typography sx={{ color: TEXT_SUBTLE, mb: 2 }}>{t('home.track.subtitle')}</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="stretch">
            <Box sx={{ flex: 1 }}>
              <AddressInput
                aria-label="address-input"
                placeholder={t('home.track.placeholder')}
                value={address}
                onChange={onAddressChange}
                start={<AccountBalanceWalletIcon fontSize="small" />}
              />
              {error && (
                <Typography
                  variant="caption"
                  sx={{ color: 'error.main', mt: 0.5, display: 'block' }}>
                  {error}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGo}
              disabled={!address}
              sx={{ borderRadius: 1, height: 48, textTransform: 'none', fontWeight: 600 }}>
              {t('home.track.trackShares')}
            </Button>
          </Stack>
        </Box>
      </GlassCard>
    </Container>
  );
};

export default TrackShares;
