import { Event, Filter, finalizeEvent, generateSecretKey, SimplePool } from 'nostr-tools';
import { RELAY_URL } from '@constants/config';

export const KIND_MINER_SETTINGS = 35555;

export class NostrHelper {
  private pool: SimplePool;
  private relays: string[];

  constructor() {
    this.pool = new SimplePool();
    this.relays = [RELAY_URL];
  }

  async getMinerSettings(flcAddress: string): Promise<Event | null> {
    const filter: Filter = {
      kinds: [KIND_MINER_SETTINGS],
      '#a': [flcAddress],
      limit: 1
    };

    try {
      const event = await this.pool.get(this.relays, filter);
      return event;
    } catch (e) {
      console.error('Error fetching miner settings:', e);
      return null;
    }
  }

  async publishMinerSettings(
    flcAddress: string,
    payouts: Array<{ coin: string; address: string; signature: string }>
  ): Promise<boolean> {
    try {
      // Generate a fresh key for this event (ephemeral session)
      // in a real app, user might want to own this key, but for this flow:
      const sk = generateSecretKey();

      const tags = [['a', flcAddress]];
      payouts.forEach((p) => {
        tags.push([p.coin.toLowerCase(), p.address, p.signature]);
      });

      const eventTemplate = {
        kind: KIND_MINER_SETTINGS,
        created_at: Math.floor(Date.now() / 1000),
        tags: tags,
        content: 'Merge-mining payout addresses for Hash2Cash'
      };

      const event = finalizeEvent(eventTemplate, sk);

      await Promise.any(this.pool.publish(this.relays, event));
      return true;
    } catch (e) {
      console.error('Error publishing miner settings:', e);
      return false;
    }
  }

  close() {
    this.pool.close(this.relays);
  }
}
