import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from 'typedi';
import { FAQ_LINKS, MERGE_COIN_VALIDATORS, MERGE_MINING_COINS, RELAY_URL } from '@constants/config';
import { PayoutConfig } from '@interfaces/PayoutConfig';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { IconInput, IconWrapper, StyledIconInputBase } from '@components/styled/IconInput';
import { SimpleInput } from '@components/styled/SimpleInput';
import { RelayService } from '@services/api/RelayService';
import {
  BORDER_TRANSPARENT_10,
  BORDER_TRANSPARENT_20,
  LINK_COLOR,
  PRIMARY_BLUE,
  PRIMARY_GOLD,
  PRIMARY_WHITE,
  SURFACE_MODAL,
  SURFACE_TRANSPARENT_05
} from '@styles/colors';

interface Props {
  flcAddress: string;
  onFlcAddressChange?: (addr: string) => void;
  initialPayouts?: PayoutConfig[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MergeMiningConfigurator = ({
  flcAddress,
  onFlcAddressChange: _onFlcAddressChange,
  initialPayouts,
  onSuccess,
  onCancel
}: Props) => {
  const { t } = useTranslation();
  const [payouts, setPayouts] = useState<PayoutConfig[]>(initialPayouts || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedCoinToAdd, setSelectedCoinToAdd] = useState<string>('');
  const [showHelp, setShowHelp] = useState(false);

  const relayService = Container.get(RelayService);

  const allCoins = MERGE_MINING_COINS.filter((c) => c.code !== 'FLC' && c.active);

  const availableToAdd = allCoins.filter((c) => !payouts.find((p) => p.coin === c.code));

  useEffect(() => {
    if (initialPayouts) {
      setPayouts(initialPayouts);
    }
  }, [initialPayouts]);

  const handleAddCoin = () => {
    if (selectedCoinToAdd) {
      setPayouts([...payouts, { coin: selectedCoinToAdd, address: '', signature: '' }]);
      setSelectedCoinToAdd('');
    }
  };

  const handleRemoveCoin = (coinCode: string) => {
    setPayouts(payouts.filter((p) => p.coin !== coinCode));
    setError(null);
  };

  const handleChange = (coin: string, field: 'address' | 'signature', value: string) => {
    setPayouts((prev) => prev.map((p) => (p.coin === coin ? { ...p, [field]: value } : p)));
  };

  const validate = (): boolean => {
    for (const p of payouts) {
      const regex = MERGE_COIN_VALIDATORS[p.coin];
      if (regex && !regex.test(p.address)) {
        setError(t('home.payouts.invalidAddress', { coin: p.coin }));
        return false;
      }
      if (!p.address) {
        setError(t('home.payouts.enterAddress', { coin: p.coin }));
        return false;
      }
      if (!p.signature || p.signature.trim() === '') {
        setError(t('home.payouts.enterSignature', { coin: p.coin }));
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handlePublish = async () => {
    if (!validate()) return;
    if (payouts.length === 0) {
      setError(t('home.payouts.errorNoPayouts'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Connect first (singleton handles logic)
      await relayService.connectRelay(RELAY_URL);

      const tags = [['a', flcAddress]];
      payouts.forEach((p) => {
        tags.push([p.coin.toLowerCase(), p.address, p.signature]);
      });

      // Creating ephemeral key:
      const { generateSecretKey, getPublicKey, finalizeEvent } = await import('nostr-tools');
      const sk = generateSecretKey();
      const event = {
        kind: 35_555,
        created_at: Math.floor(Date.now() / 1000),
        tags: tags,
        content: '',
        pubkey: getPublicKey(sk)
      };

      const signedEvent = finalizeEvent(event, sk);
      await relayService.publishEvent(signedEvent);

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (e) {
      console.error(e);
      setError(t('home.payouts.publishError'));
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = useMemo(() => {
    const normalize = (list: PayoutConfig[]) =>
      list
        .map((p) => ({ coin: p.coin, address: p.address.trim(), signature: p.signature.trim() }))
        .sort((a, b) => a.coin.localeCompare(b.coin));

    const initial = normalize(initialPayouts || []);
    const current = normalize(payouts);

    return JSON.stringify(initial) !== JSON.stringify(current);
  }, [payouts, initialPayouts]);

  if (success) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          {t('home.payouts.success')}
        </Alert>
        <Button onClick={onSuccess} variant="outlined">
          {t('home.payouts.updateAddresses')}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 1 }}>
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 1, sm: 2 },
            mb: 2
          }}>
          <Typography sx={{ color: PRIMARY_WHITE, fontWeight: 600 }}>
            {t('home.payouts.step2')}
          </Typography>
          <Box
            onClick={() => setShowHelp(true)}
            sx={{
              cursor: 'pointer',
              px: 1,
              py: 0.25,
              borderRadius: 1.5,
              fontSize: '0.75rem',
              fontWeight: 400,
              backgroundColor: showHelp ? PRIMARY_BLUE : 'rgba(255,255,255,0.1)',
              color: showHelp ? '#000' : PRIMARY_WHITE,
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: showHelp ? PRIMARY_BLUE : 'rgba(255,255,255,0.2)'
              }
            }}>
            {t('home.payouts.howToSignBadge')}
          </Box>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
          <span
            dangerouslySetInnerHTML={{
              __html: t('home.payouts.step2Help').replace(
                '[[link:tWallet]]',
                `<a href="#" style="color:${LINK_COLOR}">tWallet</a>`
              )
            }}
          />
        </Typography>

        <Stack spacing={2} sx={{ mb: 2 }}>
          {payouts.map((p) => {
            const coinData = MERGE_MINING_COINS.find((c) => c.code === p.coin);
            return (
              <Box
                key={p.coin}
                sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center'
                }}>
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <IconInput>
                      <IconWrapper>
                        {coinData ? (
                          <img
                            src={coinData.icon}
                            alt={p.coin}
                            width={24}
                            height={24}
                            style={{ borderRadius: '50%' }}
                          />
                        ) : (
                          <Typography variant="caption">{p.coin}</Typography>
                        )}
                      </IconWrapper>
                      <StyledIconInputBase
                        placeholder={t('home.payouts.addressPlaceholder', { coin: p.coin })}
                        value={p.address}
                        onChange={(e) => handleChange(p.coin, 'address', e.target.value)}
                      />
                    </IconInput>
                  </Box>
                  <Box sx={{ flex: 1, width: '100%' }}>
                    <SimpleInput
                      placeholder={t('home.payouts.signaturePlaceholder')}
                      value={p.signature}
                      onChange={(e) => handleChange(p.coin, 'signature', e.target.value)}
                    />
                  </Box>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveCoin(p.coin)}
                  sx={{ bgcolor: SURFACE_TRANSPARENT_05 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            );
          })}
        </Stack>

        {availableToAdd.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Select
              value={selectedCoinToAdd}
              displayEmpty
              onChange={(e) => setSelectedCoinToAdd(e.target.value)}
              sx={{
                color: PRIMARY_WHITE,
                border: `1px solid ${BORDER_TRANSPARENT_20}`,
                height: 40,
                minWidth: 150,
                '& .MuiSelect-select': { py: 1 }
              }}>
              <MenuItem value="" disabled>
                {t('home.payouts.selectCoin')}
              </MenuItem>
              {availableToAdd.map((c) => (
                <MenuItem key={c.code} value={c.code}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img src={c.icon} width={20} height={20} alt={c.code} />
                    {c.code}
                  </Box>
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="outlined"
              onClick={handleAddCoin}
              disabled={!selectedCoinToAdd}
              sx={{ height: 40 }}>
              {t('home.payouts.add')}
            </Button>
          </Box>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {hasChanges && !error && (
        <Alert
          severity="warning"
          sx={{ mb: 2, bgcolor: alpha(PRIMARY_GOLD, 0.1), color: PRIMARY_GOLD }}>
          {t('home.payouts.warningUnpublished')}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        {onCancel && (
          <Button onClick={onCancel} color="inherit">
            {t('home.payouts.cancel')}
          </Button>
        )}
        <Button
          variant="contained"
          onClick={handlePublish}
          disabled={loading || payouts.length === 0 || !hasChanges}
          sx={{
            bgcolor: PRIMARY_BLUE,
            fontWeight: 700,
            '&:hover': { bgcolor: alpha(PRIMARY_BLUE, 0.8) }
          }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : t('home.payouts.publish')}
        </Button>
      </Box>

      <Dialog
        open={showHelp}
        onClose={() => setShowHelp(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: SURFACE_MODAL,
            color: PRIMARY_WHITE,
            border: `1px solid ${BORDER_TRANSPARENT_10}`
          }
        }}>
        <DialogTitle sx={{ fontWeight: 600 }}>{t('home.payouts.howToSignTitle')}</DialogTitle>
        <DialogContent dividers sx={{ borderColor: BORDER_TRANSPARENT_10 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            <span
              dangerouslySetInnerHTML={{
                __html: t('home.payouts.howToSignSubtitle').replace(
                  '[[link:tWallet]]',
                  `<a href="${FAQ_LINKS.tWallet.link}" target="_blank" rel="noopener noreferrer" style="color:${LINK_COLOR}">tWallet</a>`
                )
              }}
            />
          </Typography>

          <Box
            component="img"
            src="/img/how-to-sign.png"
            alt="How to sign"
            sx={{
              width: '100%',
              borderRadius: 1,
              mb: 3,
              border: `1px solid ${BORDER_TRANSPARENT_10}`
            }}
          />

          <List dense>
            {[1, 2, 3, 4].map((step) => (
              <ListItem key={step} sx={{ px: 0 }}>
                <Typography variant="body2">{t(`home.payouts.howToSignStep${step}`)}</Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHelp(false)} color="inherit">
            {t('home.payouts.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MergeMiningConfigurator;
