'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';

interface PhantomPublicKey {
  toString(): string;
}

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: PhantomPublicKey | null;
  connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: PhantomPublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
    phantom?: { solana?: PhantomProvider };
  }
}

function getPhantomProvider(): PhantomProvider | undefined {
  if (typeof window === 'undefined') return undefined;
  if (window.phantom?.solana?.isPhantom) return window.phantom.solana;
  if (window.solana?.isPhantom) return window.solana;
  return undefined;
}

function truncate(address: string) {
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
}

type WalletState = 'idle' | 'connecting' | 'connected' | 'not-installed' | 'rejected';

const WALLET_OPTIONS = [
  { id: 'phantom', name: 'Phantom', available: true },
  { id: 'solflare', name: 'Solflare', available: false },
  { id: 'backpack', name: 'Backpack', available: false },
];

export default function WalletConnectButton() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<WalletState>('idle');
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const provider = getPhantomProvider();
    if (!provider) return;

    provider.connect({ onlyIfTrusted: true }).then(
      (resp) => {
        setAddress(resp.publicKey.toString());
        setState('connected');
      },
      () => {
        // no prior trusted session — stay idle, no popup was shown
      },
    );

    const handleAccountChanged = (...args: unknown[]) => {
      const pk = args[0] as PhantomPublicKey | null | undefined;
      if (pk) {
        setAddress(pk.toString());
        setState('connected');
      } else {
        setAddress(null);
        setState('idle');
      }
    };
    const handleDisconnect = () => {
      setAddress(null);
      setState('idle');
    };

    provider.on('accountChanged', handleAccountChanged);
    provider.on('disconnect', handleDisconnect);
    return () => {
      provider.removeListener('accountChanged', handleAccountChanged);
      provider.removeListener('disconnect', handleDisconnect);
    };
  }, []);

  const handleSelect = async (id: string) => {
    if (id !== 'phantom') return;
    const provider = getPhantomProvider();
    if (!provider) {
      setState('not-installed');
      return;
    }
    setState('connecting');
    try {
      const resp = await provider.connect();
      setAddress(resp.publicKey.toString());
      setState('connected');
    } catch {
      setState('rejected');
    }
  };

  const handleDisconnect = async () => {
    const provider = getPhantomProvider();
    try {
      await provider?.disconnect();
    } catch {
      // ignore — provider may already be disconnected
    }
    setAddress(null);
    setState('idle');
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={state === 'connected' ? 'nav-connect is-connected' : 'nav-connect'}
        onClick={() => setOpen(true)}
      >
        {state === 'connected' && address ? (
          <>
            <span className="wallet-dot" aria-hidden="true" />
            {truncate(address)}
          </>
        ) : (
          'Connect Wallet'
        )}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} labelledBy="wallet-modal-title">
        {state === 'connected' && address ? (
          <div className="wallet-modal">
            <span className="wallet-modal-badge">Wallet connected</span>
            <h2 id="wallet-modal-title" className="wallet-modal-title">Connected</h2>
            <p className="wallet-modal-address">{truncate(address)}</p>
            <p className="wallet-modal-note">
              Connected via Phantom. Only your public address is shared — no transaction or spending approval was
              requested.
            </p>
            <button type="button" className="btn-ghost wallet-disconnect" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        ) : (
          <div className="wallet-modal">
            <h2 id="wallet-modal-title" className="wallet-modal-title">Connect a wallet</h2>
            <p className="wallet-modal-note">
              Connecting only requests your public address for identification — no transaction or funds are involved.
            </p>
            {state === 'not-installed' ? (
              <p className="wallet-modal-error">
                Phantom isn&rsquo;t installed.{' '}
                <a href="https://phantom.app/" target="_blank" rel="noreferrer">
                  Get Phantom
                </a>{' '}
                and try again.
              </p>
            ) : null}
            {state === 'rejected' ? (
              <p className="wallet-modal-error">Connection request was rejected.</p>
            ) : null}
            <div className="wallet-list">
              {WALLET_OPTIONS.map((wallet) => (
                <button
                  key={wallet.id}
                  type="button"
                  className="wallet-option"
                  disabled={!wallet.available || state === 'connecting'}
                  onClick={() => handleSelect(wallet.id)}
                >
                  <span className="wallet-option-name">{wallet.name}</span>
                  <span className="wallet-option-status">
                    {!wallet.available ? 'Coming soon' : state === 'connecting' ? 'Confirm in Phantom…' : 'Connect'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
