import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ContainerDI from 'typedi';
import { MERGE_MINING_COINS, RELAY_URL } from '@constants/config';
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import GlassCard from '@components/styled/GlassCard';
import { IconInput, IconWrapper, StyledIconInputBase } from '@components/styled/IconInput';
import { RelayService } from '@services/api/RelayService';
import {
  BORDER_SUBTLE,
  PRIMARY_BLUE,
  PRIMARY_GOLD,
  PRIMARY_WHITE,
  SURFACE_MUTED,
  TEXT_SUBTLE
} from '@styles/colors';
import { prepareCoin, validateAddress } from '@utils/Utils';

const MergeMiningConfigurator = dynamic(() => import('./MergeMiningConfigurator'), { ssr: false });

interface Props {
  flcAddress?: string;
  onAddressChange?: (addr: string) => void;
  nostrSettings?: any[] | null;
  onPayoutsFetched?: (address: string, settings: any[] | null) => void;
  generated?: boolean;
}

const MergeMining = ({
  flcAddress,
  onAddressChange,
  nostrSettings,
  onPayoutsFetched,
  generated
}: Props) => {
  const { t } = useTranslation();
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(false);

  const relayService = ContainerDI.get(RelayService);

  useEffect(() => {
    if (nostrSettings && nostrSettings.length > 0) {
      setShowConfig(true);
    }
  }, [nostrSettings]);

  const handleManage = async () => {
    if (!flcAddress || !validateAddress(flcAddress)) return;

    setLoading(true);
    if (onPayoutsFetched) {
      onPayoutsFetched(flcAddress, null);
    }

    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000);

    try {
      await relayService.connectRelay(RELAY_URL);

      relayService.subscribeSettings(flcAddress, {
        onevent: (event) => {
          if (event && event.tags) {
            const payouts = event.tags
              .filter((tag) => tag[0] !== 'a' && tag[0] !== 'd' && tag.length >= 3)
              .map((tag) => ({ coin: tag[0].toUpperCase(), address: tag[1], signature: tag[2] }));

            if (onPayoutsFetched) {
              onPayoutsFetched(flcAddress, payouts.length > 0 ? payouts : null);
            }

            clearTimeout(timeoutId);
            setLoading(false);
          }
        },
        oneose: () => {
          // handled by timeout or event
        }
      });
    } catch (e) {
      console.error(e);
      // If error, let timeout handle or clear immediately?
      // Safe to let timeout handle it to avoid flickering if retries happen internally (unlikely)
      // or just to provide consistent UX failure state.
    }

    // waiting logic removed
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <GlassCard>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            {t('home.payouts.title')}
          </Typography>
          <Typography sx={{ color: TEXT_SUBTLE, mb: 3 }}>{t('home.payouts.subtitle')}</Typography>
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
            {MERGE_MINING_COINS.map((c: any) => {
              const isSigned = nostrSettings?.some((s: any) => s.coin === c.code);

              const coinData = isSigned ? { ...c, active: false, mergeProgress: 1 } : c;

              const ui = prepareCoin(coinData);
              const coinNode = (
                <Box sx={{ position: 'relative', width: ui.size, height: ui.size, mb: 1 }}>
                  <Box
                    component="img"
                    src={c.icon}
                    alt={c.code}
                    sx={{
                      width: ui.size,
                      height: ui.size,
                      borderRadius: '50%',
                      opacity: ui.imageOpacity,
                      filter: ui.filter
                    }}
                  />
                  {ui.showProgress && (
                    <CircularProgress
                      variant="determinate"
                      value={Math.round(ui.p * 100)}
                      size={ui.size + 10}
                      thickness={ui.stroke}
                      sx={{
                        position: 'absolute',
                        top: -5,
                        left: -5,
                        zIndex: 1,
                        color: PRIMARY_BLUE
                      }}
                      enableTrackSlot
                    />
                  )}
                </Box>
              );

              const hasProgress = typeof c.mergeProgress === 'number';
              const percentLabel = `${Math.round(ui.p * 100)}%`;

              return (
                <Box key={c.code} sx={{ textAlign: 'center' }}>
                  {hasProgress ? (
                    <Badge
                      overlap="circular"
                      badgeContent={percentLabel}
                      sx={{
                        '& .MuiBadge-badge': {
                          bgcolor: PRIMARY_GOLD,
                          color: '#1a1a1a',
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          minWidth: 'auto',
                          height: '18px',
                          padding: '0 6px',
                          borderRadius: '12px'
                        }
                      }}>
                      {coinNode}
                    </Badge>
                  ) : (
                    coinNode
                  )}
                  <Typography sx={{ fontWeight: 700 }}>{c.code}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Divider sx={{ borderColor: alpha(PRIMARY_WHITE, 0.1), my: 0 }} />
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              mb: 3,
              maxWidth: 500,
              mx: 'auto',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 1 },
              alignItems: 'center'
            }}>
            <Box sx={{ flex: 1, width: '100%' }}>
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
            <Button
              variant="contained"
              onClick={handleManage}
              disabled={loading || !flcAddress || !validateAddress(flcAddress)}
              sx={{
                bgcolor: PRIMARY_BLUE,
                fontWeight: 700,
                borderRadius: 1,
                textTransform: 'uppercase',
                px: { xs: 6, sm: 3 },
                '&:hover': { bgcolor: alpha(PRIMARY_BLUE, 0.8) }
              }}>
              {t('home.payouts.manage')}
            </Button>
          </Box>

          {flcAddress && validateAddress(flcAddress) && (
            <>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress sx={{ color: PRIMARY_BLUE }} />
                </Box>
              ) : (
                <>
                  {generated && !nostrSettings && !showConfig && (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: SURFACE_MUTED,
                        borderRadius: 2,
                        textAlign: 'center',
                        mb: 2
                      }}>
                      <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                        {t('home.payouts.infoBanner')}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: SURFACE_MUTED,
                          color: PRIMARY_WHITE,
                          border: `1px solid ${BORDER_SUBTLE}`
                        }}
                        onClick={() => setShowConfig(true)}>
                        {t('home.payouts.addNow')}
                      </Button>
                    </Box>
                  )}

                  <Collapse in={showConfig}>
                    <MergeMiningConfigurator
                      flcAddress={flcAddress || ''}
                      onFlcAddressChange={(addr) => {
                        if (onAddressChange) onAddressChange(addr);
                      }}
                      initialPayouts={nostrSettings || undefined}
                      onCancel={() => setShowConfig(false)}
                    />
                  </Collapse>
                </>
              )}
            </>
          )}
        </Box>
      </GlassCard>
    </Container>
  );
};

export default MergeMining;
