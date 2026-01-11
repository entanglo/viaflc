import { Filter, Relay } from 'nostr-tools';
import { SubscriptionParams } from 'nostr-tools/lib/types/relay';

export class NostrClient {
  public relay: Relay;
  private publicKey?: string;
  private privateKey?: string;

  constructor(options: { relayUrl: string; privateKey?: string }) {
    this.relay = new Relay(options.relayUrl);

    if (options.privateKey) {
      this.privateKey = options.privateKey;
      // const privateKeyUint8Array = hexStringToUint8Array(options.privateKey); // Helper missing in this project
      // this.publicKey = getPublicKey(privateKeyUint8Array);
      // For now we don't strictly need PK to subscribe, only to publish if passing it.
      // But for this task's scope we generate a random key for publishing in the component or passing it here.
    }
  }

  async connect() {
    await this.relay.connect();
  }

  subscribeEvent(filters: Filter[], subscriptionParams: SubscriptionParams) {
    return this.relay.subscribe(filters, subscriptionParams);
  }

  publish(event: any) {
    return this.relay.publish(event);
  }
}
