import { useTranslation } from 'react-i18next';
import { SHARES_URL } from '@constants/config';
import { alpha, Box, Button, Container, Typography } from '@mui/material';
import GlassCard from '@components/styled/GlassCard';
import { IconInput, IconWrapper, StyledIconInputBase } from '@components/styled/IconInput';
import { PRIMARY_BLUE, TEXT_SUBTLE } from '@styles/colors';
import { validateAddress } from '@utils/Utils';

interface Props {
  flcAddress?: string;
  onAddressChange?: (val: string) => void;
}

const TrackShares = ({ flcAddress, onAddressChange }: Props) => {
  const { t } = useTranslation();

  const handleGo = () => {
    if (!flcAddress || !validateAddress(flcAddress)) {
      return;
    }
    window.open(`${SHARES_URL}/address/${flcAddress}`, '_blank');
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <GlassCard>
        <Box sx={{ p: 3, textAlign: 'left' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            {t('home.track.title')}
          </Typography>
          <Typography sx={{ color: TEXT_SUBTLE, mb: 3 }}>{t('home.track.subtitle')}</Typography>

          <Box sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            <IconInput>
              <IconWrapper>
                <img
                  src="/img/flc.png"
                  alt="FLC"
                  width={24}
                  height={24}
                  style={{ borderRadius: '50%' }}
                />
              </IconWrapper>
              <StyledIconInputBase
                placeholder={t('home.minerSettings.flcAddressIndependentPlaceholder')}
                value={flcAddress}
                onChange={(e) => {
                  const val = e.target.value;
                  if (onAddressChange) onAddressChange(val);
                }}
              />
            </IconInput>
            {flcAddress && flcAddress.length > 0 && !validateAddress(flcAddress) && (
              <Typography variant="caption" color="error">
                {t('home.payouts.invalidAddress', { coin: 'FLC' })}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={handleGo}
              disabled={!flcAddress || !validateAddress(flcAddress)}
              sx={{
                bgcolor: PRIMARY_BLUE,
                fontWeight: 700,
                borderRadius: 1,
                textTransform: 'uppercase',
                px: 6,
                '&:hover': { bgcolor: alpha(PRIMARY_BLUE, 0.8) }
              }}>
              {t('home.track.trackShares')}
            </Button>
          </Box>
        </Box>
      </GlassCard>
    </Container>
  );
};

export default TrackShares;
