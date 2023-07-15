let asigancion = async function headers() {
    return [{ source: '/(.*)', headers: [{ key: 'CROSS_ORIGIN_OPENER_POLICY', value: 'same-origin-allow-popups', }, ], }, ];
}