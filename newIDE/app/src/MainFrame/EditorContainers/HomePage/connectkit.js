'use client';

import { ConnectKitProvider, createConfig } from '@particle-network/connectkit';
import { authWalletConnectors } from '@particle-network/connectkit/auth';
import { mainnet, solana } from '@particle-network/connectkit/chains';
import { evmWalletConnectors } from '@particle-network/connectkit/evm';
import { injected as solaInjected, solanaWalletConnectors } from '@particle-network/connectkit/solana';
import { wallet, EntryPosition } from '@particle-network/connectkit/wallet';
import React from 'react';

// Retrieved from https://dashboard.particle.network
const projectId = process.env.PUBLIC_PROJECT_ID;
const clientKey = process.env.PUBLIC_CLIENT_KEY;
const appId = process.env.PUBLIC_APP_ID;
const walletConnectProjectId = process.env.PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId || !clientKey || !appId) {
    throw new Error('Please configure the Particle project in .env first!');
}

const config = createConfig({
    projectId,
    clientKey,
    appId,
    appearance: {
        recommendedWallets: [
            { walletId: 'metaMask', label: 'Recommended' },
            { walletId: 'coinbaseWallet', label: 'popular' },
        ],
        splitEmailAndPhone: false,
        collapseWalletList: false,
        hideContinueButton: false,
        connectorsOrder: ['email', 'phone', 'social', 'wallet'],
        language: 'en-US',
        mode: 'light',
        theme: {
            '--pcm-accent-color': '#ff4d4f',
        },
        logo: 'https://...',
        filterCountryCallingCode: (countries) => {
            return countries.filter((item) => item === 'US');
        },
    },
    walletConnectors: [
        evmWalletConnectors({
            metadata: { name: 'My App', icon: '', description: '', url: '' },
            walletConnectProjectId: walletConnectProjectId || 'Replace with your WalletConnect Project ID',
        }),
        authWalletConnectors({
            authTypes: ['email', 'google', 'apple', 'twitter', 'github'],
            fiatCoin: 'USD',
            promptSettingConfig: {
                promptMasterPasswordSettingWhenLogin: 1,
                promptPaymentPasswordSettingWhenSign: 1,
            },
        }),
        solanaWalletConnectors(),
    ],
    plugins: [
        wallet({
            entryPosition: EntryPosition.BR,
            visible: true,
        }),
    ],
    chains: [mainnet, solana],
});

export const ParticleConnectkit = ({ children }) => {
    return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>;
};
