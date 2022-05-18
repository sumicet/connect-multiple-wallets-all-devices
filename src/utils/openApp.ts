export const openMobileApp = (name: 'MetaMask' | 'Coinbase') => {
    if (name === 'MetaMask') {
        window.open(
            `https://metamask.app.link/dapp/${window.location.href.replace(/(^\w+:|^)\/\//, '')}`,
            '_blank',
            'noopener noreferrer'
        );
    } else if (name === 'Coinbase') {
        window.open(
            `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(window.location.href)}`,
            '_blank',
            'noopener noreferrer'
        );
    }
};
