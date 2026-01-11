import { Filter } from 'nostr-tools';
import { SubscriptionParams } from 'nostr-tools/lib/types/relay';
import { Service } from 'typedi';
import { NostrClient } from '@services/NostrClient';

@Service()
export class RelayService {
  public nostrClient: any;
  public settingsSubscription: any;
  public payoutsSubscription: any; // Kept for similarity, though we might not need all

  constructor() {}

  async connectRelay(relayUrl: string, privateKey?: string) {
    if (!this.nostrClient) {
      this.nostrClient = new NostrClient({ relayUrl, privateKey });
      await this.nostrClient.connect();
    } else {
      const currentRelayUrl = this.nostrClient.relay.url.replace(/\/+$/, '').toLowerCase();
      const newRelayUrl = relayUrl.replace(/\/+$/, '').toLowerCase();
      if (currentRelayUrl != newRelayUrl) {
        await this.stopSettings();
        await this.nostrClient.relay.close();
        this.nostrClient = new NostrClient({ relayUrl, privateKey });
        await this.nostrClient.connect();
      }
    }
  }

  subscribeSettings(address: string, subscriptionParams: SubscriptionParams) {
    this.stopSettings();

    const filters: Filter[] = [
      {
        kinds: [35555],
        limit: 1,
        [`#a`]: [address]
      }
    ];

    this.settingsSubscription = this.nostrClient.subscribeEvent(filters, subscriptionParams);
    return this.settingsSubscription;
  }

  async stopSettings() {
    if (this.settingsSubscription) {
      await this.settingsSubscription.close();
      this.settingsSubscription = null;
    }
  }

  async publishEvent(event: any) {
    if (this.nostrClient) {
      return this.nostrClient.publish(event);
    }
    throw new Error('NostrClient not initialized');
  }
}
