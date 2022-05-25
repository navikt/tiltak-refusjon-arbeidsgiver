import amplitude from 'amplitude-js';

const key = () =>
    window.location.hostname === 'tiltak-refusjon.nav.no'
        ? 'a8243d37808422b4c768d31c88a22ef4'
        : '6ed1f00aabc6ced4fd6fcb7fcdc01b30';

const amplitudeInstance = amplitude.getInstance();

amplitudeInstance.init(key(), '', {
    apiEndpoint: 'amplitude.nav.no/collect',
    saveEvents: false,
    includeUtm: true,
    batchEvents: false,
    includeReferrer: true,
});

export default amplitudeInstance;
